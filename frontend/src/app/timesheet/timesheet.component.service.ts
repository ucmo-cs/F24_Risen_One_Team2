import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface TimesheetEntry {
  projectName: string;
  monthYear: string;
  employeeName: string;
  day: number;
  hours: number;
}

@Injectable({
  providedIn: 'root'
})
export class TimesheetService {
  private apiUrl = 'https://xf6bcsx4fc.execute-api.us-east-1.amazonaws.com/test/timecard';

  constructor(private http: HttpClient) {}

  getTimesheetData(projectName: string, monthYear: string): Observable<TimesheetEntry[]> {
    return this.http.get<TimesheetEntry[]>(`${this.apiUrl}/timesheet`, {
      params: { projectName, monthYear }
    });
  }

  saveTimesheetEntry(entry: TimesheetEntry): Observable<any> {
    return this.http.post(`${this.apiUrl}/timesheet`, entry);
  }

  updateTimesheetEntry(entry: TimesheetEntry): Observable<any> {
    return this.http.put(`${this.apiUrl}/timesheet`, entry);
  }

  deleteTimesheetEntry(projectName: string, monthYear: string, employeeName: string, day: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/timesheet`, {
      params: { projectName, monthYear, employeeName, day: day.toString() }
    });
  }
}
