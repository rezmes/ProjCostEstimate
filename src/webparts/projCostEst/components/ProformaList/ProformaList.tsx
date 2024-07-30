// import * as React from "react";
// import styles from "./ProformaList.module.scss";
// import { sp } from "@pnp/sp/presets/all";
// import { IProforma } from "../../Modules/Module";

// export interface IProformaListProps {
//   onProformaSelect: (selectedProforma: IProforma) => void;
// }

// export interface IProformaListState {
//   items: IProforma[];
//   selectedItem: IProforma | null;
//   newProforma: { CustomerName: string; ProformaNumber: number };
//   isCreating: boolean;
// }

// export default class ProformaList extends React.Component<IProformaListProps, IProformaListState> {
//   constructor(props: IProformaListProps) {
//     super(props);
//     this.state = {
//       items: [],
//       selectedItem: null,
//       newProforma: { CustomerName: '', ProformaNumber: 0 },
//       isCreating: false,
//     };
//   }

//   public async componentDidMount() {
//     this.fetchProformas();
//   }

//   private async fetchProformas() {
//     try {
//       const items: any[] = await sp.web.lists
//         .getByTitle("ProformaList")
//         .items.select("ID", "CustomerName", "ProformaNumber", "Created")
//         .orderBy("Created", true)
//         .get<IProforma[]>();

//       const itemsWithDate = items.map((item) => ({
//         ...item,
//         Created: new Date(item.Created),
//       }));

//       console.log("Fetched Proformas: ", itemsWithDate); // Log to verify

//       this.setState({ items: itemsWithDate });
//     } catch (error) {
//       console.error("Error fetching lists", error);
//     }
//   }

//   private handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//     const selectedIndex = parseInt(event.target.value, 10);

//     // Check if selectedIndex is a valid number and within the range of items array
//     if (!isNaN(selectedIndex) && selectedIndex >= 0 && selectedIndex < this.state.items.length) {
//       const selectedItem = this.state.items[selectedIndex];
//       this.setState({ selectedItem });
//       this.props.onProformaSelect(selectedItem);
//     } else {
//       console.error("Invalid selection index:", selectedIndex);
//     }
//   };

//   private startCreatingProforma = async () => {
//     try {
//       const lastProforma = await sp.web.lists
//         .getByTitle("ProformaList")
//         .items.select("ProformaNumber")
//         .orderBy("ProformaNumber", false)
//         .top(1)
//         .get<{ ProformaNumber: number }[]>();

//       const nextProformaNumber = lastProforma.length > 0 ? lastProforma[0].ProformaNumber + 1 : 1;

//       this.setState({
//         newProforma: { CustomerName: '', ProformaNumber: nextProformaNumber },
//         isCreating: true,
//       });
//     } catch (error) {
//       console.error("Error fetching last Proforma number", error);
//     }
//   };

//   private handleNewProformaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = event.target;
//     this.setState((prevState) => ({
//       newProforma: {
//         ...prevState.newProforma,
//         [name]: value,
//       },
//     }));
//   };

//   private saveNewProforma = async () => {
//     const { newProforma } = this.state;
//     try {
//       const newItem = await sp.web.lists.getByTitle("ProformaList").items.add({
//         CustomerName: newProforma.CustomerName,
//         ProformaNumber: newProforma.ProformaNumber,
//       });

//       const newProformaWithDate = {
//         ID: newItem.data.ID,
//         CustomerName: newProforma.CustomerName,
//         ProformaNumber: newProforma.ProformaNumber,
//         Created: new Date(),
//       };

//       this.setState((prevState) => ({
//         items: [...prevState.items, newProformaWithDate],
//         selectedItem: newProformaWithDate,
//         isCreating: false,
//       }));

//       this.props.onProformaSelect(newProformaWithDate);
//     } catch (error) {
//       console.error("Error saving new Proforma", error);
//     }
//   };

//   public render(): React.ReactElement<IProformaListProps> {
//     const { items, isCreating, newProforma } = this.state;
//     return (
//       <div className={styles.projCostTable}>
//         <h2 className={styles.title}>فرم های برآورد هزینه</h2>
//         <button aria-label="Create New Proforma" onClick={this.startCreatingProforma} disabled={this.state.isCreating}>Create New Proforma</button>
//         {isCreating && (
//           <div className={styles.newProformaForm}>
//             <h3>New Proforma</h3>
//             <label>
//               Customer Name:
//               <input
//                 type="text"
//                 name="CustomerName"
//                 value={newProforma.CustomerName}
//                 onChange={this.handleNewProformaChange}
//               />
//             </label>
//             <label>
//               Proforma Number:
//               <input type="text" value={newProforma.ProformaNumber} disabled />
//             </label>
//             <button aria-label="Save" onClick={this.saveNewProforma}>Save</button>
//           </div>
//         )}
//         <label htmlFor="proforma-select" className={styles.label}>انتخاب فرم برآورد هزینه:</label>
//         <select id="proforma-select" onChange={this.handleSelectChange} defaultValue="">
//           <option value="" disabled>انتخاب مشتری</option>
//           {items.map((item, index) => (
//             <option key={index} value={index}>
//               {item.CustomerName} - {item.ProformaNumber}
//             </option>
//           ))}
//         </select>
//       </div>
//     );
//   }
// }
import * as React from "react";
import styles from "./ProformaList.module.scss";
import { sp } from "@pnp/sp/presets/all";
import { IProforma } from "../../Modules/Module";

