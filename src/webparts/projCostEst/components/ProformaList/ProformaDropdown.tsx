import * as React from "react";
import DropBox from "../ProjCostTable/DropBox"; // Import the DropBox component

export interface IProformaDropdownProps {
  items: { label: string; value: any }[];
  selectedItem: string;
  onChange: (value: string) => void;
  onSelect: (item: { label: string; value: any }) => void;
}

export class ProformaDropdown extends React.Component<IProformaDropdownProps> {
  render() {
    const { items, selectedItem, onChange, onSelect } = this.props;
    return (
      <div>
        <label htmlFor="proforma-select">انتخاب فرم برآورد هزینه:</label>
        <DropBox
          key={new Date().getTime()} // Force re-render by changing the key
          options={items}
          value={selectedItem}
          onChange={onChange}
          onSelect={onSelect}
        />
      </div>
    );
  }
}
