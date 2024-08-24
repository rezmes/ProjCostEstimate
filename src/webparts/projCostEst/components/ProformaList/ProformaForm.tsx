import * as React from "react";

export interface IProformaFormProps {
  newProforma: {
    ReqTitle: string;
    ProformaNumber: number;
    CustomerNameId: any;
  };
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  onCancel: () => void;
}

export class ProformaForm extends React.Component<IProformaFormProps> {
  render() {
    const { newProforma, onChange, onSave, onCancel } = this.props;
    return (
      <div>
        <h3>فرم برآورد هزینه</h3>
        <label>
          نام مشتری:
          <input
            type="text"
            name="ReqTitle"
            value={newProforma.ReqTitle}
            onChange={onChange}
          />
        </label>
        <label>
          شماره فرم
          <input type="text" value={newProforma.ProformaNumber} disabled />
        </label>
        <button aria-label="Save" onClick={onSave}>
          ذخیره
        </button>
        <button aria-label="Cancel" onClick={onCancel}>
          لغو
        </button>
      </div>
    );
  }
}
