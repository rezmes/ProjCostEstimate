import * as React from "react";
import styles from "./ProformaList.module.scss";
import { sp } from "@pnp/sp/presets/all";
import { IProforma } from "../../Modules/Module";
import { ProformaForm } from "./ProformaForm";
import { ProformaDropdown } from "./ProformaDropdown";

export interface IProformaListProps {
  onProformaSelect: (selectedProforma: IProforma) => void;
  parentFormListName: string;
}

export interface IProformaListState {
  items: IProforma[];
  selectedItem: IProforma | null;
  newProforma: { CustomerName: string; ProformaNumber: number };
  isCreating: boolean;
}

export default class ProformaList extends React.Component<
  IProformaListProps,
  IProformaListState
> {
  constructor(props: IProformaListProps) {
    super(props);
    this.state = {
      items: [],
      selectedItem: null,
      newProforma: { CustomerName: "", ProformaNumber: 0 },
      isCreating: false,
    };
  }

  public async componentDidMount() {
    console.log("Component did mount");
    this.fetchProformas();
  }

  private async fetchProformas() {
    const { parentFormListName } = this.props;

    try {
      const items: any[] = await sp.web.lists
        .getByTitle(parentFormListName)
        .items.select("ID", "CustomerName", "ProformaNumber", "Created")
        .orderBy("Created", true)
        .get<IProforma[]>();

      const itemsWithDate = items.map((item) => ({
        ...item,
        Created: new Date(item.Created),
      }));

      console.log("Fetched Proformas: ", itemsWithDate);

      this.setState({ items: itemsWithDate });
    } catch (error) {
      console.error("Error fetching lists", error);
    }
  }

  private handleSelectChange = (value: string) => {
    const selectedIndex = parseInt(value, 10);

    if (
      !isNaN(selectedIndex) &&
      selectedIndex >= 0 &&
      selectedIndex < this.state.items.length
    ) {
      const selectedItem = this.state.items[selectedIndex];
      this.setState({ selectedItem });
      this.props.onProformaSelect(selectedItem);
    } else {
      console.error("Invalid selection index:", selectedIndex);
    }
  };

  private handleSelect = (item: { label: string; value: any }) => {
    const selectedItem = this.state.items.find(
      (proforma) => proforma.ID === item.value
    );
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

      const nextProformaNumber =
        lastProforma.length > 0 ? +lastProforma[0].ProformaNumber + 1 : 1;

      this.setState({
        newProforma: { CustomerName: "", ProformaNumber: nextProformaNumber },
        isCreating: true,
      });
    } catch (error) {
      console.error("Error fetching the last Proforma number", error);
    }
  };

  private handleNewProformaChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
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

    if (!newProforma.CustomerName.trim() || newProforma.ProformaNumber <= 0) {
      console.error("Invalid Proforma data");
      return;
    }

    try {
      const newItem = await sp.web.lists
        .getByTitle(parentFormListName)
        .items.add({
          CustomerName: newProforma.CustomerName,
          ProformaNumber: newProforma.ProformaNumber.toString(),
        });

      const newProformaWithDate = {
        ID: newItem.data.ID,
        CustomerName: newProforma.CustomerName,
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
      newProforma: { CustomerName: "", ProformaNumber: 0 },
    });
  };

  private closeSelectedProforma = () => {
    this.setState({ selectedItem: null });
    this.props.onProformaSelect(null);
  };

  render(): React.ReactElement<IProformaListProps> {
    const { items, isCreating, newProforma, selectedItem } = this.state;
    const dropBoxOptions = items.map((item, index) => ({
      label: `${item.CustomerName} - ${item.ProformaNumber}`,
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
                ? `${selectedItem.CustomerName} - ${selectedItem.ProformaNumber}`
                : ""
            }
            onChange={this.handleSelectChange}
            onSelect={this.handleSelect}
          />
        )}
      </div>
    );
  }
}
