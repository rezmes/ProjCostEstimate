import * as React from "react";
import styles from "./ProformaList.module.scss";
import { sp } from "@pnp/sp/presets/all";

export interface IProformaListProps {}

export interface IProformaListState {
  items: { CustomerName: string; ProformaNumber: number; Created: Date }[];
  selectedItem: {
    CustomerName: string;
    ProformaNumber: number;
    Created: Date;
  } | null; // To store the selected item
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
    };
  }
  public async componentDidMount() {
    try {
      const items: any[] = await sp.web.lists
        .getByTitle("ProformaList")
        .items.select("CustomerName", "ProformaNumber", "Created")
        .top(5)
        .orderBy("Created", true)
        .get<
          { CustomerName: string; ProformaNumber: number; Created: string }[]
        >();
      const itemsWithDate = items.map((item) => ({
        ...item,
        Created: new Date(item.Created),
      }));

      this.setState({ items: itemsWithDate });
    } catch (error) {
      console.error("Error fetching lists", error);
    }
  }
 // Method to handle dropdown selection
  private handleSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedIndex = event.target.value;
    const selectedItem = this.state.items[Number(selectedIndex)];
    this.setState({ selectedItem });
  };

  public render(): React.ReactElement<IProformaListProps> {
    /**
     * componentDidMount
     */

    return (
      <div className={styles.projCostTable}>
        <h2 className={styles.title}>فرم های برآورد هزینه</h2>

                {/* Label for the dropdown */}
                <label htmlFor="proforma-select" className={styles.label}>انتخاب فرم برآورد هزینه:</label>
        <select id="proforma-select" onChange={this.handleSelectChange} defaultValue="">
        <option value="" disabled>انتخاب مشتری</option>
          {this.state.items.map((item, index) => (
            <option key={index} value={index}>
              {item.CustomerName} - {item.ProformaNumber}
            </option>
          ))}
          </select>
          {this.state.selectedItem && (
          <div className={styles.selectedItemDetails}>
            <h3>مشخصات:</h3>
            <p><strong>نام مشتری:</strong> {this.state.selectedItem.CustomerName}</p>
            <p><strong>شماره فرم:</strong> {this.state.selectedItem.ProformaNumber}</p>
            <p><strong>تاریخ ایجاد:</strong> {this.state.selectedItem.Created.toLocaleDateString('fa-IR')}</p>
          </div>
        )}


        {/* <table>
          <thead>
            <tr>
              <th>نام مشتری</th>
              <th>شماره فرم</th>
              <th>تاریخ ایجاد</th>
            </tr>
          </thead>
          <tbody>
            {this.state.items.map((item, index) => (
              <tr key={index}>
                <td>{this.state.selectedItem.CustomerName}</td>
                <td>{this.state.selectedItem.ProformaNumber}</td>
                <td>{this.state.selectedItem.Created.toLocaleDateString('fa-IR')}</td>
              </tr>
            ))}
          </tbody>
        </table> */}
      </div>
    );
  }
}
