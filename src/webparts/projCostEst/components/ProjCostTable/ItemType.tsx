import * as React from 'react';

interface IItemTypeProps {
  ItemType: string;
  handleChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const ItemType: React.StatelessComponent<IItemTypeProps> = ({ ItemType, handleChange }) => {
  return (
    <td>
      <select value={ItemType} onChange={handleChange}>
        <option value="کالای مصرفی">کالای مصرفی</option>
        <option value="نیروی انسانی">نیروی انسانی</option>
        <option value="دستگاه">دستگاه</option>
      </select>
    </td>
  );
};

export default ItemType;
