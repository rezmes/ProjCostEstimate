import * as React from 'react';
import styles from './Footer.module.scss';

interface IFooterProps {
  items: { TotalPrice: number }[];
}

class Footer extends React.Component<IFooterProps> {
  private calculateTotalSum(items: { TotalPrice: number }[]): number {
    return items.reduce((sum, item) => sum + item.TotalPrice, 0);
  }

  public render() {
    const totalSum = this.calculateTotalSum(this.props.items);

    return (
      <div className={styles.footer}>
        <h3>جمع کل: {totalSum.toLocaleString('fa-IR', { style: 'currency', currency: 'IRR', minimumFractionDigits: 0 })}</h3>
      </div>
    );
  }
}

export default Footer;
