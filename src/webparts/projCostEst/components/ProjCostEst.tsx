import * as React from "react";
import styles from "./ProjCostEst.module.scss";
import { IProjCostEstProps } from "./IProjCostEstProps";
import { IProjCostEstState } from "./IProjCostEstState";
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
    ID: number;
    CustomerName: string;
    ProformaNumber: number;
    Created: Date;
  }) => {
    console.log("Selected Proforma: ", selectedProforma); // Add logging to ensure this is as expected
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
          selectedProforma={this.state.selectedProforma as {
            ID: number;
            CustomerName: string;
            ProformaNumber: number;
            Created: Date;
          }}
            // description={this.props.description}
            // listName={this.props.listName}
            // selectedProforma={this.state.selectedProforma}
          />
        )}
      </div>
    );
  }
}
