import * as React from 'react';

interface IDropBoxProps {
  options: { ItemName: string, PricePerUnit: number }[];
  value: string;
  onChange: (value: string) => void;
  onSelect: (item: { ItemName: string, PricePerUnit: number }) => void;
}

interface IDropBoxState {
  inputValue: string;
}

class DropBox extends React.Component<IDropBoxProps, IDropBoxState> {
  constructor(props: IDropBoxProps) {
    super(props);
    this.state = {
      inputValue: props.value
    };
  }

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    this.setState({ inputValue: value });
    this.props.onChange(value);
  };

  handleSelect = (item: { ItemName: string, PricePerUnit: number }) => {
    this.setState({ inputValue: item.ItemName });
    this.props.onChange(item.ItemName);
    this.props.onSelect(item);
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
          list="dropbox-options"
        />
        <datalist id="dropbox-options">
          {options.map((option, index) => (
            <option key={index} value={option.ItemName} />
          ))}
        </datalist>
      </div>
    );
  }
}

export default DropBox;
