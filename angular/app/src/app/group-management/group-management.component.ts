import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {GroupService} from '../services/group.service';

@Component({
  selector: 'app-group-management',
  templateUrl: './group-management.component.html',
  styleUrls: ['./group-management.component.css']
})
export class GroupManagementComponent implements OnInit {

  constructor(private groupService: GroupService) { }

  groups: string[] = ['g1', 'g2', 'g3'];
  users: string[] = ['u1', 'u2', 'u3'];
  teamLeaders: string[] = ['t1', 't2', 't3'];
  selectedDeputies = [];
  selectedUser = 'a';
  selectedGroup = 'aa';

  test = [{name: 'New York', code: 'NY'},
    {name: 'Rome', code: 'RM'},
    {name: 'London', code: 'LDN'},];

  sourceUsers = ['u1', 'u2', 'u3'];
  targerUsers = ['u4', 'u5', 'u6'];

  ngOnInit() {
  }

  onCreate(form: NgForm) {
    console.log('create group');
    console.log(form.value);
  }

  onUpdate(form: NgForm) {
    console.log('update');
    console.log(form.value);
  }

  onDelete(form: NgForm) {
    console.log('delete');
    console.log(form.value);
  }

  onTest() {
    this.groupService.getGroupsTest().subscribe(resData => {console.log(resData);});
  }

}
