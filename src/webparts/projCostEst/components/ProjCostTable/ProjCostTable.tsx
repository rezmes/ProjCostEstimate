import * as React from 'react';
import styles from './ProjCostTable.module.scss';
import { sp } from "@pnp/sp/presets/all";
import { IProjCostTableProps } from './IProjCostTableProps';
import  { IProjCostTableState } from './IProjCostTableState';


export default class ProjCostTable extends React.Component<IProjCostTableProps, IProjCostTableState> {
  constructor(props: IProjCostTableProps) {
    super(props);
    this.state = {
      items: []
    };
  }

  public async componentDidMount() {
    try {
      // Use the PnP JS library with OData operators to fetch items from "invoiceList"
      const items = await sp.web.lists.getByTitle("invoiceList").items
        .select("ItemName", "itemNumber", "Modified")
        .top(5)
        .orderBy("Modified", true)
        .get<{ ItemName: string, itemNumber: number, Modified: string }[]>();

      // Convert the 'Modified' string to a Date object
      const itemsWithDate = items.map(item => ({
        ...item,
        Modified: new Date(item.Modified)
      }));

      this.setState({ items: itemsWithDate });
    } catch (error) {
      console.error("Error fetching lists", error);
    }
  }

  public render(): React.ReactElement<IProjCostTableProps> {
    return (
      <div className={styles.projCostTable}>
        <h2 className={styles.title}>Lists in web</h2>
        <ul>
          {this.state.items.map((item, index) => (
            <li className={styles.row} key={index}>
              <strong>Item Name:</strong> {item.ItemName} <br />
              <strong>Item Number:</strong> {item.itemNumber} <br />
              <strong>Modified:</strong> {item.Modified.toLocaleDateString()}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
