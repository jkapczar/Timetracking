import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {GroupService} from '../services/group.service';
import {Group} from '../model/Group.model';
import {stringify} from 'querystring';

@Component({
  selector: 'app-group-management',
  templateUrl: './group-management.component.html',
  styleUrls: ['./group-management.component.css']
})
export class GroupManagementComponent implements OnInit {
  @ViewChild('updateGroupForm') updateForm: NgForm;
  constructor(private groupService: GroupService) { }

  groups = [];
  users = [];
  teamLeaders: string[] = ['t1', 't2', 't3'];
  selectedDeputies = [];
  selectedUser = '';
  selectedGroup: Group;

  test = [{name: 'New York', code: 'NY'},
    {name: 'Rome', code: 'RM'},
    {name: 'London', code: 'LDN'}];

  sourceUsers = ['init'];
  targetUsers = ['init'];
  //////////////////////////////////////


  ngOnInit() {
    this.groupService.getUsers().subscribe(resData => {
      for (const item of resData.body) {
        this.users.push({label: item, value: item});
      }
    });
    this.groupService.getGroups().subscribe(resData => {
      for (const item of resData.body) {
        this.groups.push({label: item, value: item});
      }
    });
    this.groupService.getUnassignedUsers().subscribe(resData => {
      this.sourceUsers.splice(0, 1);
      for (const item of resData.body) {
        this.sourceUsers.push(item);
      }
      // this.updateForm.form.updateValueAndValidity();
      // console.log('updated');
      // console.log(this.sourceUsers);
    });
  }

  onCreate(form: NgForm) {
    console.log('create group');
    console.log(form.value);
    console.log(form.valid);
    if (form.valid) {
      this.groupService.createGroup(form.value.groupName, form.value.selectedTeamLeader).subscribe(resData => {
        console.log(resData);
      });
    } else {
      console.log('invalid form');
    }
  }

  onUpdate(form: NgForm) {
    console.log(form.value);
    if (this.selectedGroup) {
      this.selectedGroup.members = this.targetUsers.map(e => ({username: e}));
      this.selectedGroup.deputies = form.value.selectedDeputies.map(e => ({username: e}));
      this.selectedGroup.teamLeader = {username: form.value.selectedTeamLeader};
      console.log(this.selectedGroup);
      this.groupService.updateGroup(this.selectedGroup).subscribe(resData => {
        console.log(resData);
      });
    }
  }

  onDelete(form: NgForm) {
    console.log('delete');
    console.log(form.value);
    if (form.valid) {
      this.groupService.deleteGroup(form.value.groupName).subscribe(resData => {
        console.log(resData);
      });
    } else {
      console.log('invalid form');
    }
  }

  groupSelection(event: any) {
    console.log(event.value);
    this.groupService.getGroup(event.value).subscribe(resData => {
      this.selectedGroup = resData.body;
      console.log(this.selectedGroup);
      this.updateForm.form.patchValue({
        selectedTeamLeader: this.selectedGroup.teamLeader == null ? '' : this.selectedGroup.teamLeader.username,
        selectedDesputies: this.selectedGroup.deputies.map(e => e.username == null ? '' : e.username),
      });
      this.targetUsers = this.selectedGroup.members.map(e => e.username == null ? '' : e.username);
    });
    this.groupService.getUnassignedUsers().subscribe(resData => {
      this.sourceUsers = [];
      for (const item of resData.body) {
        this.sourceUsers.push(item);
      }
    });
  }


}
