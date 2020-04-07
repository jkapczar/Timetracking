import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {User} from '../model/user.model';
import {Creds} from '../model/creds.model';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  selectedUser = new Subject<string>();
  credentials = new Subject<Creds>();
}
