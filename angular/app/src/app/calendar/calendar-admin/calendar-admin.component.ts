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
      console.log('itt');
      this.calendarOwner = calendarOwner;
      this.setUserData();
    });
    this.fetchUsers();
  }

  userSelection() {
    if (this.selectedUser) {
      this.getCalendarOwner(this.selectedUser).then(r => this.calendarManagementService.calendarOwner.next(r.body));
      this.calendarManagementService.selectedUser.next(this.selectedUser);
    }
  }

  userDetailsUpdate(form: NgForm) {
    console.log(form);
    this.calendarOwner.defaultNumOfHolidays = form.form.value.defNumOfHolidays;
    this.calendarOwner.defaultNumOfHOs = form.form.value.defNumOfHomeOffice;
    this.calendarService.updateCalendarOwner(this.calendarOwner).subscribe(resData => {
      this.setUserData();
      this.calendarManagementService.calendarOwner.next(this.calendarOwner);
    });
  }

  private async getCalendarOwner(username?: string) {
    return await this.calendarService.getCalendarOwner(username).toPromise();
  }

  private setUserData() {
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
          this.loadUsers(resData.body);
        }
      });
    } else if (this.authService.user.getValue().roles.includes('GROUPOWNER')) {
      console.log('FETCHING FOR GROUPOWNER');
      this.groupService.getGroupMembersByTeamLeader().subscribe(resData => {
        if (resData.body) {
          this.loadUsers(resData.body);
        }
      });
    }
  }

  private loadUsers(resData: {groupName: string, users: string[]}[]) {
    for (const element of resData) {
      const tmp = [];
      for (const user of element.users) {
        tmp.push({label: user, value: user});
      }
      this.users.push({label: 'Group: ' + element.groupName, items: tmp});
    }
    this.userSelectionForm.form.patchValue(
      {calendarUser: this.users}
    );
    this.selectedUser = this.authService.user.getValue().username;
  }

  ngOnDestroy(): void {
    this.calendarOwnerSubscription.unsubscribe();
  }

}
