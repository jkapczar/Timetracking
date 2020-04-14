import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import {FormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {InterceptorService} from './services/interceptor.service';
import { CalendarComponent } from './calendar/calendar.component';
import { RegistrationComponent } from './registration/registration.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { UserManagementComponent } from './user-management/user-management.component';
import {MatchValueDirective} from './shared/must-match.directive';
import { MenuComponent } from './menu/menu.component';
import { GroupManagementComponent } from './group-management/group-management.component';
import {DropdownModule, MultiSelectModule, PanelModule, PickListModule, SplitButtonModule, TableModule} from 'primeng';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { FullCalendarModule } from '@fullcalendar/angular';
import { UserAdminComponent } from './user-management/user-admin/user-admin.component';
import { GroupAdminComponent } from './group-management/group-admin/group-admin.component';
import { CalendarAdminComponent } from './calendar/calendar-admin/calendar-admin.component';
import { EventJournalComponent } from './event-journal/event-journal.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    CalendarComponent,
    RegistrationComponent,
    PasswordResetComponent,
    UserManagementComponent,
    MatchValueDirective,
    MenuComponent,
    GroupManagementComponent,
    UserAdminComponent,
    GroupAdminComponent,
    CalendarAdminComponent,
    EventJournalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    PickListModule,
    MultiSelectModule,
    BrowserAnimationsModule,
    DropdownModule,
    FullCalendarModule,
    PanelModule,
    SplitButtonModule,
    TableModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
