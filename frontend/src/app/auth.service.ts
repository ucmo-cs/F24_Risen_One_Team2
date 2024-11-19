
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  baseURL: string = "https://7skgw1mjg7.execute-api.us-east-1.amazonaws.com/testLogin/";

  constructor(private http: HttpClient,private router: Router) { }

  login(username: string, password: string): Observable<boolean> {
    const user = JSON.stringify({ username, password });

    return this.http.post<{message : string}>(this.baseURL + 'login', user).pipe(
      map(response => {
        console.log("Response:", response.message);
        if (response.message === 'Login successful') { // checks message sent from lamba against requirment
          return true;
        } else {
          return false;
        }
      }),
      catchError(error => {  // catches error thrown from above
        console.error('Login error:', error);  // testing statement
        return new Observable<boolean>(observer => {
          observer.next(false); // sets to false
          observer.complete();
        });
      })
    );
  }

  logout() {
    // Your logout logic with Lambda function
    // Simulating success for demonstration purposes
    const logoutSuccess = true;

    if (logoutSuccess) {
      // Redirect to login page or any other desired page
      this.router.navigate(['/login']);
    } else {
      // Handle logout failure
      console.error('Logout failed');
    }
  }
}
