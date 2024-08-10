import * as React from 'react';
import styles from './ProjCostTable.module.scss';
import Footer from '../Footer/Footer';
import NewItemForm from './NewItemForm';
import ProjCostTableRow from './ProjCostTableRow';
import { IProforma } from '../../Modules/Module';
import { fetchItems, updateItem, addItem, deleteItems, getCurrentUser } from '../../Modules/services';
import { validateNewItem, handleError } from '../../Modules/utils';
import PdfGenerator from '../pdfGenerator';
import { sp } from "@pnp/sp/presets/all";

interface IProjCostTableProps {
  description: string;
  listName: string;
  selectedProforma: IProforma | null;
}

interface IProjCostTableState {
  items: { ID: number, ItemName: string, itemNumber: number, PricePerUnit: number, TotalPrice: number, Modified: Date, Editor: string, ItemType: string, Days: number, Description: string }[];
  selectedItems: number[];
  editingItem: number | null;
  editedValues: { ItemName: string, PricePerUnit: number, itemNumber: number, ItemType: string, Days: number, Description: string };
  newItem: { ItemName: string, PricePerUnit: number, itemNumber: number, ItemType: string, Days: number, Description: string };
  currentUser: string;
  projCostResources: { ItemName: string, PricePerUnit: number }[]; // Add this line
}



export default class ProjCostTable extends React.Component<IProjCostTableProps, IProjCostTableState> {
  constructor(props: IProjCostTableProps) {
    super(props);
    this.state = {
      items: [],
      selectedItems: [],
      editingItem: null,
      editedValues: { ItemName: '', PricePerUnit: 0, itemNumber: 0, ItemType: '', Days: 0, Description: '' },
      newItem: { ItemName: '', PricePerUnit: 0, itemNumber: 0, ItemType: '', Days: 0, Description: '' },
      currentUser: '',
      projCostResources: []
    };
  }

  public async componentDidMount() {
    this.fetchItems();
    this.fetchProjCostResources();
    const currentUser = await getCurrentUser();
    this.setState({ currentUser });
  }

  public async componentDidUpdate(prevProps: IProjCostTableProps) {
    if (JSON.stringify(prevProps.selectedProforma) !== JSON.stringify(this.props.selectedProforma)) {
      this.fetchItems();
    }
  }

  private async fetchItems() {
    if (!this.props.selectedProforma) return;

    try {
      const items = await fetchItems(this.props.listName, this.props.selectedProforma.ID);
      this.setState({ items, selectedItems: [], editingItem: null, editedValues: { ItemName: '', PricePerUnit: 0, itemNumber: 0, ItemType: '', Days: 0, Description: '' } });
    } catch (error) {
      handleError(error, "Error fetching lists");
    }
  }

  private async fetchProjCostResources() {
    try {
      const projCostResources = await sp.web.lists.getByTitle('ProjCostResources').items
        .select("ItemName", "PricePerUnit")
        .get();
      this.setState({ projCostResources });
    } catch (error) {
      handleError(error, "Error fetching ProjCostResources");
    }
  }




  private toggleSelectItem = (index: number) => {
    const { selectedItems } = this.state;
    const selectedIndex = selectedItems.indexOf(index);

    if (selectedIndex > -1) {
      selectedItems.splice(selectedIndex, 1);
    } else {
      selectedItems.push(index);
    }

    this.setState({ selectedItems: selectedItems.slice() });
  }

