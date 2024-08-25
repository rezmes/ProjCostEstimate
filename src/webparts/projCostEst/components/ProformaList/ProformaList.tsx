import * as React from "react";
import styles from "./ProformaList.module.scss";
import { sp } from "@pnp/sp/presets/all";
import { IProforma } from "../../Modules/Module";
import { ProformaForm } from "./ProformaForm";
import { ProformaDropdown } from "./ProformaDropdown";
import { Dropdown, IDropdownOption } from "office-ui-fabric-react/lib/Dropdown";

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
  newProforma: {
    ReqTitle: string;
    ProformaNumber: number;
    CustomerNameId: any;
  };
  isCreating: boolean;
  customerContacts: ICustomDropdownOption[];
  selectedCustomerId: string;
  workPhone: string;
}

export default class ProformaList extends React.Component<
  IProformaListProps,
  IProformaListState
> {
  constructor(props: IProformaListProps) {
    super(props);
    this.state = {
      customerContacts: [],
      selectedCustomerId: "",
      workPhone: "",
      items: [],
      selectedItem: null,
      newProforma: { ReqTitle: "", ProformaNumber: 0, CustomerNameId: null },
      isCreating: false,
    };
  }

  public async componentDidMount() {
    await this.fetchProformas();
    await this.fetchCustomerContacts();
  }

  fetchCustomerContacts = async () => {
    try {
      const items = await sp.web.lists
        .getByTitle("CustomerContacts")
        .items.select("ID", "Title", "WorkPhone")
        .get();

      const customerContacts: ICustomDropdownOption[] = await Promise.all(
        items.map(async (item) => ({
          key: item.ID,
          text: item.Title,
          phone: item.WorkPhone,
          url: await sp.web.lists
            .getByTitle("CustomerContacts")
            .items.getById(item.ID)
            .select("FileRef")
            .get()
            .then((i) => i.FileRef),
        }))
      );

      this.setState({ customerContacts });
    } catch (error) {
      console.error("Error fetching customer contacts", error);
    }
  };

  fetchProformas = async () => {
    const { parentFormListName } = this.props;

    try {
      const items: IProforma[] = await sp.web.lists
        .getByTitle(parentFormListName)
        .items.select("ID", "ReqTitle", "CustomerNameId")
        .get();

      this.setState({ items });
    } catch (error) {
      console.error("Error fetching proformas", error);
    }
  };

  handleSelectChange = (value: string) => {
    const selectedIndex = parseInt(value, 10);

    if (selectedIndex >= 0 && selectedIndex < this.state.items.length) {
      const selectedItem = this.state.items[selectedIndex];
      this.setState({ selectedItem });
      this.props.onProformaSelect(selectedItem);
    } else {
      console.error("Invalid selection index:", selectedIndex);
    }
  };

  handleSelect = (item: { label: string; value: any }) => {
    const selectedItem = this.state.items.find(
      (proforma) => proforma.ID === item.value
    );
    if (selectedItem) {
      this.setState({ selectedItem });
      this.props.onProformaSelect(selectedItem);
    }
  };

  startCreatingProforma = async () => {
    const { parentFormListName } = this.props;

    try {
      const lastProforma = await sp.web.lists
        .getByTitle(parentFormListName)
        .items.select("ProformaNumber")
        .orderBy("ProformaNumber", false)
        .top(1)
        .get<{ ProformaNumber: string }[]>();

      const nextProformaNumber =
        lastProforma.length > 0
          ? parseInt(lastProforma[0].ProformaNumber, 10) + 1
          : 1;

      this.setState({
        newProforma: {
          ReqTitle: "",
          ProformaNumber: nextProformaNumber,
          CustomerNameId: null,
        },
        isCreating: true,
      });
    } catch (error) {
      console.error("Error fetching the last Proforma number", error);
    }
  };

  handleNewProformaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    this.setState((prevState) => ({
      newProforma: {
        ...prevState.newProforma,
        [name]: value,
      },
    }));
  };

  saveNewProforma = async () => {
    const { newProforma, selectedCustomerId } = this.state;
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
          CustomerNameId: selectedCustomerId
            ? { results: [selectedCustomerId] }
            : null,
        });

      const newProformaWithDate = {
        ID: newItem.data.ID,
        ReqTitle: newProforma.ReqTitle,
        ProformaNumber: newProforma.ProformaNumber,
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

  cancelCreatingProforma = () => {
    this.setState({
      isCreating: false,
      newProforma: { ReqTitle: "", ProformaNumber: 0, CustomerNameId: null },
    });
  };

  closeSelectedProforma = () => {
    this.setState({ selectedItem: null });
    this.props.onProformaSelect(null);
  };

  onCustomerChange = (
    event: React.FormEvent<HTMLDivElement>,
    option?: ICustomDropdownOption
  ) => {
    const selectedCustomerId = option ? (option.key as string) : "";
    const workPhone = option ? (option.phone as string) : "";
    this.setState({ selectedCustomerId, workPhone });
  };

  render(): React.ReactElement<IProformaListProps> {
    const {
      items,
      isCreating,
      newProforma,
      selectedItem,
      customerContacts,
      workPhone,
    } = this.state;
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
            onClick={
              isCreating
                ? this.cancelCreatingProforma
                : this.closeSelectedProforma
            }
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
            selectedItem={
              selectedItem
                ? `${selectedItem.ReqTitle} - ${selectedItem.ProformaNumber}`
                : ""
            }
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
      </div>
    );
  }
}
