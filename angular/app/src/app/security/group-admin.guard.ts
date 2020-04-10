import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {Observable, of} from 'rxjs';
import {exhaustMap, take} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GroupAdminGuard implements CanActivateChild {

  constructor(private authService: AuthService,
              private router: Router) {}

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.user.pipe(take(1), exhaustMap(user => {
      if (user.roles.includes('ADMIN')) {
        return of(true);
      } else {
        this.router.navigate(['groupmanagement']);
        return of(false);
      }
    }));
  }
}
