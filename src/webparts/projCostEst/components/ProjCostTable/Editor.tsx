import * as React from 'react';

interface IEditorProps {
  Editor: string;
}

const Editor: React.StatelessComponent<IEditorProps> = ({ Editor }) => {
  return (
    <td>{Editor}</td>
  );
};

export default Editor;
