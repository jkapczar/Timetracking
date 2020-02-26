import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {UserService} from '../services/user.service';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {

  constructor(private userService: UserService) { }

  // TODO load user object
  ngOnInit() {
    this.userService.getAllUsers().subscribe();
    this.userService.getCurrentUser().subscribe(resData => {
      console.log(resData);
    });
  }

  onSubmit(form: NgForm) {
    console.log('submit');
  }

}
