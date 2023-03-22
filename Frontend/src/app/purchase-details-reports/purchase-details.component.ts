import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ReportService } from '../services/reports.service';
import * as XLSX from 'xlsx';
// import * as nodemailer from 'nodemailer';
// const fs = require('fs');
// const { Readable } = require('stream');

@Component({
  selector: 'app-purchase-details',
  template: `
    <div>
      <!-- <input type="file" (change)="readExcelFile($event)" />-->
      <button (click)="exportExcel()">click</button>
      <table #myTable>
        <thead>
          <tr>
            <th>חודש</th>
            <th>שם מלא</th>
            <th>מס עובד</th>
            <th>סה''כ</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let purchase of purchases">
            <td>{{ purchase.month }}</td>
            <td>{{ purchase.fullName }}</td>
            <td>{{ purchase.userId }}</td>
            <td>{{ purchase.totalAmount }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styleUrls: ['./purchase-details.component.scss'],
})
export class PurchaseDetailsComponent implements OnInit {
  purchases: any[];

  constructor(private reportService: ReportService) {}

  @ViewChild('myTable', { static: false }) table: ElementRef;

  async ngOnInit(): Promise<void> {
    try {
      this.purchases = await this.reportService.getAllRepMin2();

      console.log('this.purchases: ', this.purchases);
    } catch (error) {}
  }

  exportExcel(): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(
      this.table.nativeElement
    );
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, 'table.xlsx');
  }

  //   sendEmailWithExcelAttachment(excelData: any) {
  //     // Create a transporter object using Gmail SMTP server
  //     const transporter = nodemailer.createTransport({
  //       service: 'gmail',
  //       auth: {
  //         user: 'your-gmail-address@gmail.com',
  //         pass: 'your-gmail-password',
  //       },
  //     });

  //     // Define the email message
  //     const message = {
  //       from: 'your-gmail-address@gmail.com',
  //       to: 'your-gmail-address@gmail.com',
  //       subject: 'Excel attachment',
  //       attachments: [
  //         {
  //           filename: 'data.xlsx',
  //           content: excelData,
  //         },
  //       ],
  //     };

  //     // Send the email
  //     transporter.sendMail(message, (error: any, info: any) => {
  //       if (error) {
  //         console.error(error);
  //       } else {
  //         console.log(`Email sent: ${info.response}`);
  //       }
  //     });
  //   }

  //   readExcelFile(event: any) {
  //     const file = event.target.files[0];

  //     const reader = new FileReader();
  //     reader.onload = (e: any) => {
  //       const bufferArray = e.target.result;
  //       const wb = XLSX.read(bufferArray, { type: 'buffer' });

  //       // Get the first worksheet
  //       const wsname = wb.SheetNames[0];
  //       const ws = wb.Sheets[wsname];

  //       // Convert the worksheet to a JSON object
  //       const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

  //       // Do something with the data (e.g. send it to server)
  //       console.log(data);
  //     };
  //     reader.readAsArrayBuffer(file);
  //   }
}
