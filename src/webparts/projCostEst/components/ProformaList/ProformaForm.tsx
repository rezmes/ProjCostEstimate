import * as React from "react";

export interface IProformaFormProps {
  newProforma: { CustomerName: string; ProformaNumber: number };
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  onCancel: () => void;
}

export class ProformaForm extends React.Component<IProformaFormProps> {
  render() {
    const { newProforma, onChange, onSave, onCancel } = this.props;
    return (
      <div>
        <h3>New Proforma</h3>
        <label>
          Customer Name:
          <input
            type="text"
            name="CustomerName"
            value={newProforma.CustomerName}
            onChange={onChange}
          />
        </label>
        <label>
          شماره فرم
          <input type="text" value={newProforma.ProformaNumber} disabled />
        </label>
        <button aria-label="Save" onClick={onSave}>Save</button>
        <button aria-label="Cancel" onClick={onCancel}>Cancel</button>
      </div>
    );
  }
}
