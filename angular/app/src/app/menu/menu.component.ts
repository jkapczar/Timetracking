import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {Subscription} from 'rxjs';
import {exhaustMap, take} from 'rxjs/operators';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit, OnDestroy {

  constructor(private authService: AuthService) { }

  isAdmin = false;
  userSubscription: Subscription;

  ngOnInit() {
    this.userSubscription = this.authService.user.subscribe(user => {
      console.log(user);
      if (user) {
        this.isAdmin = user.roles.includes('ADMIN');
        console.log(this.isAdmin);
      }
    });
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

}
