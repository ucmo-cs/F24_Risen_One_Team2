import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { TimeComponent } from './timesheet/timesheet.component'; // Import the TimesheetComponent
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppModule } from './app.module';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'timesheet', component: TimeComponent }, // Add the route for the TimesheetComponent
];

@NgModule({
  imports: [RouterModule.forRoot(routes), FormsModule],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule{}