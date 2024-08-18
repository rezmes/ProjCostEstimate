import * as React from "react";
import styles from "./NewItemForm.module.scss";
import ProjCostDropBox from "./ProjCostDropBox";
import { sp } from "@pnp/sp/presets/all"; // Import PnP JS

interface INewItemFormProps {
  newItem: {
    ItemName: string;
    PricePerUnit: number;
    itemNumber: number;
    ItemType: string;
    Days: number;
    Description: string;
  };
  handleNewItemChange: (
    field: keyof INewItemFormProps["newItem"],
    value: string | number
  ) => void;
  addItem: () => void;
  projCostResources: { ItemName: string; PricePerUnit: number }[];
}

interface INewItemFormState {
  projCostResources: { ItemName: string; PricePerUnit: number }[];
}

class NewItemForm extends React.Component<
  INewItemFormProps,
  INewItemFormState
> {
  constructor(props: INewItemFormProps) {
    super(props);
    this.state = {
      projCostResources: [],
    };
  }

  public async componentDidMount() {
    this.fetchProjCostResources();
  }

  private async fetchProjCostResources() {
    try {
      const items: any[] = await sp.web.lists
        .getByTitle("ProjCostResources")
        .items.select("ItemName", "PricePerUnit")
        .get();

      this.setState({ projCostResources: items });
    } catch (error) {
      console.error("Error fetching ProjCostResources", error);
    }
  }

  handleSelect = (item: {
    label: string;
    value: { ItemName: string; PricePerUnit: number };
  }) => {
    this.props.handleNewItemChange("ItemName", item.value.ItemName);
    this.props.handleNewItemChange("PricePerUnit", item.value.PricePerUnit);
  };

  render() {
    const { newItem, handleNewItemChange, addItem } = this.props;
    const { projCostResources } = this.state;
    const dropBoxOptions = projCostResources.map((resource) => ({
      label: resource.ItemName,
      value: resource,
    }));

    return (
      <tr className={styles.newItemForm}>
        <td className={styles.actionsColumn}></td>{" "}
        {/* Empty cell for the checkbox column */}
        <td className={styles.itemNameColumn}>
          <ProjCostDropBox
            options={dropBoxOptions}
            value={newItem.ItemName}
            onChange={(value) => handleNewItemChange("ItemName", value)}
            onSelect={this.handleSelect}
          />
        </td>
        <td className={styles.pricePerUnitColumn}>
          <input
            type="number"
            value={newItem.PricePerUnit}
            placeholder="New Price Per Unit"
            onChange={(e) =>
              handleNewItemChange("PricePerUnit", parseFloat(e.target.value))
            }
          />
        </td>
        <td className={styles.itemNumberColumn}>
          <input
            type="number"
            value={newItem.itemNumber}
            placeholder="New Item Number"
            onChange={(e) =>
              handleNewItemChange("itemNumber", parseInt(e.target.value))
            }
          />
        </td>
        <td className={styles.totalPriceColumn}>
          <input
            type="number"
            value={newItem.itemNumber * newItem.PricePerUnit}
            placeholder="Total Price"
            readOnly
          />
        </td>
        <td className={styles.itemTypeColumn}>
          <select
            aria-label="Type of options"
            value={newItem.ItemType}
            onChange={(e) => handleNewItemChange("ItemType", e.target.value)}
          >
            <option value="کالای مصرفی">کالای مصرفی</option>
            <option value="دستگاه">دستگاه</option>
          </select>
        </td>
        <td className={styles.daysColumn}>
          <input
            type="number"
            value={newItem.Days}
            placeholder="Days"
            onChange={(e) =>
              handleNewItemChange("Days", parseInt(e.target.value))
            }
          />
        </td>
        <td className={styles.descriptionColumn}>
          <input
            type="text"
            value={newItem.Description}
            placeholder="شرح فعالیت مرتبط"
            onChange={(e) => handleNewItemChange("Description", e.target.value)}
          />
        </td>
        <td className={styles.actionsColumn}>
          <button aria-label="Add" onClick={addItem}>
            افزودن
          </button>
        </td>
      </tr>
    );
  }
}

export default NewItemForm;
