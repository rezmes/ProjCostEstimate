import * as React from "react";
import styles from "./ProformaList.module.scss";
import { sp } from "@pnp/sp/presets/all";
import { IProforma } from "../../Modules/Module";
import { ProformaForm } from "./ProformaForm";
import { ProformaDropdown } from "./ProformaDropdown";
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';

interface ICustomDropdownOption extends IDropdownOption {
  phone?: string;
  url?: string;
}

export interface IProformaListProps {
  onProformaSelect: (selectedProforma: IProforma) => void;
  parentFormListName: string;
}

export interface IProformaListState {
  items: IProforma[];
  selectedItem: IProforma | null;
  newProforma: { ReqTitle: string; ProformaNumber: number };
  isCreating: boolean;
  customerContacts: ICustomDropdownOption[];
  selectedCustomer: string;
  workPhone: string;
}

export default class ProformaList extends React.Component<IProformaListProps, IProformaListState> {
  constructor(props: IProformaListProps) {
    super(props);
    this.state = {
      customerContacts: [],
      selectedCustomer: '',
      workPhone: '',
      items: [],
      selectedItem: null,
      newProforma: { ReqTitle: "", ProformaNumber: 0 },
      isCreating: false,
    };
  }

  public async componentDidMount() {
    this.fetchProformas();
    this.fetchCustomerContacts();
  }

fetchCustomerContacts = async () => {
  const items = await sp.web.lists.getByTitle('CustomerContacts').items.select('ID', 'Title', 'WorkPhone').get();
  const customerContacts: ICustomDropdownOption[] = items.map(item => ({
    key: item.ID,
    text: item.Title,
    phone: item.WorkPhone,
    url: `${sp.web.lists.getByTitle('CustomerContacts').items.getById(item.ID).select('FileRef').get().then(i => i.FileRef)}`
  }));
  this.setState({ customerContacts });
}


  private async fetchProformas() {
    const { parentFormListName } = this.props;

    try {
      const items: any[] = await sp.web.lists
        .getByTitle(parentFormListName)
        .items.select("ID", "ReqTitle", "ProformaNumber", "Created")
        .orderBy("Created", true)
        .get<IProforma[]>();

      const itemsWithDate = items.map((item) => ({
        ...item,
        Created: new Date(item.Created),
      }));

      this.setState({ items: itemsWithDate });
    } catch (error) {
      console.error("Error fetching lists", error);
    }
  }

  private handleSelectChange = (value: string) => {
    const selectedIndex = parseInt(value, 10);

    if (!isNaN(selectedIndex) && selectedIndex >= 0 && selectedIndex < this.state.items.length) {
      const selectedItem = this.state.items[selectedIndex];
      this.setState({ selectedItem });
      this.props.onProformaSelect(selectedItem);
    } else {
      console.error("Invalid selection index:", selectedIndex);
    }
  };

  private handleSelect = (item: { label: string; value: any }) => {
    const selectedItem = this.state.items.find((proforma) => proforma.ID === item.value);
    if (selectedItem) {
      this.setState({ selectedItem });
      this.props.onProformaSelect(selectedItem);
    }
  };

  private startCreatingProforma = async () => {
    const { parentFormListName } = this.props;

    try {
      const lastProforma = await sp.web.lists
        .getByTitle(parentFormListName)
        .items.select("ProformaNumber")
        .orderBy("ProformaNumber", false)
        .top(1)
        .get<{ ProformaNumber: string }[]>();

      const nextProformaNumber = lastProforma.length > 0 ? +parseInt(lastProforma[0].ProformaNumber, 10) + 1 : 1;

      this.setState({
        newProforma: { ReqTitle: "", ProformaNumber: nextProformaNumber },
        isCreating: true,
      });
    } catch (error) {
      console.error("Error fetching the last Proforma number", error);
    }
  };

  private handleNewProformaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    this.setState((prevState) => ({
      newProforma: {
        ...prevState.newProforma,
        [name]: value,
      },
    }));
  };

  private saveNewProforma = async () => {
    const { newProforma } = this.state;
    const { parentFormListName } = this.props;

    if (!newProforma.ReqTitle.trim() || newProforma.ProformaNumber <= 0) {
      console.error("Invalid Proforma data");
      return;
    }

    try {
      const newItem = await sp.web.lists
        .getByTitle(parentFormListName)
        .items.add({
          ReqTitle: newProforma.ReqTitle,
          ProformaNumber: newProforma.ProformaNumber.toString(),
        });

      const newProformaWithDate = {
        ID: newItem.data.ID,
        ReqTitle: newProforma.ReqTitle,
        ProformaNumber: newProforma.ProformaNumber,
        Created: new Date(),
      };

      this.setState((prevState) => ({
        items: [...prevState.items, newProformaWithDate],
        selectedItem: newProformaWithDate,
        isCreating: false,
      }));

      this.props.onProformaSelect(newProformaWithDate);
    } catch (error) {
      console.error("Error saving new Proforma", error);
    }
  };

  private cancelCreatingProforma = () => {
    this.setState({
      isCreating: false,
      newProforma: { ReqTitle: "", ProformaNumber: 0 },
    });
  };

  private closeSelectedProforma = () => {
    this.setState({ selectedItem: null });
    this.props.onProformaSelect(null);
  };

  private onCustomerChange = (event: React.FormEvent<HTMLDivElement>, option?: ICustomDropdownOption) => {
    const selectedCustomer = option ? option.key as string : '';
    const workPhone = option ? option.phone as string : '';
    this.setState({ selectedCustomer, workPhone });
  }

render(): React.ReactElement<IProformaListProps> {
  const { items, isCreating, newProforma, selectedItem, customerContacts, workPhone } = this.state;
  const dropBoxOptions = items.map((item, index) => ({
    label: `${item.ReqTitle} - ${item.ProformaNumber}`,
    value: item.ID,
  }));

  return (
    <div className={styles.proformaList}>
      <h2 className={styles.title}>فرم‌های برآورد هزینه</h2>
      {isCreating || selectedItem ? (
        <button
          aria-label="Close"
          onClick={isCreating ? this.cancelCreatingProforma : this.closeSelectedProforma}
        >
          بستن
        </button>
      ) : (
        <button aria-label="فرم جدید" onClick={this.startCreatingProforma}>
          فرم جدید
        </button>
      )}
      {isCreating && (
        <ProformaForm
          newProforma={newProforma}
          onChange={this.handleNewProformaChange}
          onSave={this.saveNewProforma}
          onCancel={this.cancelCreatingProforma}
        />
      )}
      {!isCreating && (
        <ProformaDropdown
          items={dropBoxOptions}
          selectedItem={selectedItem ? `${selectedItem.ReqTitle} - ${selectedItem.ProformaNumber}` : ""}
          onChange={this.handleSelectChange}
          onSelect={this.handleSelect}
        />
      )}
      <Dropdown
        placeHolder="Select a Customer"
        options={customerContacts}
        onChange={this.onCustomerChange}
      />
      {workPhone && (
        <div>
          <strong>Phone:</strong> {workPhone}
        </div>
      )}
      {customerContacts.map(contact => (
        <div key={contact.key}>
          <a href={contact.url} target="_blank" rel="noopener noreferrer">{contact.text}</a>
        </div>
      ))}
    </div>
  );
}

}

