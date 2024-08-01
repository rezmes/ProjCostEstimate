import * as React from 'react';

interface IDescriptionProps {
  description: string;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Description: React.StatelessComponent<IDescriptionProps> = ({ description, handleChange }) => {
  return (
    <td>
      <input type="text" value={description} onChange={handleChange} />
    </td>
  );
};

export default Description;
