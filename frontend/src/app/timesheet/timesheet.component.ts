import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { provideNativeDateAdapter } from '@angular/material/core';
import { jsPDF } from 'jspdf';
import { TimesheetService } from './timesheet.component.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';

interface PreviousRequest {
  value: string;
  viewValue: string;
}

interface TimesheetEntry {
  projectName: string;
  monthYear: string;
  employeeName: string;
  day: number;
  hours: number;
}

@Component({
  selector: 'app-timesheet',
  providers: [provideNativeDateAdapter()],
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.css'],
})
export class TimeComponent implements OnInit {
  selectedProject: string = '';
  isEditing: boolean = false;
  num_days: number = 28;
  isLoading: boolean = false;

  projects: PreviousRequest[] = [
    { value: 'BAER', viewValue: 'BAER' },
    { value: 'XYZ Corp', viewValue: 'XYZ Corp' },
    { value: 'Alpha Co', viewValue: 'Alpha Co' },
  ];

  months: PreviousRequest[] = [
    { value: 'January', viewValue: 'January' },
    { value: 'February', viewValue: 'February' },
    { value: 'March', viewValue: 'March' },
    { value: 'April', viewValue: 'April' },
    { value: 'May', viewValue: 'May' },
    { value: 'June', viewValue: 'June' },
    { value: 'July', viewValue: 'July' },
    { value: 'August', viewValue: 'August' },
    { value: 'September', viewValue: 'September' },
    { value: 'October', viewValue: 'October' },
    { value: 'November', viewValue: 'November' },
    { value: 'December', viewValue: 'December' },
  ];

  days: number[] = [];
  timesheetEntries: TimesheetEntry[] = [];
  employees: { name: string; hours?: { [key: string]: number } }[] = [];
  hardcodedEmployees: string[] = [
    'John Doe',
    'Jane Smith',
    'Mike Green'
  ];

  years: number[] = this.generateYearOptions();

  private _selectedMonth: string = '';
  private _selectedYear: number = new Date().getFullYear();

  constructor(
    private router: Router,
    private timesheetService: TimesheetService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    const currentDate = new Date();
    this.selectedMonth = this.months[currentDate.getMonth()].value;
    this.selectedYear = currentDate.getFullYear();
    this.updateDays();
    this.initializeEmployees();
  }

  initializeEmployees() {
    this.employees = this.hardcodedEmployees.map(name => ({ name, hours: {} }));
  }

  generateYearOptions(): number[] {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 6 }, (_, index) => currentYear - index).reverse();
  }

  loadTimesheetData() {
    if (!this.selectedProject) return;

    const monthYear = `${this.selectedMonth}-${this.selectedYear}`;
    this.isLoading = true;
    this.timesheetService.getTimesheetData(this.selectedProject, monthYear).subscribe({
      next: (data) => {
        this.timesheetEntries = data;
        this.updateEmployeesFromEntries();
        this.isLoading = false;
      },
      error: (error) => {
        this.openSnackBar('Error loading timesheet data', 'Close');
        console.error('Error loading timesheet data:', error);
        this.isLoading = false;
      }
    });
  }
  
  ensureAllHardcodedEmployees() {
    const existingEmployees = new Set(this.employees.map(e => e.name));
    this.hardcodedEmployees.forEach(name => {
      if (!existingEmployees.has(name)) {
        this.employees.push({ name, hours: {} });
      }
    });
  }

  updateEmployeesFromEntries() {
    const employeeMap = new Map(this.employees.map(e => [e.name, e]));

    this.timesheetEntries.forEach(entry => {
      if (employeeMap.has(entry.employeeName)) {
        const employee = employeeMap.get(entry.employeeName)!;
        if (employee.hours) {
          employee.hours[entry.day] = entry.hours;
        } else {
          employee.hours = { [entry.day]: entry.hours };
        }
      }
    });

    this.employees = Array.from(employeeMap.values());
  }
  

  saveTimesheet() {
    this.isLoading = true;
    const entriesToSave = this.employees.flatMap(employee => 
      Object.entries(employee.hours || {}).map(([day, hours]) => ({
        projectName: this.selectedProject,
        monthYear: `${this.selectedMonth}-${this.selectedYear}`,
        employeeName: employee.name,
        day: parseInt(day),
        hours: hours
      }))
    ).filter(entry => entry.hours > 0);
  
    const saveObservables = entriesToSave.map(entry => 
      this.timesheetService.saveTimesheetEntry(entry)
    );
  
    forkJoin(saveObservables).subscribe({
      next: () => {
        this.openSnackBar('Timesheet saved successfully', 'Close');
        this.isEditing = false;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.openSnackBar('Error saving timesheet', 'Close');
        console.error('Error saving timesheet:', error);
        this.isLoading = false;
      }
    });
  }

  onProjectChange() {
    if (this.selectedProject) {
      this.loadTimesheetData();
    }
  }

  get selectedMonth(): string {
    return this._selectedMonth;
  }

  set selectedMonth(value: string) {
    this._selectedMonth = value;
    this.updateDays();
    if (this.selectedProject) {
      this.loadTimesheetData();
    }
  }

  get selectedYear(): number {
    return this._selectedYear;
  }

  set selectedYear(value: number) {
    this._selectedYear = value;
    this.updateDays();
    if (this.selectedProject) {
      this.loadTimesheetData();
    }
  }

  updateDays() {
    if (this.selectedMonth && this.selectedYear) {
      const daysInMonth = this.getDaysInMonth(this.selectedMonth, this.selectedYear);
      this.days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
      this.num_days = daysInMonth;
    }
  }

  getDaysInMonth(month: string, year: number): number {
    const monthIndex = this.months.findIndex((m) => m.value.trim() === month.trim());
    return new Date(year, monthIndex + 1, 0).getDate();
  }

  editTimesheet() {
    this.isEditing = !this.isEditing;
  }

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

  calculateTotalHours(hours?: { [key:string]: number }): number {
    return hours ? Object.values(hours).reduce((total, hours) => total + hours, 0) : 0;
  }

  calculateTotalHoursPerDay(day: number): number {
    return this.employees.reduce((total, employee) => {
      if (employee.hours && employee.hours[day] !== undefined) {
        return total + employee.hours[day];
      }
      return total;
    }, 0);
  }

  calculateGrandTotalHours(): number {
    return this.employees.reduce((total, employee) => 
      total + Object.values(employee.hours || {}).reduce((sum, hours) => sum + hours, 0), 
      0
    );
  }

  getFormattedMonthYear(): string {
    const monthIndex = this.months.findIndex(m => m.value === this.selectedMonth);
    return `${(monthIndex + 1).toString().padStart(2, '0')}/${this.selectedYear.toString().slice(-2)}`;
  }

  private openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
    });
  }
  getHours(employee: any, day: number): number {
    return employee.hours?.[day - 1] || 0;
  }
  
  setHours(employee: any, day: number, value: number) {
    if (!employee.hours) {
      employee.hours = {};
    }
    employee.hours[day - 1] = value;
  }
}