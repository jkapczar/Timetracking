import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {CalendarComponent} from './calendar/calendar.component';
import {RegistrationComponent} from './registration/registration.component';
import {UserManagementComponent} from './user-management/user-management.component';
import {GroupManagementComponent} from './group-management/group-management.component';
import {AuthGuard} from './security/authGuard.guard';
import {GroupGuard} from './security/groupGuard.guard';
import {PasswordResetComponent} from './password-reset/password-reset.component';
import {EventJournalComponent} from './event-journal/event-journal.component';


const routes: Routes = [
  {path: '', redirectTo: '/calendar', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'registration', component: RegistrationComponent},
  {path: 'resetpassword', component: PasswordResetComponent},
  {path: 'usermanagement', component: UserManagementComponent, canActivate: [AuthGuard]},
  {path: 'groupmanagement', component: GroupManagementComponent, canActivate: [GroupGuard]},
  {path: 'calendar', component: CalendarComponent, canActivate: [AuthGuard]},
  {path: 'journal', component: EventJournalComponent, canActivate: [GroupGuard]}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
