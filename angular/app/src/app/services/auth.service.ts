import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';
import {tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {User} from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient,
              private router: Router) {}

  token = new BehaviorSubject<string>(null);

  login(username: string, password: string) {
    return this.http.post('http://localhost:8762/auth/login',
      {
        username,
        password
      }, {observe: 'response'})
      .pipe(tap(resData => {
        this.token.next(resData.headers.get('Authorization'));
        localStorage.setItem('userToken', this.token.value);
      }));
  }
  // TODO create a button for logout
  logout() {
    this.token.next(null);
    this.router.navigate(['/login']);
    localStorage.removeItem('userToken');
  }

  autoLogin() {
    const token = localStorage.getItem('userToken');
    if (token) {
      this.token.next(token);
    }
  }

  registration(user: User) {
    this.http.post('http://localhost:8762/auth/registration', JSON.stringify(user)).subscribe(resData => {
      console.log(resData);
    });
  }


}
