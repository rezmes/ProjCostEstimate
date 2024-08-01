import * as React from 'react';
import styles from './NewItemForm.module.scss';

interface INewItemFormProps {
  newItem: { ItemName: string, PricePerUnit: number, itemNumber: number, ManpowerGrade: string, Days: number, Description: string };
  handleNewItemChange: (field: keyof INewItemFormProps['newItem'], value: string | number) => void;
  addItem: () => void;
}

const NewItemForm = (props: INewItemFormProps) => {
  const { newItem, handleNewItemChange, addItem } = props;

  return (
    <tr className={styles.newItemForm}>
      <td></td>
      <td>
        <input
          type="text"
          value={newItem.ItemName}
          placeholder="New Item Name"
          onChange={(e) => handleNewItemChange('ItemName', e.target.value)}
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

export default NewItemForm;
