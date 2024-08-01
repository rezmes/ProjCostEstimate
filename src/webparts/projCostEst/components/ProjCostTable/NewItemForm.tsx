import * as React from 'react';
import styles from './NewItemForm.module.scss';
import DropBox from './DropBox';

interface INewItemFormProps {
  newItem: { ItemName: string, PricePerUnit: number, itemNumber: number, ManpowerGrade: string, Days: number, Description: string };
  handleNewItemChange: (field: keyof INewItemFormProps['newItem'], value: string | number) => void;
  addItem: () => void;
  projCostResources: { ItemName: string, PricePerUnit: number }[]; // Add this line
}

class NewItemForm extends React.Component<INewItemFormProps> {
  handleSelect = (item: { ItemName: string, PricePerUnit: number }) => {
    this.props.handleNewItemChange('ItemName', item.ItemName);
    this.props.handleNewItemChange('PricePerUnit', item.PricePerUnit);
  };
  render() {
    const { newItem, handleNewItemChange, addItem, projCostResources } = this.props;
  return (
    <tr className={styles.newItemForm}>
      <td></td>
      <td>
      <DropBox
            options={projCostResources}
            value={newItem.ItemName}
            onChange={(value) => handleNewItemChange('ItemName', value)}
            onSelect={this.handleSelect}
          />
      </td>
      <td>
      <input
            type="number"
            value={newItem.PricePerUnit}
            placeholder="New Price Per Unit"
            onChange={(e) => handleNewItemChange('PricePerUnit', parseFloat(e.target.value))}
          />
      </td>
      <td>
        <input
          type="number"
          value={newItem.itemNumber}
          placeholder="New Item Number"
          onChange={(e) => handleNewItemChange('itemNumber', parseInt(e.target.value))}
        />
      </td>
      <td>
        <select value={newItem.ManpowerGrade} onChange={(e) => handleNewItemChange('ManpowerGrade', e.target.value)}>
          <option value="Expert">Expert</option>
          <option value="Technician">Technician</option>
          <option value="Worker">Worker</option>
        </select>
      </td>
      <td>
        <input
          type="number"
          value={newItem.Days}
          placeholder="Days"
          onChange={(e) => handleNewItemChange('Days', parseInt(e.target.value))}
        />
      </td>
      <td>
        <input
          type="text"
          value={newItem.Description}
          placeholder="Description"
          onChange={(e) => handleNewItemChange('Description', e.target.value)}
        />
      </td>
      <td>
        <button aria-label="Add" onClick={addItem}>Add</button>
      </td>
    </tr>
  );
};
}
export default NewItemForm;
