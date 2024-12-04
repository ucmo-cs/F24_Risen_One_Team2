import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { provideNativeDateAdapter } from '@angular/material/core';
import { jsPDF } from 'jspdf'; // import jsPDF to be able to export the page to pdf
import { TimesheetService } from './timesheet.component.service'; // Import the service
import { MatSnackBar } from '@angular/material/snack-bar';

interface previousRequest {
  value: string;
  viewValue: string;
}

interface TimeCardData {
  employeeName: string;
  DailyHours: { [key: string]: number };
}

@Component({
  selector: 'app-timesheet',
  providers: [provideNativeDateAdapter()],
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.css'],
})
export class TimeComponent{
  managerSignature: string = '';
  managerDate: string = '';
  isEditing: boolean = false;
  num_days: number = 28;
  years: number[] = [];
  isLoading: boolean = false;

  // Array to store the projects in the dropdown
  projects: previousRequest[] = [
    { value: 'BAER', viewValue: 'BAER' },
    { value: 'XYZ Corp', viewValue: 'XYZ Corp' },
    { value: 'Alpha Co', viewValue: 'Alpha Co' },
    { value: 'Big Corp', viewValue: 'Big Corp' },
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

  // Determines the number of days in the table
  days: number[] = Array.from({ length: this.num_days }, (_, i) => i + 1);

  // Array to store the employees
  employees: { name: string; hours: { [key: string]: number } }[] = [
    { name: 'Matt John', hours: this.initializeHours() },
    { name: 'Ralph Ruby', hours: this.initializeHours() },
    { name: 'Ian Bennett', hours: this.initializeHours() },
    { name: 'Korbyn Irvin', hours: this.initializeHours() },
    { name: 'Brandon Rayos', hours: this.initializeHours() },
  ];

  constructor(
    private router: Router, 
    private timesheetService: TimesheetService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.initializeYears();
    this._selectedMonth = this.months[0].value;
    this._selectedYear = new Date().getFullYear();
    this._selectedProject = this.projects[0].value;
    this.loadTimeCardData();
}

  // Initialize all the hours in the table
  initializeHours(): { [key: number]: number } {
    const hours: { [key: number]: number } = {};
    this.days.forEach((day) => {
        hours[day] = 0;
    });
    return hours;
  }

  initializeYears() {
    const currentYear = new Date().getFullYear();
    this.years = Array.from({length: 10}, (_, i) => currentYear - 5 + i);
  }

  // Calculates the total hours displayed in the total column
  calculateTotalHours(hours: { [key: number]: number }): number {
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
  saveTimesheet() {
    if (!this.selectedProject || !this.selectedMonth || !this.selectedYear) {
        this.showSnackBar('Please select project, month, and year');
        return;
    }

    // Create an array to store all the requests
    const requests: any[] = [];

    // First, gather all the data that needs to be sent
    this.employees.forEach((employee) => {
      Object.entries(employee.hours).forEach(([day, hours]) => {
        // Subtract 1 from the day when creating the payload
        const adjustedDay = parseInt(day);
        if (hours && hours > 0) {
          const payload = {
            projectName: this.selectedProject,
            monthYear: `${this.selectedYear}-${this.selectedMonth.trim()}`,
            employeeName: employee.name,
            day: adjustedDay,
            hours: hours
          };
          requests.push(payload);
        }
      });
    });

    // Log all payloads for debugging
    console.log('All payloads to be sent:', requests);

    // Send the requests sequentially
    const sendSequentially = async () => {
        for (const payload of requests) {
            try {
                await this.timesheetService.saveTimeCard(payload).toPromise();
                this.showSnackBar('Timesheet saved successfully');
            } catch (error) {
                console.error('Error saving:', payload, error);
            }
        }
    };

    // Execute the sequential sending
    sendSequentially().then(() => {
        console.log('All timecards saved');
    }).catch(error => {
        console.error('Error in save process:', error);
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
    this.loadTimeCardData();
  }

  // Private property and getter/setter for selectedYear
  private _selectedYear: number = new Date().getFullYear();
  get selectedYear(): number {
    return this._selectedYear;
  }
  set selectedYear(value: number) {
    this._selectedYear = value;
    this.onYearChange();
    this.updateDays();
    this.loadTimeCardData();
  }

  // Private property and getter/setter for selectedProject
  private _selectedProject:  string = '';
  get selectedProject(): string {
    return this._selectedProject;
  }
  set selectedProject(value: string) {
    this._selectedProject = value;
    this.updateDays();
    this.loadTimeCardData();
  }

  // Resets the hours for each employee to ensure clean data for new month/year
  resetEmployeeHours() {
    this.employees.forEach((employee) => {
      employee.hours = this.initializeHours();
    });
  }

  private showSnackBar(message: string, duration: number = 3000): void {
    this.snackBar.open(message, 'Close', {
      duration: duration,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  // 
  // Getter for timesheet data
  //
  loadTimeCardData(): void {
    if (!this.selectedProject || !this.selectedMonth || !this.selectedYear) {
        this.showSnackBar('Please select project, month, and year');
        return;
    }

    this.isLoading = true;
    const monthYear = `${this.selectedYear}-${this.selectedMonth.trim()}`;
    
    this.timesheetService.getTimeCard(this.selectedProject, monthYear).subscribe({
        next: (response) => {
            if (response && response.data) {
                this.resetEmployeeHours();
                this.processTimeCardData(response.data);
                this.showSnackBar('Timecard data loaded successfully');
            } else {
                this.showSnackBar('No timecard data found');
            }
            this.isLoading = false;
        },
        error: (error) => {
            console.error('Error loading timecard data:', error);
            this.isLoading = false;
            this.showSnackBar('Error loading timecard data');
        }
    });
  }

  processTimeCardData(data: TimeCardData[]): void {
    data.forEach((timecard: TimeCardData) => {
      const employee = this.employees.find(emp => 
        emp.name === timecard.employeeName
      );
      
      if (employee) {
        // Convert DailyHours to the format needed for the table
        Object.entries(timecard.DailyHours).forEach(([day, hours]) => {
          // Add 1 to the day index to correct the offset
          const correctedDay = parseInt(day) + 1;
          employee.hours[correctedDay] = hours;
        });
      }
    });
  }
  
  updateDays() {
    if (this.selectedMonth && this.selectedYear) {
      const daysInMonth = this.getDaysInMonth(
        this.selectedMonth,
        this.selectedYear
      );
      this.days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
      this.num_days = daysInMonth;
      this.resetEmployeeHours();
      this.loadTimeCardData(); 
    }
  }

  updateEmployeeHours(data: any): void {
    // Assuming data is an array of objects with employeeName and hours
    data.forEach((entry: any) => {
      const employee = this.employees.find(e => e.name === entry.employeeName);
      if (employee) {
        employee.hours[entry.day] = entry.hours;
      }
    });
  }

  onYearChange(): void {
    this.updateDays();
    this.loadTimeCardData();
  }

  onMonthChange(): void {
    this.updateDays();
    this.loadTimeCardData();
  }

  onProjectChange(): void {
    this.loadTimeCardData();
  }


}
