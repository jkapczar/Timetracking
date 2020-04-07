import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivateChild, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserAdminGuard implements CanActivateChild {

  constructor(private authService: AuthService,
              private router: Router) {}

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.user.value.authorities.indexOf('ADMIN') !== -1) {
      return true;
    } else {
      this.router.navigate(['usermanagement']);
      return false;
    }
  }
}
