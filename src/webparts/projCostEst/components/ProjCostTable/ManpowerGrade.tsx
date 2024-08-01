import * as React from 'react';

interface IManpowerGradeProps {
  manpowerGrade: string;
  handleChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const ManpowerGrade: React.StatelessComponent<IManpowerGradeProps> = ({ manpowerGrade, handleChange }) => {
  return (
    <td>
      <select value={manpowerGrade} onChange={handleChange}>
        <option value="Expert">Expert</option>
        <option value="Technician">Technician</option>
        <option value="Worker">Worker</option>
      </select>
    </td>
  );
};

export default ManpowerGrade;
