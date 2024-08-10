import * as React from 'react';

interface IProjCostDropBoxProps<T> {
  options: { label: string, value: T }[];
  value: string;
  onChange: (value: string) => void;
  onSelect: (item: { label: string, value: T }) => void;
}

interface IProjCostDropBoxState {
  inputValue: string;
}

class ProjCostDropBox<T> extends React.Component<IProjCostDropBoxProps<T>, IProjCostDropBoxState> {
  constructor(props: IProjCostDropBoxProps<T>) {
    super(props);
    this.state = {
      inputValue: props.value
    };
  }

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    this.setState({ inputValue: value });
    this.props.onChange(value);

    const selectedItem = this.props.options.find(option => option.label === value);
    if (selectedItem) {
      this.props.onSelect(selectedItem);
    }
  };

  render() {
    const { options } = this.props;
    const { inputValue } = this.state;

    return (
      <div>
        <input
          type="text"
          value={inputValue}
          onChange={this.handleChange}
          list="projcost-dropbox-options"
        />
        <datalist id="projcost-dropbox-options">
          {options.map((option, index) => (
            <option key={index} value={option.label} />
          ))}
        </datalist>
      </div>
    );
  }
}

export default ProjCostDropBox;
