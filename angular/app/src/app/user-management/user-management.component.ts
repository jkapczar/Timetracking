import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {UserService} from '../services/user.service';
import {AuthService} from '../services/auth.service';
import {User} from '../model/user.model';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  @ViewChild('userInformation', {static: true}) userInformationForm: NgForm;
  constructor(private userService: UserService) { }

  user: User;

  ngOnInit() {
    this.userService.getAllUsers().subscribe();
    this.userService.getCurrentUser().subscribe( resData => {
      this.user = new User(resData.body.id, resData.body.username, resData.body.firstName, resData.body.lastName, resData.body.email,
        resData.body.phone);
      this.userInformationForm.form.setValue({
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        email: this.user.email,
        phone: this.user.phone
      });
    });
  }

  onSubmitUserInformation(form: NgForm) {
    console.log('submit1');
    const user = new User(this.user.id, this.user.username, form.value.firstName,
      form.value.lastName, form.value.email, form.value.phone);
    this.userService.updateUser(user);
  }

  onSubmitUserCredentials(form: NgForm) {
    console.log('submit2');
  }

}
