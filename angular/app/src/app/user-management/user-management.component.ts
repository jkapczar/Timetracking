import {AfterViewChecked, Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {UserService} from '../services/user.service';
import {AuthService} from '../services/auth.service';
import {User} from '../model/user.model';
import {map} from 'rxjs/operators';
import {Observable, pipe} from 'rxjs';
import {Dropdown, DropdownModule} from 'primeng';
import {Creds} from '../model/creds.model';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  @ViewChild('userInformation') userInformationForm: NgForm;
  @ViewChild('userCredentials') userCredentialsForm: NgForm;
  constructor(private userService: UserService,
              private authService: AuthService) { }

  users = [];
  selectedUser: string;
  user: User;
  creds: Creds;
  active = true;

  // TODO work on selection, and placeholders
  ngOnInit() {
    this.userService.getAllUsers().subscribe(data => {
      for (const item of data.body) {
        this.users.push({label: item, value: item});
      }
    });
    this.userService.getUser().subscribe( resData => {
      this.setUI(resData);
      this.selectedUser = this.user.username;
    });
    this.authService.getCredentials().subscribe(resData => {
      this.setCredsUI(resData);
    });
  }

  private setUser(username: string) {
    console.log('username: ' + username);
    this.userService.getUser(username).subscribe(resData => {
      this.setUI(resData);
    });
    this.authService.getCredentials(username).subscribe(resData => {
      this.setCredsUI(resData);
    });
  }

  private setUI(resData) {
    this.user = new User(resData.body.id, resData.body.username, resData.body.firstName, resData.body.lastName, resData.body.email,
      resData.body.phone);
    this.userInformationForm.form.setValue({
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      email: this.user.email,
      phone: this.user.phone
    });
  }

  private setCredsUI(resData) {
    this.creds = new Creds(resData.body.id, resData.body.password, resData.body.secQuestion,
      resData.body.secAnswer, resData.body.active);
    this.userCredentialsForm.form.setValue({
      password: this.creds.password,
      confirmPassword: this.creds.password,
      secQuestion: this.creds.secQuestion,
      secAnswer: this.creds.secAnswer
    });
    this.active = this.creds.active;
  }

  onSubmitUserInformation(form: NgForm) {
    const user = new User(this.user.id, this.user.username, form.value.firstName,
      form.value.lastName, form.value.email, form.value.phone);
    this.userService.updateUser(user);
  }

  onSubmitUserCredentials(form: NgForm) {
    const creds = new Creds(this.user.id, form.value.password,
      form.value.secQuestion, form.value.secAnswer, this.active);
    this.authService.updateCredentials(creds);
  }

  onActivate() {
    console.log(this.selectedUser);
    this.authService.updateStatus(this.selectedUser).subscribe(resData => {
      console.log(resData);
      this.active = !this.active;
    });
  }

  onDelete() {
    console.log('deleting ' + this.selectedUser);
    this.userService.deleteUser(this.selectedUser).subscribe(resData => {
      console.log(resData.status);
      this.users.splice(this.users.indexOf(this.selectedUser), 1);
      this.userInformationForm.reset();
    });
  }

  onSelect() {
    this.setUser(this.selectedUser);
  }
}
