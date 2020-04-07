import {Component, OnInit} from '@angular/core';
import {AuthService} from './services/auth.service';
import {ActivatedRoute, ActivatedRouteSnapshot, Router, RouterOutlet, RouterState, RouterStateSnapshot} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService) {}

  title = 'app';

  render = true;

  ngOnInit(): void {
    this.authService.autoLogin();
  }
}
