// import * as React from "react";
// import styles from "./ProjCostEst.module.scss";
// import { IProjCostEstProps } from "./IProjCostEstProps";
// import { IProjCostEstState } from "./IProjCostEstState";
// import { escape } from "@microsoft/sp-lodash-subset";

// import ProjCostTable from "./ProjCostTable/ProjCostTable";
// import ProformaList from "./ProformaList/ProformaList";

// export default class ProjCostEst extends React.Component<
//   IProjCostEstProps,
//   IProjCostEstState
// > {
//   constructor(props: IProjCostEstProps) {
//     super();
//     this.state = {
//       selectedProforma: null,
//     };
//   }
//   private handleProformaSelect = (selectedProforma: {
//     CustomerName: string;
//     ProformaNumber: number;
//     Created: Date;
//   }) => {
//     this.setState({ selectedProforma });
//   };

//   public render(): React.ReactElement<IProjCostEstProps> {
//     return (
//       <div className={styles.projCostEst}>
//         {/* <div className={styles.container}>
//     <div className={styles.row}>
//       <div className={styles.column}>
//         <span className={styles.title}>Welcome to SharePoint!</span>
//         <p className={styles.subTitle}>Customize SharePoint experiences using Web Parts.</p>
//         <p className={styles.description}>{escape(this.props.description)}</p>
//         <a href='https://aka.ms/spfx' className={styles.button}>
//           <span className={styles.label}>Learn more</span>
//         </a>
//       </div>
//     </div>
//   </div> */}
//         <ProformaList onProformaSelect={this.handleProformaSelect} />
//         <ProjCostTable
//           description={this.props.description}
//           listName={this.props.listName}
//           selectedProforma={this.state.selectedProforma}
//         />
//       </div>
//     );
//   }
// }
import * as React from "react";
import styles from "./ProjCostEst.module.scss";
import { IProjCostEstProps } from "./IProjCostEstProps";
import { IProjCostEstState } from "./IProjCostEstState";
import { escape } from "@microsoft/sp-lodash-subset";
import ProjCostTable from "./ProjCostTable/ProjCostTable";
import ProformaList from "./ProformaList/ProformaList";

export default class ProjCostEst extends React.Component<
  IProjCostEstProps,
  IProjCostEstState
> {
  constructor(props: IProjCostEstProps) {
    super(props);
    this.state = {
      selectedProforma: null,
    };
  }

  private handleProformaSelect = (selectedProforma: {
    CustomerName: string;
    ProformaNumber: number;
    Created: Date;
  }) => {
    this.setState({ selectedProforma });
  };

  public render(): React.ReactElement<IProjCostEstProps> {
    return (
      <div className={styles.projCostEst}>
        <ProformaList onProformaSelect={this.handleProformaSelect} />
        {this.state.selectedProforma && (
          <ProjCostTable
            description={this.props.description}
            listName={this.props.listName}
            selectedProforma={this.state.selectedProforma}
          />
        )}
      </div>
    );
  }
}
