import { Component, OnInit } from '@angular/core';
import {JournalService} from '../services/journal.service';
import {Journal} from '../model/journal.model';
import {NgForm} from '@angular/forms';
import {AuthService} from '../services/auth.service';
import {GroupService} from '../services/group.service';
import {MessageService} from 'primeng';
import {Message} from '../model/message.model';

@Component({
  selector: 'app-event-journal',
  templateUrl: './event-journal.component.html',
  styleUrls: ['./event-journal.component.css']
})
export class EventJournalComponent implements OnInit {

  constructor(private journalService: JournalService,
              private authService: AuthService,
              private groupService: GroupService,
              private messagingService: MessageService) { }


  statusOptions = [
    {label: 'PENDING', value: 'PENDING'},
    {label: 'ACCEPTED', value: 'ACCEPTED'},
    {label: 'DECLINED', value: 'DECLINED'}
    ];

  activeSelection: string;

  events: Journal[] = [];
  groupsAndUsers: {groupName: string, users: string[]}[] = [];
  selectedGroupAndUsers: {groupName: string, users: string[]};
  groups: {label: string, value: string}[] = [];
  selected = false;


  ngOnInit(): void {
    this.fetchUsers();
  }

  onSelect(form: NgForm) {
    if (form.valid) {
      this.selectedGroupAndUsers = this.groupsAndUsers.find((element) => element.groupName === form.value.selectGroup);
      this.journalService.getEvents({status: form.value.selectStatus, users: this.selectedGroupAndUsers.users}).subscribe(resData => {
        this.events = [];
        for (const e  of resData.body) {
          this.events.push(new Journal(e.id, e.groupName, e.eventOwner, e.events, e.status, e.updatedBy, e.createdOn, e.updatedOn));
        }
      }, error => {
        this.messagingService.add(new Message(
          'error',
          'Unable to fetch event',
          ''));
      });
      this.activeSelection = form.value.selectStatus;
      this.selected = true;
    } else {
      this.messagingService.add(new Message(
        'error',
        'Form is valid!',
        ''));
    }
  }

  onAccept(item: Journal) {
    this.updateEvent('ACCEPTED', item);
  }

  onDeclined(item: Journal) {
    this.updateEvent('DECLINED', item);
  }

  private updateEvent(status: string, item: Journal) {
    this.journalService.updateEvent({status, id: item.id, updatedBy: this.authService.user.getValue().username})
      .subscribe(resData => {
          this.events = this.events.filter(element => element.id !== item.id);
          this.messagingService.add(new Message(
          'success',
          'Update was successful!',
          ''));
        }, error => {
        this.messagingService.add(new Message(
          'error',
          'Update failed!',
          ''));
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
    this.groupsAndUsers = resData;
    for (const element of resData) {
      this.groups.push({label: element.groupName, value: element.groupName});
    }
  }


}
