import * as React from 'react';
import styles from './ProjCostTable.module.scss';
import { sp } from "@pnp/sp/presets/all";
import Footer from '../Footer/Footer';
import { IProforma } from '../../Modules/Module';

interface IProjCostTableProps {
  description: string;
  listName: string;
  selectedProforma: IProforma | null;
}

interface IProjCostTableState {
  items: { ID: number, ItemName: string, itemNumber: number, PricePerUnit: number, TotalPrice: number, Modified: Date }[];
  selectedItems: number[]; // To keep track of selected item indices
  editingItem: number | null; // To keep track of the item being edited
  editedValues: { ItemName: string, PricePerUnit: number, itemNumber: number }; // To store edited values
  newItem: { ItemName: string, PricePerUnit: number, itemNumber: number }; // To store new item values
}

export default class ProjCostTable extends React.Component<IProjCostTableProps, IProjCostTableState> {
  constructor(props: IProjCostTableProps) {
    super(props);
    this.state = {
      items: [],
      selectedItems: [], // Initialize with an empty array
      editingItem: null, // No item is being edited initially
      editedValues: { ItemName: '', PricePerUnit: 0, itemNumber: 0 }, // Initialize edited values
      newItem: { ItemName: '', PricePerUnit: 0, itemNumber: 0 } // Initialize new item values
    };
  }

  public async componentDidMount() {
    this.fetchItems();
  }

  public async componentDidUpdate(prevProps: IProjCostTableProps) {
    if (JSON.stringify(prevProps.selectedProforma) !== JSON.stringify(this.props.selectedProforma)) {
      this.fetchItems();
    }
  }


