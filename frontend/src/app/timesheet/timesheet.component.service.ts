import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, switchMap } from 'rxjs/operators';

interface TimeCardPayload {
  projectName: string;
  monthYear: string;
  employeeName: string;
  day: number;
  hours: number;
}

interface TimeCardResponse {
  message: string;
  data?: {
    employeeName: string;
    DailyHours: { [key: string]: number };
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class TimesheetService {
  private apiUrl = 'https://xf6bcsx4fc.execute-api.us-east-1.amazonaws.com/test/timecard';

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => errorMessage);
  }

  saveTimeCard(payload: TimeCardPayload): Observable<TimeCardResponse> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.post<TimeCardResponse>(this.apiUrl, payload, { headers })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getTimeCard(projectName: string, monthYear: string): Observable<TimeCardResponse> {
    const params = new HttpParams()
      .set('projectName', projectName)
      .set('monthYear', monthYear);

    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.get<TimeCardResponse>(this.apiUrl, { headers, params })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  clearAndSaveTimeCard(payload: any): Observable<any> {
    // First delete existing records
    const deleteParams = {
      projectName: payload.projectName,
      monthYear: payload.monthYear
    };

    // Chain the delete and save operations
    return this.http.delete(`${this.apiUrl}`, { params: deleteParams })
      .pipe(
        switchMap(() => this.http.post(this.apiUrl, payload)),
        retry(1)
      );
  }

}
