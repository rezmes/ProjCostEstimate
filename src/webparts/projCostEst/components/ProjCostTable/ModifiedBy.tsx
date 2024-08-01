import * as React from 'react';

interface IModifiedByProps {
  modifiedBy: string;
}

const ModifiedBy: React.StatelessComponent<IModifiedByProps> = ({ modifiedBy }) => {
  return (
    <td>{modifiedBy}</td>
  );
};

export default ModifiedBy;
