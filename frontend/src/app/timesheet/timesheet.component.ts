import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { provideNativeDateAdapter } from '@angular/material/core';
import { jsPDF } from 'jspdf';


interface previousRequest {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-timesheet',
  providers: [provideNativeDateAdapter()],
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.css'],
})
export class TimeComponent {
  selectedProject: string = '';
  selectedMonth: string = '';
  selectedYear: number = new Date().getFullYear();
  isEditing: boolean = false; // boolean for table editing
  projects: previousRequest[] = [
    { value: 'BAER', viewValue: 'BAER' },
    { value: 'XYZ Corp', viewValue: 'XYZ Corp' },
    { value: 'Alpha Co', viewValue: 'Alpha Co' },
  ];
  months: previousRequest[] = [
    { value: 'January ', viewValue: 'January ' },
    { value: 'February ', viewValue: 'February ' },
    { value: 'March ', viewValue: 'March ' },
    { value: 'April ', viewValue: 'April ' },
    { value: 'May ', viewValue: 'May ' },
    { value: 'June ', viewValue: 'June ' },
    { value: 'July ', viewValue: 'July ' },
    { value: 'August ', viewValue: 'August ' },
    { value: 'September ', viewValue: 'September ' },
    { value: 'October ', viewValue: 'October ' },
    { value: 'November ', viewValue: 'November ' },
    { value: 'December ', viewValue: 'December ' },
  ];
  days: number[] = Array.from({ length: 31 }, (_, i) => i + 1);
  employees: { name: string; hours: { [key: string]: number } }[] = [
    { name: 'Jane Doe', hours: this.initializeHours() },
    { name: 'John Doe', hours: this.initializeHours() },
    { name: 'Michael Smith', hours: this.initializeHours() },
  ];

  constructor(private router: Router) {}

  ngOnInit() {}

  signIn() {
    this.router.navigate(['/home']);
  }

  initializeHours(): { [key: string]: number } {
    const hours: { [key: string]: number } = {};
    this.days.forEach((day) => {
      hours[day] = 0;
    });
    return hours;
  }

  calculateTotalHours(hours: { [key: string]: number }): number {
    return Object.values(hours).reduce((total, current) => total + current, 0);
  }

  exportToPDF(): void {
    const doc = new jsPDF();
  
    // Get the box-2 content
    const element = document.querySelector('.container') as HTMLElement;
  
    if (element) {
      // Add the content to the PDF
      doc.html(element, {
        callback: (doc) => {
          // Save the PDF
          doc.save('timesheet.pdf');
        },
        x: .05, // Horizontal position
        y: 20, // Vertical position
        width: 125, // Width of content in PDF (adjust as necessary)
        html2canvas: {
          scale: 0.18 // This scales down the content (1 is default, <1 zooms out)
        }
      });
    } else {
      console.error('Element with class not found.');
    }
  }
  

  editTimesheet() {
    console.log('Editing timesheet...');
  }

  saveTimesheet() {
    console.log('Saving timesheet...');
  }

}