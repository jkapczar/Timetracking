import {Component, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  constructor(private authService: AuthService) { }

  isGroupOwnerOrAdmin = false;

  ngOnInit() {
    this.isGroupOwnerOrAdmin = (this.authService.user.getValue().roles.includes('GROUPOWNER')
      || this.authService.user.getValue().roles.includes('ADMIN'));
  }

  onLogout() {
    this.authService.logout();
  }
}
