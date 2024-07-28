import * as React from 'react';
import styles from './ProjCostTable.module.scss';
import { sp } from "@pnp/sp/presets/all";
import { IProjCostTableProps } from './IProjCostTableProps';
import { IProjCostTableState } from './IProjCostTableState';

export default class ProjCostTable extends React.Component<IProjCostTableProps, IProjCostTableState> {
  constructor(props: IProjCostTableProps) {
    super(props);
    this.state = {
      items: []
    };
  }

  public async componentDidMount() {
    try {
      const items = await sp.web.lists.getByTitle(this.props.listName).items
        .select("ItemName", "itemNumber", "Modified")
        .top(5)
        .orderBy("Modified", true)
        .get<{ ItemName: string, itemNumber: number, Modified: string }[]>();

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
        <h2 className={styles.title}>{this.props.description}</h2>
        <table>
          <thead>
            <tr>
              <th>نام آیتم</th>
              <th>شماره آیتم</th>
              <th>تاریخ اصلاح</th>
            </tr>
          </thead>
          <tbody>
            {this.state.items.map((item, index) => (
              <tr key={index}>
                <td>{item.ItemName}</td>
                <td>{item.itemNumber}</td>
                <td>{item.Modified.toLocaleDateString('fa-IR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}