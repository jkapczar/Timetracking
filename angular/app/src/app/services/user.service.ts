import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Router} from '@angular/router';
import {exhaust, exhaustMap, map, tap} from 'rxjs/operators';
import {AuthService} from './auth.service';
import {User} from '../model/user.model';
import {pipe} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient,
              private router: Router,
              private authService: AuthService) {}

  getAllUsers() {
    return this.http.get<string[]>('http://localhost:8762/users/all', {observe: 'response'})
      .pipe(tap(resData => {
        console.log(resData);
        }
      ));
  }

  getCurrentUser() {
    const userobject = this.authService.user;
    if (userobject)  {
      const url = `http://localhost:8762/users/${userobject.value.sub}`;
      return this.http.get<User>(url, {observe: 'response'});
    }
  }


  getUserByUsername(username: string) {
    const url = `http://localhost:8762/users/${username}`;
    return this.http.get<User>(url, {observe: 'response'});
  }

  // TODO
  updateUser(user: User) {
    console.log(user);
    this.http.post('http://localhost:8762/users/update', user, {observe: 'response'})
      .subscribe((resData: HttpResponse<any>) => {
        console.log(resData.status);
    });
  }

}
