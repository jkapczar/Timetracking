import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {CalendarComponent} from './calendar/calendar.component';
import {RegistrationComponent} from './registration/registration.component';
import {UserManagementComponent} from './user-management/user-management.component';
import {GroupManagementComponent} from './group-management/group-management.component';
import {UserAdminComponent} from './user-management/user-admin/user-admin.component';
import {UserAdminGuard} from './security/user-admin.guard';
import {UserGuard} from './security/user.guard';


const routes: Routes = [
  {path: '', redirectTo: '/calendar', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'registration', component: RegistrationComponent},
  {path: 'usermanagement', component: UserManagementComponent, canActivateChild: [UserAdminGuard], children: [
      {path: 'admin', component: UserAdminComponent}
    ]},
  {path: 'groupmanagement', component: GroupManagementComponent},
  {path: 'calendar', component: CalendarComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
