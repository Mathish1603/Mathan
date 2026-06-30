import { Component, HostListener, OnInit } from '@angular/core';
import { Entry } from 'src/app/shared/models/billing';
import { ReportService } from 'src/app/core/services/report/report.service';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import { Document, Packer, Table, TableCell, TableRow, TextRun, Paragraph, AlignmentType, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  constructor(private reportService: ReportService) { }

  searchSupplier: string = '';
  showSupplierDropdown = false;

  suppliers: string[] = [];
  filteredSuppliers: string[] = [];

  isNotFound: boolean = false;

  ngOnInit(): void {
    this.getSuppliers();
  }

  formData: any = {
    supplier: '',
    personName: '',
    bank: '',
    gst: '',
    accountNo: '',
    pCity: '',
    gCity: '',
    address: '',
    ifsc: '',
    state: '',
    bankcity: '',
    phone: '',
    referenceNo: '',
    cashierNo: ''
  };

  rows: Entry[] = [this.createRow()];

  createRow(): Entry {
    return {
      sno: 1,
      date: '',
      product: '',
      referenceNo: '',
      cashierNo: '',
      quantity: 0,
      price: 0,
      amount: 0,
      debit: 0,
      balance: 0
    };
  }

  calculateLedger() {

    let runningBalance = this.rows.length > 0
      ? Number(this.rows[0].amount) || 0
      : 0;

    let runningDebit = 0;  

    this.rows = this.rows.map((row, index) => {

      const quantity = Number(row.quantity) || 0;

      const singlePrice = Number(row.price) || 0;

      const totalProductPrice = quantity * singlePrice;

      let debit = 0;
      let balance = 0;

      if (runningBalance >= totalProductPrice) {

        runningBalance -= totalProductPrice;

        balance = runningBalance;

        debit = runningDebit;

      } else {

        const currentDebit = totalProductPrice - runningBalance;

        runningDebit += currentDebit;

        debit = runningDebit;

        runningBalance = 0;

        balance = 0;

      }

      return {

        ...row,

        sno: index + 1,

        price: singlePrice,

        amount: Number(row.amount) || 0,

        debit,
        balance

      };

    });

  }

  onSearchSupplier() {

    if (!this.searchSupplier.trim()) {
      alert("Enter Supplier");
      return;
    }

    this.saveSupplierToLocal(this.searchSupplier);

    this.reportService.getReportBySupplier(this.searchSupplier)
      .subscribe({
        next: (res: any) => {

          const leadger = res.leadger;
          const purchases = res.purchase || [];
          const expenses = res.expense || [];

          if (!leadger) {
            this.isNotFound = true;
            this.resetForm();
            return;
          }

          const expenseData = expenses.length > 0
            ? expenses[expenses.length - 1]
            : null;

          this.formData = {
            number: leadger.addaiNo || '',
            personName: leadger.personName || '',
            bank: leadger.bank || '',
            gst: leadger.gst || '',
            supplier: leadger.supplier || '',
            accountNo: leadger.accountNo || '',
            gCity: leadger.gCity || '',
            pCity: leadger.pCity || '',
            address: leadger.address || '',
            ifsc: leadger.ifsc || '',
            state: leadger.state || '',
            bankcity: leadger.bankcity || '',
            phone: leadger.phone || '',
            referenceNo: expenseData?.referenceNo || '',
            cashierNo: expenseData?.cashierNo || ''
          };

          if (purchases.length > 0) {

            this.rows = purchases.map((p: any, index: number) => {

              return {

                sno: index + 1,

                date: expenseData?.date
                  ? new Date(expenseData.date).toISOString().split('T')[0]
                  : '',

                product: p.product || p.itemName || '',

                referenceNo: expenseData?.referenceNo || '',
                cashierNo: expenseData?.cashierNo || '',

                quantity: p.quantity || 0,

                price: p.price || p.rate || 0,

                amount: expenseData?.amount || 0,

                debit: 0,
                balance: 0

              };

            });

          } else {

            this.rows = [{
              sno: 1,
              date: expenseData?.date
                ? new Date(expenseData.date).toISOString().split('T')[0]
                : '',
              product: '',
              referenceNo: expenseData?.referenceNo || '',
              cashierNo: expenseData?.cashierNo || '',
              quantity: 0,
              price: 0,
              amount: 0,
              debit: 0,
              balance: 0
            }];

          }

          this.calculateLedger();

          this.isNotFound = false;

        },

        error: () => {

          this.isNotFound = true;
          this.resetForm();

          alert("Data not found");

        }
      });
  }

  getSuppliers() {

    this.suppliers = JSON.parse(localStorage.getItem('suppliers') || '[]');

    this.filteredSuppliers = [...this.suppliers];

  }

  filterSuppliers() {

    const v = (this.searchSupplier || '').toLowerCase();

    this.filteredSuppliers = this.suppliers.filter(x =>
      x.toLowerCase().includes(v)
    );

    if (this.searchSupplier && !this.suppliers.includes(this.searchSupplier)) {

      this.filteredSuppliers.unshift(this.searchSupplier);

    }
  }

  selectSearchSupplier(value: string) {

    this.searchSupplier = value;

    this.showSupplierDropdown = false;

    this.saveSupplierToLocal(value);

  }

  saveSupplierToLocal(value: string) {

    let list = JSON.parse(localStorage.getItem('suppliers') || '[]');

    if (value && !list.includes(value)) {

      list.push(value);

      localStorage.setItem('suppliers', JSON.stringify(list));

    }

    this.getSuppliers();

  }

  resetForm() {

    this.formData = {
      supplier: '',
      personName: '',
      bank: '',
      gst: '',
      accountNo: '',
      gCity: '',
      pCity: '',
      address: '',
      ifsc: '',
      state: '',
      bankcity: '',
      phone: '',
      referenceNo: '',
      cashierNo: ''
    };

    this.rows = [this.createRow()];

    this.isNotFound = false;

  }

  // PDF DOWNLOAD
downloadPDF() {

  const originalData = document.getElementById('print-section');

  if (!originalData) {
    alert('Print section not found');
    return;
  }

  const clonedData = originalData.cloneNode(true) as HTMLElement;

  clonedData.style.position = 'absolute';
  clonedData.style.left = '-9999px';
  clonedData.style.top = '0';
  clonedData.style.width = originalData.offsetWidth + 'px';
  clonedData.style.background = '#fff';

  clonedData.classList.add('pdf-mode');

  document.body.appendChild(clonedData);

  html2canvas(clonedData, {
    scale: Math.max(window.devicePixelRatio, 2),
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    logging: false,
    imageTimeout: 0
  })
    .then((canvas) => {

      if (clonedData.parentNode) {
        document.body.removeChild(clonedData);
      }

      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      const pageWidth = 210;
      const pageHeight = 297;

      const margin = 5;

      const usableWidth = pageWidth - (margin * 2);
      const usableHeight = pageHeight - (margin * 2);

      const imgWidth = usableWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const imgData = canvas.toDataURL(
        'image/jpeg',
        0.9
      );

      let heightLeft = imgHeight;

      // First page
      pdf.addImage(
        imgData,
        'JPEG',
        margin,
        margin,
        imgWidth,
        Math.min(imgHeight, usableHeight),
        undefined,
        'SLOW'
      );

      heightLeft -= usableHeight;

      // Additional pages — shift image upward to show the next portion
      let position = 0;
      while (heightLeft > 0) {

        position -= usableHeight;

        pdf.addPage();

        pdf.addImage(
          imgData,
          'JPEG',
          margin,
          position + margin,
          imgWidth,
          imgHeight,
          undefined,
          'SLOW'
        );

        heightLeft -= usableHeight;
      }

      pdf.save('Ledger-Report.pdf');

    })
    .catch((err) => {

      console.error('PDF Generation Error:', err);

      if (clonedData.parentNode) {
        document.body.removeChild(clonedData);
      }

      alert('PDF generation failed');

    });
}

  // WORD DOWNLOAD
downloadWord() {

  try {

    const tableBorders = {
      top: {
        style: BorderStyle.SINGLE,
        size: 1,
        color: 'D9D9D9'
      },
      bottom: {
        style: BorderStyle.SINGLE,
        size: 1,
        color: 'D9D9D9'
      },
      left: {
        style: BorderStyle.SINGLE,
        size: 1,
        color: 'D9D9D9'
      },
      right: {
        style: BorderStyle.SINGLE,
        size: 1,
        color: 'D9D9D9'
      },
      insideHorizontal: {
        style: BorderStyle.SINGLE,
        size: 1,
        color: 'D9D9D9'
      },
      insideVertical: {
        style: BorderStyle.SINGLE,
        size: 1,
        color: 'D9D9D9'
      }
    };

    const createCell = (
      text: string,
      isBold: boolean = false,
      width: number = 16
    ): TableCell => {

      return new TableCell({

        width: {
          size: width,
          type: 'pct'
        },

        margins: {
          top: 60,
          bottom: 60,
          left: 50,
          right: 50
        },

        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: text || '',
                bold: isBold,
                size: isBold ? 20 : 18
              })
            ]
          })
        ]
      });
    };

    const createHeaderCell = (
      text: string,
      width: number
    ): TableCell => {

      return new TableCell({

        width: {
          size: width,
          type: 'pct'
        },

        shading: {
          fill: '1677F0'
        },

        margins: {
          top: 60,
          bottom: 60,
          left: 40,
          right: 40
        },

        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text,
                bold: true,
                color: 'FFFFFF',
                size: 18
              })
            ]
          })
        ]
      });
    };

    // BLUE TITLE ROW

    const titleRow = new TableRow({
      children: [

        new TableCell({
          columnSpan: 3,
          shading: {
            fill: '1677F0'
          },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: 'லெட்ஜர்',
                  bold: true,
                  color: 'FFFFFF',
                  size: 24
                })
              ]
            })
          ]
        }),

        new TableCell({
          columnSpan: 3,
          shading: {
            fill: '1677F0'
          },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: '1. பர்ச்சஸிங் விபரம்',
                  bold: true,
                  color: 'FFFFFF',
                  size: 24
                })
              ]
            })
          ]
        })

      ]
    });

    // FIRST TABLE

    const headerRows = [

      titleRow,

      new TableRow({
        children: [
          createCell('பெயர்:', true),
          createCell(this.formData.personName || ''),
          createCell('பேங்க்:', true),
          createCell(this.formData.bank || ''),
          createCell('ஜிஎஸ்டி:', true),
          createCell(this.formData.gst || '')
        ]
      }),

      new TableRow({
        children: [
          createCell('கம்பெனி:', true),
          createCell(this.formData.supplier || ''),
          createCell('அக்கவுண்ட் நம்பர்:', true),
          createCell(this.formData.accountNo || ''),
          createCell('குடோன் ஊர்:', true),
          createCell(this.formData.gCity || '')
        ]
      }),

      new TableRow({
        children: [
          createCell('தெரு:', true),
          createCell(this.formData.address || ''),
          createCell('ஐஎப்எஸ்சி:', true),
          createCell(this.formData.ifsc || ''),
          createCell('மாநிலம்:', true),
          createCell(this.formData.state || '')
        ]
      }),

      new TableRow({
        children: [
          createCell('ஊர்:', true),
          createCell(this.formData.pCity || ''),
          createCell('பேங்க்.ஊர்:', true),
          createCell(this.formData.bankcity || ''),
          createCell('போன் நம்பர்:', true),
          createCell(this.formData.phone || '')
        ]
      })
    ];

    // SECOND TABLE DATA

    const dataRows = this.rows.map((row, index) => {

      return new TableRow({
        children: [

          createCell((index + 1).toString(), false, 6),

          createCell(
            row.date
              ? new Date(row.date).toLocaleDateString('en-GB')
              : '',
            false,
            10
          ),

          createCell(row.product || '', false, 14),

          createCell(row.referenceNo || '', false, 10),

          createCell(row.cashierNo || '', false, 10),

          createCell(row.quantity?.toString() || '0', false, 8),

          createCell(this.formatCurrency(row.price), false, 11),

          createCell(this.formatCurrency(row.amount), false, 11),

          createCell(
            row.debit === 0
              ? '-'
              : this.formatCurrency(row.debit),
            false,
            10
          ),

          createCell(
            row.balance === 0
              ? '-'
              : this.formatCurrency(row.balance),
            false,
            10
          )

        ]
      });

    });

    const headerDataRow = new TableRow({
      children: [

        createHeaderCell('வ.எண்', 6),
        createHeaderCell('தேதி', 10),
        createHeaderCell('பொருள்', 14),
        createHeaderCell('வா.வ.எண்', 10),
        createHeaderCell('கே.நம்பர்', 10),
        createHeaderCell('எண்ணம்', 8),
        createHeaderCell('பொ.ரூபாய்', 11),
        createHeaderCell('கொ.ரூபாய்', 11),
        createHeaderCell('பற்று', 10),
        createHeaderCell('இருப்பு', 10)

      ]
    });

    const allTableRows = [
      headerDataRow,
      ...dataRows
    ];

    const doc = new Document({

      sections: [
        {
          children: [

            new Table({
              width: {
                size: 100,
                type: 'pct'
              },
              rows: headerRows,
              borders: tableBorders
            }),

            new Paragraph({
              text: '',
              spacing: {
                after: 200
              }
            }),

            new Table({
              width: {
                size: 100,
                type: 'pct'
              },
              rows: allTableRows,
              borders: tableBorders
            })

          ]
        }
      ]
    });

    Packer.toBlob(doc)
      .then((blob) => {
        saveAs(blob, 'Ledger-Report.docx');
      })
      .catch((err) => {
        console.error(err);
        alert('Word document generation failed');
      });

  } catch (error) {

    console.error(error);
    alert('Failed to generate Word document');

  }
}

  private formatCurrency(value: any): string {
    const num = Number(value) || 0;
    return '₹' + num.toFixed(2);
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: MouseEvent) {
    const el = event.target as HTMLElement;
    if (!el.closest('.supplier-wrapper')) {
      this.showSupplierDropdown = false;
    }
  }
}