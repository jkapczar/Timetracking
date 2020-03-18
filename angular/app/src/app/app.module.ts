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
import {DropdownDirective} from './shared/dropdown.directive';
import { MenuComponent } from './menu/menu.component';
import { GroupManagementComponent } from './group-management/group-management.component';
import {DropdownModule, FullCalendarModule, MultiSelectModule, PickListModule} from 'primeng';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';


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
    DropdownDirective,
    MenuComponent,
    GroupManagementComponent
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
        FullCalendarModule
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
