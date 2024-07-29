import * as React from "react";
import styles from "./ProformaList.module.scss";
import { sp } from "@pnp/sp/presets/all";

export interface IProformaListProps {
  onProformaSelect: (selectedProforma: {
    ID: number;
    CustomerName: string;
    ProformaNumber: number;
    Created: Date;
  }) => void;
}

export interface IProformaListState {
  items: { ID: number; CustomerName: string; ProformaNumber: number; Created: Date }[];
  selectedItem: { ID: number; CustomerName: string; ProformaNumber: number; Created: Date } | null;
  newProforma: { CustomerName: string; ProformaNumber: number };
  isCreating: boolean;
}

export default class ProformaList extends React.Component<IProformaListProps, IProformaListState> {
  constructor(props: IProformaListProps) {
    super(props);
    this.state = {
      items: [],
      selectedItem: null,
      newProforma: { CustomerName: '', ProformaNumber: 0 },
      isCreating: false,
    };
  }

  public async componentDidMount() {
    this.fetchProformas();
  }

  private async fetchProformas() {
    try {
      const items: any[] = await sp.web.lists
        .getByTitle("ProformaList")
        .items.select("ID", "CustomerName", "ProformaNumber", "Created")
        .orderBy("Created", true)
        .get<{ ID: number; CustomerName: string; ProformaNumber: number; Created: string }[]>();

      const itemsWithDate = items.map((item) => ({
        ...item,
        Created: new Date(item.Created),
      }));

      console.log("Fetched Proformas: ", itemsWithDate); // Log to verify

      this.setState({ items: itemsWithDate });
    } catch (error) {
      console.error("Error fetching lists", error);
    }
  }

  private handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedIndex = event.target.value;
    const selectedItem = this.state.items[Number(selectedIndex)];
    this.setState({ selectedItem });
    this.props.onProformaSelect(selectedItem);
  };

  private startCreatingProforma = async () => {
    try {
      const lastProforma = await sp.web.lists
        .getByTitle("ProformaList")
        .items.select("ProformaNumber")
        .orderBy("ProformaNumber", false)
        .top(1)
        .get<{ ProformaNumber: number }[]>();

      const nextProformaNumber = lastProforma.length > 0 ? lastProforma[0].ProformaNumber + 1 : 1;

      this.setState({
        newProforma: { CustomerName: '', ProformaNumber: nextProformaNumber },
        isCreating: true,
      });
    } catch (error) {
      console.error("Error fetching last Proforma number", error);
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
    try {
      const newItem = await sp.web.lists.getByTitle("ProformaList").items.add({
        CustomerName: newProforma.CustomerName,
        ProformaNumber: newProforma.ProformaNumber,
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

  public render(): React.ReactElement<IProformaListProps> {
    const { items, isCreating, newProforma } = this.state;
    return (
      <div className={styles.projCostTable}>
        <h2 className={styles.title}>فرم های برآورد هزینه</h2>
        <button onClick={this.startCreatingProforma}>Create New Proforma</button>
        {isCreating && (
          <div className={styles.newProformaForm}>
            <h3>New Proforma</h3>
            <label>
              Customer Name:
              <input
                type="text"
                name="CustomerName"
                value={newProforma.CustomerName}
                onChange={this.handleNewProformaChange}
              />
            </label>
            <label>
              Proforma Number:
              <input type="text" value={newProforma.ProformaNumber} readOnly />
            </label>
            <button onClick={this.saveNewProforma}>Save</button>
          </div>
        )}
        <label htmlFor="proforma-select" className={styles.label}>انتخاب فرم برآورد هزینه:</label>
        <select id="proforma-select" onChange={this.handleSelectChange} defaultValue="">
          <option value="" disabled>انتخاب مشتری</option>
          {items.map((item, index) => (
            <option key={index} value={index}>
              {item.CustomerName} - {item.ProformaNumber}
            </option>
          ))}
        </select>
      </div>
    );
  }
}
