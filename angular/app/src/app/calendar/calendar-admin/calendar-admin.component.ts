import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {CalendarUser} from '../../model/event.model';
import {CalendarService} from '../../services/calendar.service';
import {GroupService} from '../../services/group.service';
import {AuthService} from '../../services/auth.service';
import {CalendarManagementService} from '../../services/calendar-management.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-calendar-admin',
  templateUrl: './calendar-admin.component.html',
  styleUrls: ['./calendar-admin.component.css']
})
export class CalendarAdminComponent implements OnInit, OnDestroy {
  @ViewChild('userSelectionForm', { static: false }) userSelectionForm;
  @ViewChild('userDetailsForm', { static: false }) userDetailsForm;

  constructor(private calendarService: CalendarService,
              private groupService: GroupService,
              private authService: AuthService,
              private calendarManagementService: CalendarManagementService) { }


  users: any[] = [];
  selectedUser: string;

  calendarOwner: CalendarUser;
  calendarOwnerSubscription: Subscription;


  ngOnInit(): void {

    this.calendarOwnerSubscription = this.calendarManagementService.calendarOwner.subscribe(calendarOwner => {
      this.calendarOwner = calendarOwner;
    });

    // TODO amind mindenkit lát tl csak a saját csopit
    this.getCalendarOwner().then(r => (this.setUserData(r.body), this.fetchUsers()));
  }

  userSelection() {
    if (this.selectedUser) {
      this.getCalendarOwner(this.selectedUser).then(r => this.setUserData(r.body));
      this.calendarManagementService.selectedUser.next(this.selectedUser);
    }
  }

  userDetailsUpdate(form: NgForm) {
    console.log(form);
    this.calendarOwner.defaultNumOfHolidays = form.form.value.defNumOfHolidays;
    this.calendarOwner.defaultNumOfHOs = form.form.value.defNumOfHomeOffice;
    this.calendarService.updateCalendarOwner(this.calendarOwner).subscribe(resData => {
      this.setUserData(this.calendarOwner);
    });
  }

  private async getCalendarOwner(username?: string) {
    return await this.calendarService.getCalendarOwner(username).toPromise();
  }

  private setUserData(user: CalendarUser) {
    this.calendarManagementService.calendarOwner.next(user);
    this.userDetailsForm.form.setValue({
      defNumOfHolidays: this.calendarOwner.defaultNumOfHolidays,
      defNumOfHomeOffice: this.calendarOwner.defaultNumOfHOs
    });
  }

  private fetchUsers() {
    if (this.authService.user.getValue().roles.includes('ADMIN')) {
      console.log('FETCHING FOR ADMIN');
      this.groupService.getGroupsAndUsers().subscribe(resData => {
        if (resData.body) {
          console.log(resData);
          for (const element of resData.body) {
            const tmp = [];
            for (const user of element.users) {
              tmp.push({label: user, value: user});
            }
            this.users.push({label: 'Group: ' + element.groupName, items: tmp});
          }
        }
      });
    } else if (this.authService.user.getValue().roles.includes('GROUPOWNER')) {
      console.log('FETCHING FOR GROUPOWNER');
      this.groupService.getGroupByTeamLeader().subscribe(resData => {
        if (resData.body) {
          for (const e of resData.body) {
            this.users.push({label: e, value: e});
          }
          this.userSelectionForm.form.patchValue(
            {calendarUser: this.users}
          );
        }
        this.selectedUser = this.calendarOwner.username;
      });
    }
  }

  ngOnDestroy(): void {
    this.calendarOwnerSubscription.unsubscribe();
  }

}
