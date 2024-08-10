import * as React from 'react';

interface IDaysProps {
  days?: number;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Days: React.StatelessComponent<IDaysProps> = ({ days = 1, handleChange }) => {
  return (
    <td>
      <input type="number" value={days} onChange={handleChange} />
    </td>
  );
};

export default Days;
