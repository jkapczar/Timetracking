import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService,
              private router: Router) { }

  ngOnInit() {}

  onSubmit(form: NgForm) {
    console.log('login submit');
    console.log(form.value);
    this.authService.login(form.value.username, form.value.password).subscribe(resData => {
      console.log((resData.headers.get('Authorization')));
      this.router.navigate(['calendar']);
    });
  }

  navToRegistration() {
    console.log('nav to registration');
    this.router.navigate(['registration']);
  }

}
