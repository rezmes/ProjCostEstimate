import * as React from 'react';
import styles from './ProjCostTableRow.module.scss';
import ModifiedBy from './ModifiedBy';
import ItemType from './ItemType';
import Days from './Days';
import Description from './Description';

interface IProjCostTableRowProps {
  index: number;
  item: {
    ID: number;
    ItemName: string;
    itemNumber: number;
    PricePerUnit: number;
    TotalPrice: number;
    Modified: Date;
    Editor: string;
    ItemType: string;
    Days: number;
    Description: string;
  };
  isEditing: boolean;
  editedValues: {
    ItemName: string;
    PricePerUnit: number;
    itemNumber: number;
    ItemType: string;
    Days: number;
    Description: string;
  };
  isSelected: boolean;
  toggleSelectItem: (index: number) => void;
  handleChange: (field: keyof IProjCostTableRowProps['editedValues'], value: string | number) => void;
  projCostResources: { ItemName: string; PricePerUnit: number }[]; // Add this
}

const ProjCostTableRow: React.StatelessComponent<IProjCostTableRowProps> = ({
  index,
  item,
  isEditing,
  editedValues,
  isSelected,
  toggleSelectItem,
  handleChange,
  projCostResources // Add this line
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
          item.PricePerUnit.toLocaleString('fa-IR', { style: 'currency', currency: 'IRR', minimumFractionDigits: 0 })
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
        {item.TotalPrice.toLocaleString('fa-IR', { style: 'currency', currency: 'IRR', minimumFractionDigits: 0 })}
      </td>
      <ModifiedBy modifiedBy={item.Editor} />
      <ItemType ItemType={item.ItemType} handleChange={(e) => handleChange('ItemType', e.target.value)} />
      <Days days={item.Days} handleChange={(e) => handleChange('Days', Number(e.target.value))} />
      <Description description={item.Description} handleChange={(e) => handleChange('Description', e.target.value)} />
    </tr>
  );
};

export default ProjCostTableRow;
