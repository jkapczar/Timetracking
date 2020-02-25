import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-group-management',
  templateUrl: './group-management.component.html',
  styleUrls: ['./group-management.component.css']
})
export class GroupManagementComponent implements OnInit {

  constructor() { }

  list1 = ['t1', 't2', 't3'];
  list2 = ['t1', 't2', 't3'];

  users = ['t1', 't2', 't3'];
  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    console.log(form.value);
  }

}
