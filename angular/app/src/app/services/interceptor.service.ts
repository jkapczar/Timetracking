import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {AuthService} from './auth.service';
import {catchError, exhaustMap, take} from 'rxjs/operators';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authService.user.pipe(
      take(1),
      exhaustMap(user => {
        if (!user) {
          return next.handle(req);
        }
        if ((new Date()).getTime() > (new Date(user.exp * 1000)).getTime()) {
          console.log('token expired logout');
          this.authService.logout();
        } else {
          const modifiedRequest = req.clone({headers: new HttpHeaders().set('Authorization', user.token)});
          return next.handle(modifiedRequest).pipe(catchError(error => {
            return throwError(error);
          }));
        }
      })
    );
  }
}
