import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {tap} from 'rxjs/operators';
import {AuthService} from './auth.service';
import {User} from '../model/user.model';
import {MessageService} from 'primeng';
import {Message} from '../model/message.model';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient,
              private authService: AuthService,
              private messagingService: MessageService) {}

  getAllUsers() {
    return this.http.get<string[]>('http://localhost:8762/users/all', {observe: 'response'});
  }

  getUser(username?: string) {
    if (!username) {
      username = `${this.authService.user.getValue().username}`;
    }
    const url = `http://localhost:8762/users/${username}`;
    return this.http.get<User>(url, {observe: 'response'});
  }

  updateUser(user: User) {
    this.http.post('http://localhost:8762/users/update', user, {observe: 'response'}).subscribe(resData => {
      this.messagingService.add(new Message(
        'success',
        'Update was successful!',
        ''));
      }, error => {
      this.messagingService.add(new Message(
        'error',
        'Update failed!',
        error.message));
    });
  }

  deleteUser(username: string) {
    const url = `http://localhost:8762/users/delete/${username}`;
    return this.http.delete(url, {observe: 'response'});
  }
}
