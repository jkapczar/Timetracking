import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';
import {MessageService} from 'primeng';
import {HttpErrorResponse} from '@angular/common/http';
import {Message} from '../model/message.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService,
              private router: Router,
              private messagingService: MessageService) { }

  ngOnInit() {}

  onSubmit(form: NgForm) {
    this.authService.login(form.value.username, form.value.password).subscribe(resData => {
      this.router.navigate(['calendar']);
    }, (error: HttpErrorResponse) => {
      if (error.status === 401) {
        this.messagingService.add(new Message(
          'error',
          'Login failed!',
          'Wrong username or password!'));
      } else {
        this.messagingService.add(new Message(
          'error',
          'Login failed!',
          'Unknown error happened!'));
      }
    });
  }

  navToRegistration() {
    console.log('nav to registration');
    this.router.navigate(['registration']);
  }

  navToPasswordreset() {
    console.log('nav to resetpassword');
    this.router.navigate(['resetpassword']);
  }

}
