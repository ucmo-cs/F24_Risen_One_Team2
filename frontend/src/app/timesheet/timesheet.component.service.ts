import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TimesheetService {
  private apiUrl =
    'https://xf6bcsx4fc.execute-api.us-east-1.amazonaws.com/test/timecard';

  constructor(private http: HttpClient) {}

  saveTimesheet(timesheetData: any): Observable<any> {
    return this.http.post(this.apiUrl, timesheetData);
  }
}
