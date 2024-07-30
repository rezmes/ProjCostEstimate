import * as React from 'react';
import jsPDF from 'jspdf';
  // Ensure this import matches the module export

interface IPdfGeneratorProps {
  data: { ID: number, ItemName: string, itemNumber: number, PricePerUnit: number, TotalPrice: number, Modified: Date }[];
}

const PdfGenerator: React.StatelessComponent<IPdfGeneratorProps> = ({ data }) => {

  const generatePdf = () => {
    const doc = new jsPDF();  // Ensure jsPDF is a constructor here
    doc.setFontSize(12);
    doc.text("Proforma Items", 20, 20);

    let y = 30;
    data.forEach((item, index) => {
      doc.text(`Item ${index + 1}: ${item.ItemName}`, 20, y);
      doc.text(`Price Per Unit: ${item.PricePerUnit}`, 20, y + 10);
      doc.text(`Item Number: ${item.itemNumber}`, 20, y + 20);
      doc.text(`Total Price: ${item.TotalPrice}`, 20, y + 30);
      doc.text(`Modified: ${item.Modified.toDateString()}`, 20, y + 40);
      y += 50;
    });

    doc.save('ProformaItems.pdf');
  };

  return (
    <button onClick={generatePdf}>Generate PDF</button>
  );
};

export default PdfGenerator;
