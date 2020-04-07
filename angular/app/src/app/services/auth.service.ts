import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';
import {tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {User} from '../model/user.model';
import base64url from 'base64url';
import {Creds} from '../model/creds.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient,
              private router: Router) {}

  token = new BehaviorSubject<string>(null);
  user = new BehaviorSubject<{sub: string, authorities: string[], iat: number, exp: number}>(null);

  // TODO replace user with user Object
  login(username: string, password: string) {
    return this.http.post('http://localhost:8762/auth/login',
      {
        username,
        password
      }, {observe: 'response'})
      .pipe(tap(resData => {
        console.log(resData);
        this.token.next(resData.headers.get('Authorization'));
        const user = JSON.parse(base64url.decode(this.token.value.split('.')[1]));
        this.user.next(user);
        console.log(user);
        localStorage.setItem('userToken', this.token.value);
      }));
  }
  // TODO create a button for logout
  logout() {
    this.token.next(null);
    this.user.next(null);
    this.router.navigate(['/login']);
    localStorage.removeItem('userToken');
  }

  autoLogin() {
    const token = localStorage.getItem('userToken');
    if (token) {
      this.token.next(token);
      const user = JSON.parse(base64url.decode(this.token.value.split('.')[1]));
      this.user.next(user);
    }
  }

  registration(user: User) {
    this.http.post('http://localhost:8762/auth/registration', JSON.stringify(user), {observe: 'response'}).subscribe(resData => {
      console.log(resData);
    });
  }

  updateCredentials(creds: Creds) {
    this.http.post('http://localhost:8762/auth/update', JSON.stringify(creds)).subscribe(resData => {
      console.log(resData);
    });
  }

  updateStatus(username: string) {
    const url = `http://localhost:8762/auth/status/${username}`;
    return this.http.post<Creds>(url, '', {observe: 'response'});
  }

  updateAdmin(username: string) {
    const url = `http://localhost:8762/auth/admin/${username}`;
    return this.http.post<Creds>(url, '', {observe: 'response'});
  }

  getCredentials(username?: string) {
    if (!username) {
      username = `${this.user.getValue().sub}`;
    }
    console.log(username);
    const url = `http://localhost:8762/auth/${username}`;
    console.log(url);
    return this.http.get<Creds>(url, {observe: 'response'});
  }


}
