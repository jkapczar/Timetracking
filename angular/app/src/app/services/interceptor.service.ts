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
    return this.authService.token.pipe(
      take(1),
      exhaustMap(token => {
        // no token available
        if (!token) {
          return next.handle(req);
        }
        const modifiedRequest = req.clone({headers: new HttpHeaders().set('Authorization', token)});
        console.log(modifiedRequest);
        return next.handle(modifiedRequest).pipe(catchError(error => {
          // our token expired
          if (error.status === 401) {
            this.authService.logout();
          }
          return throwError(error);
        }));
      })
    );
  }
}
