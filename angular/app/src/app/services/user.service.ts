import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient,
              private router: Router) {}

  getAllUsers() {
    return this.http.post('http://localhost:8762/users/all', {observe: 'response'})
      .pipe(tap(resData => {
        console.log(resData);
        }
      ));
  }
}