  private startEditing = () => {
    const { selectedItems, items } = this.state;
    if (selectedItems.length === 1) {
      const itemIndex = selectedItems[0];
      const item = items[itemIndex];
      this.setState({
        editingItem: itemIndex,
        editedValues: { ItemName: item.ItemName, PricePerUnit: item.PricePerUnit, itemNumber: item.itemNumber, ItemType: item.ItemType, Days: item.Days, Description: item.Description }
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
      await updateItem(this.props.listName, updatedItem.ID, {
        ItemName: updatedItem.ItemName,
        PricePerUnit: updatedItem.PricePerUnit,
        itemNumber: updatedItem.itemNumber,
        ItemType: updatedItem.ItemType,
        Days: updatedItem.Days,
        Description: updatedItem.Description
      });

      this.setState({ editingItem: null, editedValues: { ItemName: '', PricePerUnit: 0, itemNumber: 0, ItemType: '', Days: 0, Description: '' } });
      this.fetchItems(); // Refresh the items after saving
    } catch (error) {
      handleError(error, "Error updating item");
    }
  }

  private addItem = async () => {
    if (!validateNewItem(this.state.newItem)) return;

    const { newItem, currentUser } = this.state;
    const { selectedProforma, listName } = this.props;

    if (!selectedProforma) return;

    try {
      const addedItem = await addItem(listName, {
        ItemName: newItem.ItemName,
        PricePerUnit: newItem.PricePerUnit,
        itemNumber: newItem.itemNumber,
        ItemType: newItem.ItemType,
        Days: newItem.Days,
        Description: newItem.Description,
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
            TotalPrice: newItem.PricePerUnit * newItem.itemNumber * newItem.Days,
            Modified: new Date(),
            Editor: currentUser,
            ItemType: newItem.ItemType,
            Days: newItem.Days,
            Description: newItem.Description
          }
        ],
        newItem: { ItemName: '', PricePerUnit: 0, itemNumber: 0, ItemType: '', Days: 0, Description: '' }
      }));
    } catch (error) {
      handleError(error, "Error adding new item");
    }
  }

  private deleteSelectedItems = async () => {
    const { items, selectedItems } = this.state;

    try {
      await deleteItems(this.props.listName, selectedItems.map(index => items[index].ID));

      const remainingItems = items.filter((item, index) => selectedItems.indexOf(index) === -1);

      this.setState({ items: remainingItems, selectedItems: [] });
    } catch (error) {
      handleError(error, "Error deleting items");
    }
  }


// Uncompleted
public render(): React.ReactElement<IProjCostTableProps> {
  const { items, selectedItems, editingItem, editedValues, newItem, projCostResources } = this.state;
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
        {this.props.selectedProforma && (
          <PdfGenerator
            data={items}
            customerName={this.props.selectedProforma.CustomerName}
            createdDate={this.props.selectedProforma.Created}
            proformaNumber={this.props.selectedProforma.ProformaNumber}
          />
        )}
        <table>
          <thead>
            <tr>
              <th>انتخاب</th>
              <th>نام آیتم</th>
              <th>مبلغ واحد</th>
              <th>تعداد</th>
              <th>جمع</th>
              <th>تغییر توسط</th>
              <th>نوع آیتم</th>
              <th>روزها</th>
              <th>توضیحات</th>
            </tr>
          </thead>
          {/* <tbody>
            {items.map((item, index) => (
              <ProjCostTableRow
                key={index}
                index={index}
                item={item}
                isEditing={editingItem === index}
                editedValues={editedValues}
                isSelected={selectedItems.indexOf(index) > -1}
                toggleSelectItem={this.toggleSelectItem}
                handleChange={this.handleChange}
              />
            ))}
            <NewItemForm
              newItem={newItem}
              handleNewItemChange={this.handleNewItemChange}
              addItem={this.addItem}
              projCostResources={projCostResources}
            />
          </tbody> */}

<tbody>
  {items.map((item, index) => (
    <ProjCostTableRow
      key={index}
      index={index}
      item={item}
      isEditing={editingItem === index}
      editedValues={editedValues}
      isSelected={selectedItems.indexOf(index) > -1}
      toggleSelectItem={this.toggleSelectItem}
      handleChange={this.handleChange}
      projCostResources={projCostResources} // Pass projCostResources here
    />
  ))}
  <NewItemForm
    newItem={newItem}
    handleNewItemChange={this.handleNewItemChange}
    addItem={this.addItem}
    projCostResources={projCostResources}
  />
</tbody>

        </table>
        <Footer items={this.state.items} />
      </div>
    );
  }
}
