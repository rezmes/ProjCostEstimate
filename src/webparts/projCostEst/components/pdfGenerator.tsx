import * as React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import styles from './pdfGenerator.module.scss';

const logoUrl = 'http://portal/sites/mech/SiteAssets/mechaniclogo.png'; // Use the URL of the uploaded image

interface IPdfGeneratorProps {
  data: { ID: number, ItemName: string, itemNumber: number, PricePerUnit: number, TotalPrice: number, Modified: Date, Editor: string, ItemType: string, Days: number, Description: string }[];
  customerName: string;
  createdDate: Date;
  proformaNumber: number;
}

class PdfGenerator extends React.Component<IPdfGeneratorProps> {
  constructor(props: IPdfGeneratorProps) {
    super(props);
    this.generatePdf = this.generatePdf.bind(this);
  }

  private async loadFont() {
    const response = await fetch('http://portal/Style%20Library/IRFonts/IRANSansXFaNum-Regular.ttf');
    const fontData = await response.arrayBuffer();
    return btoa(String.fromCharCode(...new Uint8Array(fontData)));
  }

  private async generatePdf() {
    const { data, customerName, createdDate, proformaNumber } = this.props;
    const doc = new jsPDF();
    const base64EncodedFont = await this.loadFont();
    doc.addFileToVFS("IRANSansXFaNum-Regular.ttf", base64EncodedFont);
    doc.addFont("IRANSansXFaNum-Regular.ttf", "IRANSansXFaNum-Regular", "normal");
    doc.setFont("IRANSansXFaNum-Regular");
    doc.setFontSize(12);

    // Add logo
    const logoResponse = await fetch(logoUrl);
    const logoBlob = await logoResponse.blob();
    const logoBase64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(logoBlob);
    });
    doc.addImage(logoBase64, 'PNG', 150, 10, 40, 20); // Adjust the position and size as needed

    // Add Proforma Header
    doc.text(`نام مشتری: ${customerName}`, 190, 40, { align: 'right' });
    doc.text(`تاریخ ایجاد: ${createdDate.toLocaleDateString('fa-IR')}`, 190, 50, { align: 'right' });
    doc.text(`شماره پروفرما: ${proformaNumber}`, 190, 60, { align: 'right' });

    // Prepare table data
    const tableData = data.map((item, index) => [
      item.Modified.toLocaleDateString('fa-IR'),
      item.TotalPrice.toLocaleString('fa-IR', { style: 'currency', currency: 'IRR', minimumFractionDigits: 0 }),
      item.itemNumber,
      item.PricePerUnit.toLocaleString('fa-IR', { style: 'currency', currency: 'IRR', minimumFractionDigits: 0 }),
      item.ItemName,
      item.Editor,
      item.ItemType,
      item.Days,
      item.Description,
      index + 1
    ]);

    // Add table
    doc.autoTable({
      head: [['تاریخ تغییر', 'جمع', 'تعداد', 'مبلغ واحد', 'نام آیتم', 'تغییر توسط', 'نوع آیتم', 'روزها', 'توضیحات', '#']],
      body: tableData,
      startY: 70,
      styles: { font: "IRANSansXFaNum-Regular", halign: 'right' },
      margin: { left: 20, right: 20 },
      theme: 'grid',
      headStyles: { halign: 'right' },
      bodyStyles: { halign: 'right' }
    });

    // Calculate total sum
    const totalSum = data.reduce((sum, item) => sum + item.TotalPrice, 0);

    // Add total sum
    doc.text(`جمع کل: ${totalSum.toLocaleString('fa-IR', { style: 'currency', currency: 'IRR', minimumFractionDigits: 0 })}`, 190, doc.autoTable.previous.finalY + 10, { align: 'right' });

    doc.save('ProformaItems.pdf');
  }

  public render() {
    return (
      <button className={styles.pdfGenerator} onClick={this.generatePdf}>خروجی PDF</button>
    );
  }
}

export default PdfGenerator;
