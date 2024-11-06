
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { provideNativeDateAdapter } from '@angular/material/core';
import { jsPDF } from 'jspdf'; // import jsPDF to be able to export the page to pdf

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
  //selectedMonth: string = '';
  //selectedYear: number = new Date().getFullYear();
  isEditing: boolean = false; // boolean for table editing
  num_days: number = 28; // number to defirmine the width of the table

  // Array to store the projects in the dropdown
  projects: previousRequest[] = [
    { value: 'BAER', viewValue: 'BAER' },
    { value: 'XYZ Corp', viewValue: 'XYZ Corp' },
    { value: 'Alpha Co', viewValue: 'Alpha Co' },
  ];
  // Array to store the months displayed in the dropdown
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
  // Determins the number of days in the table
  days: number[] = Array.from({ length: this.num_days }, (_, i) => i + 1);
  // Array to store the employees
  employees: { name: string; hours: { [key: string]: number } }[] = [
    { name: 'Jane Doe', hours: this.initializeHours() },
    { name: 'John Doe', hours: this.initializeHours() },
    { name: 'Michael Smith', hours: this.initializeHours() },
    { name: 'Jon Doe', hours: this.initializeHours() },
    { name: 'Steve Smith', hours: this.initializeHours() },
  ];

  constructor(private router: Router) {}

  ngOnInit() {}

  signIn() {
    //
    // Currently just allows access to the page with no sign in required
    // Could be a stretch goal
    //
    this.router.navigate(['/home']);
  }

  // Initializes all the hours in the table
  initializeHours(): { [key: string]: number } {
    const hours: { [key: string]: number } = {};
    this.days.forEach((day) => {
      hours[day] = 0;
    });
    return hours;
  }

  // Calculates all the total hours displayed in the total column
  calculateTotalHours(hours: { [key: string]: number }): number {
    return Object.values(hours).reduce((total, current) => total + current, 0);
  }

  // Exports box-2 to pdf using jsPDF
  exportToPDF(): void {
    const doc = new jsPDF();

    // Get the box-2 content
    const element = document.querySelector('.container') as HTMLElement;

    if (element) {
      doc.html(element, {
        callback: (doc) => {
          // Save the PDF to specified address
          doc.save('timesheet.pdf');
        },
        x: 0.05, // Horizontal position
        y: 20, // Vertical position
        width: 150, // Width of content in PDF (adjust as necessary)
        html2canvas: {
          scale: 0.18, // This scales down the content (1 is default, <1 zooms out)
        },
      });
    } else {
      console.error('Element with class not found.');
    }
  }

  // When the edit button is pressed editing will be allowed
  editTimesheet() {
    this.isEditing = !this.isEditing;
    console.log(
      this.isEditing ? 'Editing timesheet...' : 'Viewing timesheet...'
    );
  }

  // Save button that will save the table information to a database
  saveTimesheet() {
    console.log('Saving timesheet...');
  }
  // Gets the days in the month
  getDaysInMonth(month: string, year: number): number {
    const monthIndex = this.months.findIndex(
      (m) => m.value.trim() === month.trim()
    );
    return new Date(year, monthIndex + 1, 0).getDate();
  }
  // Gets the selected month
  private _selectedMonth: string = '';
  get selectedMonth(): string {
    return this._selectedMonth;
  }
  // Updates the days based off the month
  set selectedMonth(value: string) {
    this._selectedMonth = value;
    this.updateDays();
  }
  // Function to update the days
  updateDays() {
    if (this.selectedMonth && this.selectedYear) {
      const daysInMonth = this.getDaysInMonth(
        this.selectedMonth,
        this.selectedYear
      );
      this.days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
      this.num_days = daysInMonth;
      this.resetEmployeeHours();
    }
  }

  // Resets the employees hours when a new month is selected
  resetEmployeeHours() {
    this.employees.forEach((employee) => {
      employee.hours = this.initializeHours();
    });
  }
  // Gets the selected year
  private _selectedYear: number = new Date().getFullYear();
  get selectedYear(): number {
    return this._selectedYear;
  }
  // Sets the selected year
  set selectedYear(value: number) {
    this._selectedYear = value;
    this.updateDays();
  }
}
