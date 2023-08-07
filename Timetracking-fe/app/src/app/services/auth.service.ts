import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';
import {tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {User} from '../model/user.model';
import base64url from 'base64url';
import {Creds} from '../model/creds.model';
import {AuthUser} from '../model/authUser.model';
import {MessageService} from 'primeng';
import {Message} from '../model/message.model';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient,
              private router: Router,
              private messagingService: MessageService) {}

  user = new BehaviorSubject<AuthUser>(null);
  userTemplate: {sub: string, authorities: string[], iat: number, exp: number} = null;

  // TODO replace user with user Object
  login(username: string, password: string) {
    return this.http.post('http://localhost:8762/auth/login',
      {
        username,
        password
      }, {observe: 'response'})
      .pipe(tap(resData => {
        console.log(resData);
        const token = resData.headers.get('Authorization');
        this.getAuthUser(token);
        localStorage.setItem('userToken', token);
      }));
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/login']);
    localStorage.removeItem('userToken');
  }

  autoLogin() {
    const token = localStorage.getItem('userToken');
    if (token) {
     this.getAuthUser(token);
    }
  }

  registration(user: User) {
    this.http.post('http://localhost:8762/auth/registration', JSON.stringify(user), {observe: 'response'}).subscribe(resData => {
      console.log(resData);
      this.messagingService.add(new Message(
        'success',
        'Registration was successful!',
        ''));
      this.router.navigate(['/login']);
    }, (error: HttpErrorResponse) => {
      this.messagingService.add(new Message(
        'error',
        'Registration failed!',
        error.message));
    });
  }

  updateCredentials(creds: Creds) {
    this.http.post('http://localhost:8762/auth/update', JSON.stringify(creds)).subscribe(resData => {
      this.messagingService.add(new Message(
        'success',
        'Update was successful!',
        ''));
    }, (error: HttpErrorResponse) => {
      this.messagingService.add(new Message(
        'error',
        'Update failed!',
        error.message));
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

  resetPasswordRequest(pwreset: {username: string, email: string}) {
    this.http.post('http://localhost:8762/auth/resetpasswordrequest', JSON.stringify(pwreset)).subscribe(resData => {
      this.messagingService.add(new Message(
        'success',
        'Email has been sent!',
        ''));
    }, error => {
      this.messagingService.add(new Message(
        'error',
        'Unknown error happened!',
        ''));
    });
  }

  resetPassword(password: string, token: string) {
    const url = `http://localhost:8762/auth/resetpassword?token=${token}`;
    this.http.post(url, JSON.stringify({password})).subscribe(resData => {
      this.messagingService.add(new Message(
        'success',
        'Password reset was successful!',
        ''));
    }, error => {
      this.messagingService.add(new Message(
        'error',
        'Unknown error happened!',
        ''));
    });
  }

  getCredentials(username?: string) {
    if (!username) {
      username = `${this.user.getValue().username}`;
    }
    const url = `http://localhost:8762/auth/${username}`;
    return this.http.get<Creds>(url, {observe: 'response'});
  }

  getAuthUser(token: string) {
    this.userTemplate = JSON.parse(atob(token.split('.')[1]));
    const authUser = new AuthUser(
      this.userTemplate.sub,
      this.userTemplate.authorities,
      this.userTemplate.iat,
      this.userTemplate.exp,
      token);
    this.user.next(authUser);
  }


}