  private async fetchItems() {
    if (!this.props.selectedProforma) {
      return;
    }

    try {
      const items = await sp.web.lists.getByTitle(this.props.listName).items
        .select("ID", "ItemName", "itemNumber", "TotalPrice", "PricePerUnit", "Modified", "ProformaID/ID", "ProformaID/ProformaNumber")
        .expand("ProformaID")
        .filter(`ProformaID/ID eq ${this.props.selectedProforma.ID}`)
        .top(5)
        .orderBy("Modified", true)
        .get<{ ID: number, ItemName: string, itemNumber: number, PricePerUnit: number, TotalPrice: number, Modified: string }[]>();

      const itemsWithDate = items.map(item => ({
        ...item,
        TotalPrice: parseFloat(item.TotalPrice.toString()), // Ensure TotalPrice is a number
        Modified: new Date(item.Modified)
      }));

      this.setState({ items: itemsWithDate, selectedItems: [], editingItem: null, editedValues: { ItemName: '', PricePerUnit: 0, itemNumber: 0 } }); // Reset selected items and editing state
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

  private startEditing = () => {
    const { selectedItems, items } = this.state;
    if (selectedItems.length === 1) {
      const itemIndex = selectedItems[0];
      const item = items[itemIndex];
      this.setState({
        editingItem: itemIndex,
        editedValues: { ItemName: item.ItemName, PricePerUnit: item.PricePerUnit, itemNumber: item.itemNumber }
      });
    }
  }

  private handleChange = (field: keyof IProjCostTableState['editedValues'], value: string | number) => {
    this.setState((prevState) => ({
      editedValues: {
        ...prevState.editedValues,
        [field]: value
      }
    }));
  }

  private handleNewItemChange = (field: keyof IProjCostTableState['newItem'], value: string | number) => {
    this.setState((prevState) => ({
      newItem: {
        ...prevState.newItem,
        [field]: value
      }
    }));
  }

  private saveEdit = async () => {
    const { editingItem, editedValues, items } = this.state;
    if (editingItem === null) return;

    const updatedItem = {
      ...items[editingItem],
      ...editedValues
    };

    try {
      await sp.web.lists.getByTitle(this.props.listName).items.getById(updatedItem.ID).update({
        ItemName: updatedItem.ItemName,
        PricePerUnit: updatedItem.PricePerUnit,
        itemNumber: updatedItem.itemNumber
      });

      this.setState({ editingItem: null, editedValues: { ItemName: '', PricePerUnit: 0, itemNumber: 0 } });
      this.fetchItems(); // Refresh items after saving
    } catch (error) {
      console.error("Error updating item", error);
    }
  }


  // Validate new item
  private validateNewItem = (): boolean => {
    const { newItem } = this.state;
    if (!newItem.ItemName.trim()) {
      console.error("Item Name is required");
      return false;
    }
    if (newItem.PricePerUnit <= 0) {
      console.error("Price Per Unit must be greater than 0");
      return false;
    }
    if (newItem.itemNumber <= 0) {
      console.error("Item Number must be greater than 0");
      return false;
    }
    return true;
  }


  // Add new item
  private addItem = async () => {
    if (!this.validateNewItem()) {
      // Optionally, update the UI to show an error message
      return;
    }

    // Proceed with adding the item if validation passes
    const { newItem } = this.state;
    const { selectedProforma, listName } = this.props;

    if (!selectedProforma) return;

    try {
      const addedItem = await sp.web.lists.getByTitle(listName).items.add({
        ItemName: newItem.ItemName,
        PricePerUnit: newItem.PricePerUnit,
        itemNumber: newItem.itemNumber,
        ProformaIDId: selectedProforma.ID
      });

      this.setState((prevState) => ({
        items: [
          ...prevState.items,
          {
             ID: addedItem.data.ID,
            ItemName: newItem.ItemName,
            itemNumber: newItem.itemNumber,
            PricePerUnit: newItem.PricePerUnit,
            TotalPrice: newItem.PricePerUnit * newItem.itemNumber,
            // Modified: new Date()
          }
        ],
        newItem: { ItemName: '', PricePerUnit: 0, itemNumber: 0 }
      }));
    } catch (error) {
      console.error("Error adding new item", error);
      // Handle UI feedback for error here
    }
  };



// OLD AddItem Method
  // private addItem = async () => {
  //   const { newItem } = this.state;
  //   const { selectedProforma } = this.props;

  //   if (!selectedProforma) return;

  //   try {
  //     await sp.web.lists.getByTitle(this.props.listName).items.add({
  //       ItemName: newItem.ItemName,
  //       PricePerUnit: newItem.PricePerUnit,
  //       itemNumber: newItem.itemNumber,
  //       ProformaIDId: selectedProforma.ID // Assuming ProformaID is the lookup field connecting items to a specific proforma
  //     });
  //         // Update local state to include the new item
  //     // this.setState({ newItem: { ItemName: '', PricePerUnit: 0, itemNumber: 0 } });
  //     // this.fetchItems(); // Refresh items after adding new one
  //     this.setState((prevState) => ({
  //       items: [
  //         ...prevState.items,
  //         {
  //           // ID: addedItem.data.ID,  MEEEEEEEEEEEEEEEEEEEEEEEEEEEE
  //           ItemName: newItem.ItemName,
  //           itemNumber: newItem.itemNumber,
  //           PricePerUnit: newItem.PricePerUnit,
  //           TotalPrice: newItem.PricePerUnit * newItem.itemNumber,
  //           // Modified: new Date() // Assuming the current date as the modified date   MEEEEEEEEEEEEEEEEEEEEEEEEEEEE
  //         }
  //       ],
  //       newItem: { ItemName: '', PricePerUnit: 0, itemNumber: 0 } // Reset new item values
  //     }));

  //     // Optionally, clear the selection or take other actions as needed


  //   } catch (error) {
  //     console.error("Error adding item", error);
  //   }
  // }

  private deleteSelectedItems = async () => {
    const { items, selectedItems } = this.state;

    try {
      await Promise.all(
        selectedItems.map(index => sp.web.lists.getByTitle(this.props.listName).items.getById(items[index].ID).delete())
      );

      // Filter out deleted items from the state
      const remainingItems = items.filter((item, index) => selectedItems.indexOf(index) === -1);

      this.setState({ items: remainingItems, selectedItems: [] });
    } catch (error) {
      console.error("Error deleting items", error);
    }
  }

  public render(): React.ReactElement<IProjCostTableProps> {
    const { items, selectedItems, editingItem, editedValues, newItem } = this.state;
    const isEditing = editingItem !== null;

    return (
      <div className={styles.projCostTable}>
        <h2 className={styles.title}>{this.props.description}</h2>
        {selectedItems.length > 0 && (
          <button aria-label="Delete Selected Items" onClick={this.deleteSelectedItems}>Delete Selected Items</button>
        )}
        {selectedItems.length === 1 && !isEditing && (
          <button aria-label="Edit Selected Item" onClick={this.startEditing}>Edit Selected Item</button>
        )}
        {isEditing && (
          <button aria-label="Save" onClick={this.saveEdit}>Save</button>
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
                <td>
                  {isEditing && editingItem === index ? (
                    <input
                      type="text"
                      value={editedValues.ItemName}
                      onChange={(e) => this.handleChange('ItemName', e.target.value)}
                    />
                  ) : (
                    item.ItemName
                  )}
                </td>
                <td>
                  {isEditing && editingItem === index ? (
                    <input
                      type="number"
                      value={editedValues.PricePerUnit}
                      onChange={(e) => this.handleChange('PricePerUnit', parseFloat(e.target.value))}
                    />
                  ) : (
                    item.PricePerUnit
                  )}
                </td>
                <td>
                  {isEditing && editingItem === index ? (
                    <input
                      type="number"
                      value={editedValues.itemNumber}
                      onChange={(e) => this.handleChange('itemNumber', parseInt(e.target.value))}
                    />
                  ) : (
                    item.itemNumber
                  )}
                </td>
                <td>{item.TotalPrice.toFixed(0)}</td>
                {/* <td>{item.Modified.toLocaleDateString('fa-IR')}</td> */}
              </tr>
            ))}
            <tr>
              <td></td>
              <td>
                <input
                  type="text"
                  value={newItem.ItemName}
                  placeholder="New Item Name"
                  onChange={(e) => this.handleNewItemChange('ItemName', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={newItem.PricePerUnit}
                  placeholder="New Price Per Unit"
                  onChange={(e) => this.handleNewItemChange('PricePerUnit', parseFloat(e.target.value))}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={newItem.itemNumber}
                  placeholder="New Item Number"
                  onChange={(e) => this.handleNewItemChange('itemNumber', parseInt(e.target.value))}
                />
              </td>
              <td>
                <button aria-label="Add" onClick={this.addItem}>Add</button>
              </td>
            </tr>
          </tbody>
        </table>
        <Footer items={this.state.items} />
      </div>
    );
  }
}