export interface IProformaListProps {
  onProformaSelect: (selectedProforma: IProforma) => void;
}

export interface IProformaListState {
  items: IProforma[];
  selectedItem: IProforma | null;
  newProforma: { CustomerName: string; ProformaNumber: number };
  isCreating: boolean;
}

export default class ProformaList extends React.Component<IProformaListProps, IProformaListState> {
  constructor(props: IProformaListProps) {
    super(props);
    this.state = {
      items: [],
      selectedItem: null,
      newProforma: { CustomerName: '', ProformaNumber: 0 },
      isCreating: false
    };
  }

  public async componentDidMount() {
    this.fetchProformas();
  }

  private async fetchProformas() {
    try {
      const items: any[] = await sp.web.lists
        .getByTitle("ProformaList")
        .items.select("ID", "CustomerName", "ProformaNumber", "Created")
        .orderBy("Created", true)
        .get<IProforma[]>();

      const itemsWithDate = items.map((item) => ({
        ...item,
        Created: new Date(item.Created)
      }));

      console.log("Fetched Proformas: ", itemsWithDate);

      this.setState({ items: itemsWithDate });
    } catch (error) {
      console.error("Error fetching lists", error);
    }
  }

  private handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedIndex = parseInt(event.target.value, 10);

    if (!isNaN(selectedIndex) && selectedIndex >= 0 && selectedIndex < this.state.items.length) {
      const selectedItem = this.state.items[selectedIndex];
      this.setState({ selectedItem });
      this.props.onProformaSelect(selectedItem);
    } else {
      console.error("Invalid selection index:", selectedIndex);
    }
  };

  private startCreatingProforma = async () => {
    try {
      const lastProforma = await sp.web.lists
        .getByTitle("ProformaList")
        .items.select("ProformaNumber")
        .orderBy("ProformaNumber", false)
        .top(1)
        .get<{ ProformaNumber: number }[]>();

      const nextProformaNumber = lastProforma.length > 0 ? lastProforma[0].ProformaNumber + 1 : 1;

      this.setState({
        newProforma: { CustomerName: '', ProformaNumber: nextProformaNumber },
        isCreating: true
      });
    } catch (error) {
      console.error("Error fetching the last Proforma number", error);
    }
  };

private handleNewProformaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    this.setState((prevState) => ({
      newProforma: {
        ...prevState.newProforma,
        [name]: value
      }
    }));
  };

  private saveNewProforma = async () => {
    const { newProforma } = this.state;

    if (!newProforma.CustomerName.trim() || newProforma.ProformaNumber <= 0) {
      console.error("Invalid Proforma data");
      return;
    }

    try {
      const newItem = await sp.web.lists.getByTitle("ProformaList").items.add({
        CustomerName: newProforma.CustomerName,
        ProformaNumber: newProforma.ProformaNumber
      });

      const newProformaWithDate = {
        ID: newItem.data.ID,
        CustomerName: newProforma.CustomerName,
        ProformaNumber: newProforma.ProformaNumber,
        Created: new Date()
      };

      this.setState((prevState) => ({
        items: [...prevState.items, newProformaWithDate],
        selectedItem: newProformaWithDate,
        isCreating: false
      }));

      this.props.onProformaSelect(newProformaWithDate);
    } catch (error) {
      console.error("Error saving new Proforma", error);
    }
  };

  private cancelCreatingProforma = () => {
    this.setState({
      isCreating: false,
      newProforma: { CustomerName: '', ProformaNumber: 0 }
    });
  };

  public render(): React.ReactElement<IProformaListProps> {
    const { items, isCreating, newProforma } = this.state;
    return (
      <div className={styles.proformaList}>
        <h2 className={styles.title}>فرم‌های برآورد هزینه</h2>
        <button aria-label="Create New Proforma" onClick={this.startCreatingProforma} disabled={isCreating}>Create New Proforma</button>
        {isCreating && (
          <div className={styles.newProformaForm}>
            <h3>New Proforma</h3>
            <label>
              Customer Name:
              <input
                type="text"
                name="CustomerName"
                value={newProforma.CustomerName}
                onChange={this.handleNewProformaChange}
              />
            </label>
            <label>
              Proforma Number:
              <input type="text" value={newProforma.ProformaNumber} disabled />
            </label>
            <button aria-label="Save" onClick={this.saveNewProforma}>Save</button>
            <button aria-label="Cancel" onClick={this.cancelCreatingProforma}>Cancel</button>
          </div>
        )}
        <label htmlFor="proforma-select" className={styles.label}>انتخاب فرم برآورد هزینه:</label>
        <select
          id="proforma-select"
          onChange={this.handleSelectChange}
          defaultValue=""
        >
          <option value="" disabled>انتخاب مشتری</option>
          {items.map((item, index) => (
            <option key={item.ID} value={index}>
              {item.CustomerName} - {item.ProformaNumber}
            </option>
          ))}
        </select>
      </div>
    );
  }
}
