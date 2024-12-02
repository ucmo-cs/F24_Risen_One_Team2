import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // Import necessary modules
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimesheetService {

  private apiUrl = 'https://xf6bcsx4fc.execute-api.us-east-1.amazonaws.com/test/timecard'; // API URL of your Lambda function

  constructor(private http: HttpClient) {}

  // Method to save timecard data
  saveTimeCard(data: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'  // Ensure the content type is application/json
    });

    return this.http.post(this.apiUrl, data, { headers });  // Send the POST request with the payload
  }
}

