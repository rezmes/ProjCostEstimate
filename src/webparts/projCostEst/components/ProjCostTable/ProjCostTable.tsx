import * as React from 'react';
import styles from './ProjCostTable.module.scss';
import { sp } from "@pnp/sp/presets/all";
import Footer from '../Footer/Footer';

interface IProjCostTableProps {
  description: string;
  listName: string;
  selectedProforma: {
    CustomerName: string;
    ProformaNumber: number;
    Created: Date;
  } | null;
}

interface IProjCostTableState {
  items: { Id: number, ItemName: string, itemNumber: number, PricePerUnit: number, TotalPrice: number, Modified: Date }[];
  selectedItems: number[]; // To keep track of selected item indices
}

export default class ProjCostTable extends React.Component<IProjCostTableProps, IProjCostTableState> {
  constructor(props: IProjCostTableProps) {
    super(props);
    this.state = {
      items: [],
      selectedItems: [] // Initialize with an empty array
    };
  }

  public async componentDidMount() {
    this.fetchItems();
  }

  public async componentDidUpdate(prevProps: IProjCostTableProps) {
    if (prevProps.selectedProforma !== this.props.selectedProforma) {
      this.fetchItems();
    }
  }

  private async fetchItems() {
    if (!this.props.selectedProforma) {
      return;
    }

    try {
      const items = await sp.web.lists.getByTitle(this.props.listName).items
        .select("Id", "ItemName", "itemNumber", "TotalPrice", "PricePerUnit", "Modified", "ProformaID/ID", "ProformaID/ProformaNumber")
        .expand("ProformaID")
        .filter(`ProformaID/ProformaNumber eq ${this.props.selectedProforma.ProformaNumber}`)
        .top(5)
        .orderBy("Modified", true)
        .get<{ Id: number, ItemName: string, itemNumber: number, PricePerUnit: number, TotalPrice: number, Modified: string }[]>();

      const itemsWithDate = items.map(item => ({
        ...item,
        TotalPrice: parseFloat(item.TotalPrice.toString()), // Ensure TotalPrice is a number
        Modified: new Date(item.Modified)
      }));

      this.setState({ items: itemsWithDate, selectedItems: [] }); // Reset selected items
    } catch (error) {
      console.error("Error fetching lists", error);
    }
  }

  private toggleSelectItem = (index: number) => {
    const { selectedItems } = this.state;
    const selectedIndex = selectedItems.indexOf(index);

    if (selectedIndex > -1) {
      selectedItems.splice(selectedIndex, 1); // Deselect item
    } else {
      selectedItems.push(index); // Select item
    }

    this.setState({ selectedItems: [...selectedItems] });
  }

  private deleteSelectedItems = async () => {
    const { items, selectedItems } = this.state;

    try {
      await Promise.all(
        selectedItems.map(index => sp.web.lists.getByTitle(this.props.listName).items.getById(items[index].Id).delete())
      );

      // Filter out deleted items from the state
      const remainingItems = items.filter((item, index) => selectedItems.indexOf(index) === -1);

      this.setState({ items: remainingItems, selectedItems: [] });
    } catch (error) {
      console.error("Error deleting items", error);
    }
  }

  public render(): React.ReactElement<IProjCostTableProps> {
    const { items, selectedItems } = this.state;

    return (
      <div className={styles.projCostTable}>
        <h2 className={styles.title}>{this.props.description}</h2>
        {selectedItems.length > 0 && (
          <button onClick={this.deleteSelectedItems}>Delete Selected Items</button>
        )}
        <table>
          <thead>
            <tr>
              <th>Select</th>
              <th>نام آیتم</th>
              <th>مبلغ واحد</th>
              <th>تعداد</th>
              <th>جمع</th>
              {/* <th>تاریخ اصلاح</th> */}
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedItems.indexOf(index) > -1}
                    onChange={() => this.toggleSelectItem(index)}
                  />
                </td>
                <td>{item.ItemName}</td>
                <td>{item.PricePerUnit}</td>
                <td>{item.itemNumber}</td>
                <td>{item.TotalPrice.toFixed(0)}</td>
                {/* <td>{item.Modified.toLocaleDateString('fa-IR')}</td> */}
              </tr>
            ))}
          </tbody>
        </table>
        <Footer items={this.state.items} />
      </div>
    );
  }
}
