import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private authService: AuthService) { }

  token: string;

  ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
      console.log(params);
      this.token = params.token ? params.token : null;
    });
  }

  onSubmit(form: NgForm) {
    if (!this.token) {
      console.log('t');
      this.authService.resetPasswordRequest({username: form.value.username, email: form.value.email});
    } else {
      console.log('resetpass');
      this.authService.resetPassword(form.value.password, this.token);
    }
  }

}
