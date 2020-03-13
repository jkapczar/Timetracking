import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {GroupService} from '../services/group.service';

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
  selectedGroup = '';

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
      this.sourceUsers.splice(0,1);
      for (const item of resData.body) {
        this.sourceUsers.push(item);
      }
      // this.updateForm.form.updateValueAndValidity();
      console.log('updated');
      console.log(this.sourceUsers);
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
    console.log('update');
    console.log(form.value);
    console.log(this.sourceUsers);
    console.log(this.targetUsers);
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
      console.log(resData);
    });
  }


}
