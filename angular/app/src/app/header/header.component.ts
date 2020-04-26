import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {Subscription} from 'rxjs';
import {AuthUser} from '../model/authUser.model';
import {exhaustMap, take} from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  constructor(private authService: AuthService) { }

  userSubscription: Subscription;
  user: AuthUser;
  render = false;

  roles: string[] = [];
  groups: string[] = [];
  member: string[] = [];
  ngOnInit() {
    this.userSubscription = this.authService.user.subscribe(user => {
      if (user) {
        this.render = true;
        this.user = this.authService.user.getValue();
        this.groups = this.user.roles.filter(element => (element.startsWith('TL_') || element.startsWith('DEPUTY_')));
        this.roles = this.user.roles.filter(element => !element.includes('_'));
        this.member = this.user.roles.filter(element => element.startsWith('MEMBER_'));
      } else {
        this.render = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
}
