import * as React from "react";
import styles from "./ProjCostEst.module.scss";
import { IProjCostEstProps } from "./IProjCostEstProps";
import { IProjCostEstState } from "./IProjCostEstState";
import ProjCostTable from "./ProjCostTable/ProjCostTable";
import ProformaList from "./ProformaList/ProformaList";
import { IProforma } from "../Modules/Module";
import 'core-js/es6/array';


const logoUrl = 'https://sharepointapp.ipr-co.com/sites/mech/SiteAssets/mechaniclogo.png'; // Use the URL of the uploaded image


export default class ProjCostEst extends React.Component<IProjCostEstProps, IProjCostEstState> {
  constructor(props: IProjCostEstProps) {
    super(props);
    this.state = {
      selectedProforma: null
    };
  }

  private handleProformaSelect = (selectedProforma: IProforma) => {
    // console.log("Selected Proforma: ", selectedProforma);
    this.setState({ selectedProforma });
  };

  public render(): React.ReactElement<IProjCostEstProps> {
    return (
      <div className={styles.projCostEst}>
        <img src={logoUrl} alt="Logo" className={styles.logo} />
        <ProformaList onProformaSelect={this.handleProformaSelect}
        parentFormListName={this.props.parentFormListName}
         />
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
