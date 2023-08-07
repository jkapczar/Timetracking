import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from './services/auth.service';
import {
  NavigationStart,
  Router
} from '@angular/router';
import {Subscription} from 'rxjs';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(private authService: AuthService,
              private router: Router) {}

  title = 'app';
  render = false;
  routerSubscription: Subscription;
  ngOnInit(): void {
    this.authService.autoLogin();
    this.routerSubscription = this.router.events.pipe(filter(e => e instanceof NavigationStart))
      .subscribe((event: NavigationStart) => {
        this.render = !(event.url.includes('login') || event.url.includes('registration') || event.url.includes('password'));
      });
  }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
  }
}
