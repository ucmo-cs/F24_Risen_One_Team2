import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { provideNativeDateAdapter } from '@angular/material/core';

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
  projects: previousRequest[] = [
    { value: 'BAER', viewValue: 'BAER' },
    { value: 'XYZ Corp', viewValue: 'XYZ Corp' },
    { value: 'Alpha Co', viewValue: 'Alpha Co' },
  ];
  months: previousRequest[] = [
    { value: 'January 2024', viewValue: 'January 2024' },
    { value: 'February 2024', viewValue: 'February 2024' },
    { value: 'March 2024', viewValue: 'March 2024' },
    { value: 'April 2024', viewValue: 'April 2024' },
    { value: 'May 2024', viewValue: 'May 2024' },
    { value: 'June 2024', viewValue: 'June 2024' },
    { value: 'July 2024', viewValue: 'July 2024' },
    { value: 'August 2024', viewValue: 'August 2024' },
    { value: 'September 2024', viewValue: 'September 2024' },
    { value: 'October 2024', viewValue: 'October 2024' },
    { value: 'November 2024', viewValue: 'November 2024' },
    { value: 'December 2024', viewValue: 'December 2024' },
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

  exportToPDF() {
    console.log('Exporting to PDF...');
  }

  editTimesheet() {
    console.log('Editing timesheet...');
  }

  saveTimesheet() {
    console.log('Saving timesheet...');
  }
}
