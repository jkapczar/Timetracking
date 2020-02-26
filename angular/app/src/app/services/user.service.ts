import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {tap} from 'rxjs/operators';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient,
              private router: Router,
              private authService: AuthService) {}

  getAllUsers() {
    return this.http.get('http://localhost:8762/users/all', {observe: 'response'})
      .pipe(tap(resData => {
        console.log(resData);
        }
      ));
  }

  getCurrentUser() {
    const user = this.authService.user;
    if (user)  {
      console.log('itt');
      console.log(user.value.sub);
      const url = `http://localhost:8762/users/${user.value.sub}`;
      return this.http.get(url,  {observe: 'response'});
    }
  }
  // TODO
  updateUser() {

  }

}
