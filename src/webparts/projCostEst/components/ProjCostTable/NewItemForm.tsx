import * as React from 'react';
import styles from './NewItemForm.module.scss';

interface INewItemFormProps {
  newItem: { ItemName: string, PricePerUnit: number, itemNumber: number };
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
        <button aria-label="Add" onClick={addItem}>افزودن</button>
      </td>
    </tr>
  );
};

export default NewItemForm;
