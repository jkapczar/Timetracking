import { Component, OnInit } from '@angular/core';
import {JournalService} from '../services/journal.service';
import {Journal} from '../model/journal.model';
import {NgForm} from '@angular/forms';
import {AuthService} from '../services/auth.service';
import {GroupService} from '../services/group.service';

@Component({
  selector: 'app-event-journal',
  templateUrl: './event-journal.component.html',
  styleUrls: ['./event-journal.component.css']
})
export class EventJournalComponent implements OnInit {

  constructor(private journalService: JournalService,
              private authService: AuthService,
              private groupService: GroupService) { }


  statusOptions = [
    {label: 'PENDING', value: 'PENDING'},
    {label: 'ACCEPTED', value: 'ACCEPTED'},
    {label: 'DECLINED', value: 'DECLINED'}
    ];

  events: Journal[] = [];
  groupsAndUsers: {groupName: string, users: string[]}[] = [];
  selectedGroupAndUsers: {groupName: string, users: string[]};
  groups: {label: string, value: string}[] = [];


  ngOnInit(): void {
    this.fetchUsers();
  }

  onSelect(form: NgForm) {
    if (form.valid) {
      this.selectedGroupAndUsers = this.groupsAndUsers.find((element) => element.groupName === form.value.selectGroup);
      this.journalService.getTest({status: form.value.selectStatus, users: this.selectedGroupAndUsers.users}).subscribe(resData => {
        console.log(resData);
        this.events = [];
        for (const e  of resData.body) {
          this.events.push(new Journal(e.id, e.groupName, e.eventOwner, e.events, e.status));
        }
      });
    }
  }


  onAccept(item: Journal) {
    console.log('accept');
    console.log(item);
    this.journalService.updateEvent({status: 'ACCEPTED', id: item.id}).subscribe(resData => {
      this.events = this.events.filter(element => element.id !== item.id);
      this.events.push(new Journal(resData.body.id, resData.body.groupName, resData.body.eventOwner, resData.body.events, resData.body.status));
    });
  }

  onDeclined(item: Journal) {
    console.log('declined');
    console.log(item);
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
    this.groupsAndUsers = resData;
    for (const element of resData) {
      this.groups.push({label: element.groupName, value: element.groupName});
    }
  }


}
