import * as React from 'react';
import styles from './ProjCostTableRow.module.scss';

interface IProjCostTableRowProps {
  index: number;
  item: {
    ID: number;
    ItemName: string;
    itemNumber: number;
    PricePerUnit: number;
    TotalPrice: number;
    Modified: Date;
  };
  isEditing: boolean;
  editedValues: {
    ItemName: string;
    PricePerUnit: number;
    itemNumber: number;
  };
  isSelected: boolean;
  toggleSelectItem: (index: number) => void;
  handleChange: (field: keyof IProjCostTableRowProps['editedValues'], value: string | number) => void;
}

const ProjCostTableRow: React.StatelessComponent<IProjCostTableRowProps> = ({
  index,
  item,
  isEditing,
  editedValues,
  isSelected,
  toggleSelectItem,
  handleChange
}) => {
  return (
    <tr className={styles.projCostTableRow}>
      <td>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => toggleSelectItem(index)}
        />
      </td>
      <td>
        {isEditing ? (
          <input
            type="text"
            value={editedValues.ItemName}
            onChange={(e) => handleChange('ItemName', e.target.value)}
          />
        ) : (
          item.ItemName
        )}
      </td>
      <td>
        {isEditing ? (
          <input
            type="number"
            value={editedValues.PricePerUnit}
            onChange={(e) => handleChange('PricePerUnit', Number(e.target.value))}
          />
        ) : (
          item.PricePerUnit
        )}
      </td>
      <td>
        {isEditing ? (
          <input
            type="number"
            value={editedValues.itemNumber}
            onChange={(e) => handleChange('itemNumber', Number(e.target.value))}
          />
        ) : (
          item.itemNumber
        )}
      </td>
      <td>
        {item.TotalPrice}
      </td>
    </tr>
  );
};

export default ProjCostTableRow;
