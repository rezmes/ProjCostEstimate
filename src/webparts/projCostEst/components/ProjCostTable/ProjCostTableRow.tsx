import * as React from 'react';

interface IProjCostTableRowProps {
  index: number;
  item: { ID: number, ItemName: string, itemNumber: number, PricePerUnit: number, TotalPrice: number };
  isEditing: boolean;
  isSelected: boolean;
  editedValues: { ItemName: string, PricePerUnit: number, itemNumber: number };
  toggleSelectItem: (index: number) => void;
  handleChange: (field: keyof { ItemName: string, PricePerUnit: number, itemNumber: number }, value: string | number) => void;
}

class ProjCostTableRow extends React.Component<IProjCostTableRowProps> {
  constructor(props: IProjCostTableRowProps) {
    super(props);
  }

  render() {
    const {
      index,
      item,
      isEditing,
      isSelected,
      editedValues,
      toggleSelectItem,
      handleChange
    } = this.props;

    return (
      <tr>
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
              onChange={(e) => handleChange('PricePerUnit', parseFloat(e.target.value))}
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
              onChange={(e) => handleChange('itemNumber', parseInt(e.target.value))}
            />
          ) : (
            item.itemNumber
          )}
        </td>
        <td>{item.TotalPrice.toFixed(0)}</td>
      </tr>
    );
  }
}

export default ProjCostTableRow;
