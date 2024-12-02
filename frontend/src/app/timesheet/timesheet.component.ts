import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { provideNativeDateAdapter } from '@angular/material/core';
import { jsPDF } from 'jspdf'; // import jsPDF to be able to export the page to pdf
import { HttpClientModule } from '@angular/common/http';
import { TimesheetService } from './timesheet.component.service';

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
  managerSignature: string = ''; //stores signature
  managerDate: string = '';
  selectedProject: string = '';
  isEditing: boolean = false; // boolean for table editing
  num_days: number = 28; // determines the width of the table

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
  //array to store the selectable year
  years: number[] = Array.from(
    { length: 20 },
    (_, i) => new Date().getFullYear() - 10 + i
  );

  // Determines the number of days in the table
  days: number[] = Array.from({ length: this.num_days }, (_, i) => i + 1);

  // Array to store the employees
  employees: { name: string; hours: { [key: string]: number } }[] = [
    { name: 'Jane Doe', hours: this.initializeHours() },
    { name: 'John Doe', hours: this.initializeHours() },
    { name: 'Michael Smith', hours: this.initializeHours() },
    { name: 'Jon Doe', hours: this.initializeHours() },
    { name: 'Steve Smith', hours: this.initializeHours() },
  ];

  constructor(
    private router: Router,
    private timesheetService: TimesheetService
  ) {}

  ngOnInit() {}

  signIn() {
    // Placeholder for sign-in navigation
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

  // Calculates the total hours displayed in the total column
  calculateTotalHours(hours: { [key: string]: number }): number {
    return Object.values(hours).reduce((total, current) => total + current, 0);
  }

  // Calculates total hours per day across all employees
  calculateTotalHoursPerDay(day: number): number {
    return this.employees.reduce(
      (total, employee) => total + (employee.hours[day] || 0),
      0
    );
  }

  calculateGrandTotalHours(): number {
    return this.days.reduce(
      (total, day) => total + this.calculateTotalHoursPerDay(day),
      0
    );
  }

  // Exports box-2 to pdf using jsPDF
  exportToPDF(): void {
    const doc = new jsPDF();
    const element = document.querySelector('.container') as HTMLElement;

    if (element) {
      doc.html(element, {
        callback: (doc) => {
          doc.save('timesheet.pdf');
        },
        x: 0.05,
        y: 20,
        width: 150,
        html2canvas: {
          scale: 0.18,
        },
      });
    } else {
      console.error('Element with class not found.');
    }
  }

  // Toggles between editing and viewing modes
  editTimesheet() {
    this.isEditing = !this.isEditing;
    console.log(
      this.isEditing ? 'Editing timesheet...' : 'Viewing timesheet...'
    );
  }

  // Save function that logs saving action (placeholder for actual save logic)
  saveTimesheet(): void {
    if (!this.selectedProject || !this.selectedMonth || !this.selectedYear) {
      alert(
        'Please complete project, month, and year selection before saving.'
      );
      return;
    }
    //prepare timesheet data
    const timesheetData = {
      project: this.selectedProject,
      month: this.selectedMonth,
      year: this.selectedYear,
      employees: this.employees.map((employee) => ({
        name: employee.name,
        hours: { ...employee.hours },
        totalHours: this.calculateTotalHours(employee.hours),
      })),
      dailyTotals: this.days.map((day) => ({
        day,
        totalHours: this.calculateTotalHoursPerDay(day),
      })),
      grandTotal: this.calculateGrandTotalHours(),
      managerSignature: this.managerSignature,
      managerDate: this.managerDate,
    };
    // call service to save timesheet
    this.timesheetService.saveTimesheet(timesheetData).subscribe({
      next: () => alert('Timesheet saved successfully!'),
      error: () => alert('An error occurred while saving the timesheet.'),
    });
  }

  // Determines the number of days in a given month and year
  getDaysInMonth(month: string, year: number): number {
    const monthIndex = this.months.findIndex(
      (m) => m.value.trim() === month.trim()
    );
    return new Date(year, monthIndex + 1, 0).getDate();
  }

  // Private property and getter/setter for selectedMonth
  private _selectedMonth: string = '';
  get selectedMonth(): string {
    return this._selectedMonth;
  }
  set selectedMonth(value: string) {
    this._selectedMonth = value;
    this.updateDays();
  }

  // Private property and getter/setter for selectedYear
  private _selectedYear: number = new Date().getFullYear();
  get selectedYear(): number {
    return this._selectedYear;
  }
  set selectedYear(value: number) {
    this._selectedYear = value;
    this.updateDays();
  }

  // Updates days array and resets employee hours when month or year changes
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
  saveManagerDetails() {
    console.log('Manager Signature: ${this.managerSignature}');
    console.log('Manager Date: ${this.managerDate}');
  }

  // Resets the hours for each employee to ensure clean data for new month/year
  resetEmployeeHours() {
    this.employees.forEach((employee) => {
      employee.hours = this.initializeHours();
    });
  }
}
