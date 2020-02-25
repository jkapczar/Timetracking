import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {CalendarComponent} from './calendar/calendar.component';
import {RegistrationComponent} from './registration/registration.component';
import {UserManagementComponent} from './user-management/user-management.component';
import {GroupManagementComponent} from './group-management/group-management.component';


const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'registration', component: RegistrationComponent},
  {path: 'usermanagement', component: UserManagementComponent},
  {path: 'groupmanagement', component: GroupManagementComponent},
  {path: 'calendar', component: CalendarComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
