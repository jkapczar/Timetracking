import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {CalendarUser} from '../../model/event.model';
import {CalendarService} from '../../services/calendar.service';
import {GroupService} from '../../services/group.service';
import {AuthService} from '../../services/auth.service';
import {CalendarManagementService} from '../../services/calendar-management.service';
import {Subscription} from 'rxjs';
import {Message} from '../../model/message.model';
import {MessageService} from 'primeng';

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
              private calendarManagementService: CalendarManagementService,
              private messagingService: MessageService) { }


  users: any[] = [];
  selectedUser: string;

  calendarOwner: CalendarUser;
  calendarOwnerSubscription: Subscription;


  ngOnInit(): void {
    this.calendarOwnerSubscription = this.calendarManagementService.calendarOwner.subscribe(calendarOwner => {
      this.calendarOwner = calendarOwner;
      this.setUserData();
    });
    this.fetchUsers();
  }

  userSelection() {
    if (this.selectedUser) {
      this.getCalendarOwner(this.selectedUser).then(r => this.calendarManagementService.calendarOwner.next(r.body))
        .catch( error => {
          this.messagingService.add(new Message(
            'error',
            'Unknown error happened!',
            ''));
        });
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
      this.messagingService.add(new Message(
        'success',
        'Update failed!',
        ''));
    }, error => {
      this.messagingService.add(new Message(
        'error',
        'Update failed!',
        ''));
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
      this.groupService.getGroupsAndUsers().subscribe(resData => {
        if (resData.body) {
          this.loadUsers(resData.body);
        }
      }, error => {
        this.messagingService.add(new Message(
          'error',
          'Service is down!',
          ''));
      });
    } else if (this.authService.user.getValue().roles.includes('GROUPOWNER')) {
      this.groupService.getGroupMembersByTeamLeader().subscribe(resData => {
        if (resData.body) {
          this.loadUsers(resData.body);
        }
      }, error => {
        this.messagingService.add(new Message(
          'error',
          'Service is down!',
          ''));
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
