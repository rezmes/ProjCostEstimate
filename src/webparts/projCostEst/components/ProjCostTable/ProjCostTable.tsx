import * as React from 'react';
import styles from './ProjCostTable.module.scss';


import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

export interface IProjCostTableProps {}

export interface IProjCostTableState {
  lists: { Title: string }[];
}

export default class ProjCostTable extends React.Component<IProjCostTableProps, IProjCostTableState> {

  constructor(props: IProjCostTableProps) {
    super(props);
    this.state = {
      lists: []
    };
  }

  public async componentDidMount() {
    try {
      const lists = await sp.web.lists.select("Title").get<{ Title: string }[]>();
      this.setState({ lists });
    } catch (error) {
      console.error("Error fetching lists", error);
    }
  }
  public render(): React.ReactElement<IProjCostTableProps> {


    return (
      <div className={styles.projCostTable}>
        <h2 className={styles.title}>Lists in web</h2>
        <ul>
          {this.state.lists.map((list, index) => (
            <li className={styles.row} key={index}>{list.Title}</li>
          ))}
        </ul>
      </div>
    );
  }
}
