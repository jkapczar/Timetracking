import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  constructor(private http: HttpClient) {
  }

  createGroup(groupName: string, teamLeader: string) {
    return this.http.post(
      'http://localhost:8762/groups/create',
      {groupName, teamLeader},
      {observe: 'response'}
      );
  }

  getGroups() {
    return this.http.get<string[]>('http://localhost:8762/groups/allGroups', {observe: 'response'});
  }

  getUsers() {
    return this.http.get<string[]>('http://localhost:8762/groups/allUsers', {observe: 'response'});
  }

  deleteGroup() {
    return this.http.post('http://localhost:8762/groups/delete', '', {observe: 'response'});
  }

}
