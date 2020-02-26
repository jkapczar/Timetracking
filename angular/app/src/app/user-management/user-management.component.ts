import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {UserService} from '../services/user.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.getAllUsers().subscribe();
  }

  onSubmit(form: NgForm) {
    console.log("submit");
  }

}
