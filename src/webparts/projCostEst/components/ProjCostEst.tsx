import * as React from 'react';
import styles from './ProjCostEst.module.scss';
import { IProjCostEstProps } from './IProjCostEstProps';
import { escape } from '@microsoft/sp-lodash-subset';

import  ProjCostTable  from './ProjCostTable/ProjCostTable';

export default class ProjCostEst extends React.Component < IProjCostEstProps, {} > {
  public render(): React.ReactElement<IProjCostEstProps> {
    return(
      <div className = { styles.projCostEst } >
  <div className={styles.container}>
    <div className={styles.row}>
      <div className={styles.column}>
        <span className={styles.title}>Welcome to SharePoint!</span>
        <p className={styles.subTitle}>Customize SharePoint experiences using Web Parts.</p>
        <p className={styles.description}>{escape(this.props.description)}</p>
        <a href='https://aka.ms/spfx' className={styles.button}>
          <span className={styles.label}>Learn more</span>
        </a>
      </div>
    </div>
  </div>
  <ProjCostTable />
      </div >
    );
  }
}
