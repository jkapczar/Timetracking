import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {UserService} from '../services/user.service';
import {AuthService} from '../services/auth.service';
import {User} from '../model/user.model';
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


  user: User;
  credentials: Creds;
  active = true;

  ngOnInit() {}

  onSubmitUserInformation(form: NgForm) {
    const user = new User(this.user.id, this.user.username, form.value.firstName,
      form.value.lastName, form.value.email, form.value.phone);
    this.userService.updateUser(user);
  }

  onSubmitUserCredentials(form: NgForm) {
    const credentials = new Creds(this.user.id, form.value.password,
      form.value.secQuestion, form.value.secAnswer, this.active);
    this.authService.updateCredentials(credentials);
  }

  setSelectedUser(username: string) {
    this.setUser(username);
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

  private setCredentialsUI(resData) {
    this.credentials = new Creds(resData.body.id, resData.body.password, resData.body.secQuestion,
      resData.body.secAnswer, resData.body.active);
    this.userCredentialsForm.form.setValue({
      password: this.credentials.password,
      confirmPassword: this.credentials.password,
      secQuestion: this.credentials.secQuestion,
      secAnswer: this.credentials.secAnswer
    });
    this.active = this.credentials.active;
  }

  private setUser(username: string) {
    console.log('username: ' + username);
    this.userService.getUser(username).subscribe(resData => {
      this.setUI(resData);
    });
    this.authService.getCredentials(username).subscribe(resData => {
      this.setCredentialsUI(resData);
    });
  }
}
