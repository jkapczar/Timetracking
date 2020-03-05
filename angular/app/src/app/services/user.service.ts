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

  getUser(username?: string) {
    if (!username) {
      username = `${this.authService.user.getValue().sub}`;
    }
    const url = `http://localhost:8762/users/${username}`;
    return this.http.get<User>(url, {observe: 'response'});
  }

  updateUser(user: User) {
    console.log(user);
    this.http.post('http://localhost:8762/users/update', user, {observe: 'response'})
      .subscribe((resData: HttpResponse<any>) => {
        console.log(resData.status);
    });
  }

  deleteUser(username: string) {
    const url = `http://localhost:8762/users/delete/${username}`;
    return this.http.delete(url, {observe: 'response'});
  }
}
