import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {tap} from 'rxjs/operators';
import {Group} from '../model/group.model';

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

  getUnassignedUsers() {
    return this.http.get<string[]>('http://localhost:8762/groups/allUnassignedUsers', {observe: 'response'});
  }

  getGroup(groupName: string) {
    const url = `http://localhost:8762/groups/get/${groupName}`;
    return this.http.get<Group>(url, {observe: 'response'});
  }

  updateGroup(group: Group) {
    return this.http.post('http://localhost:8762/groups/update', group, {observe: 'response'});
  }

  getAvailableTeamLeaders() {
    return this.http.get<string[]>('http://localhost:8762/groups/availableTeamLeaders', {observe: 'response'});
  }

  getTeamLeaders() {
    return this.http.get<string[]>('http://localhost:8762/groups/teamLeaders', {observe: 'response'});
  }

  getGroups() {
    return this.http.get<string[]>('http://localhost:8762/groups/allGroups', {observe: 'response'});
  }

  getUsers() {
    return this.http.get<string[]>('http://localhost:8762/groups/allUsers', {observe: 'response'});
  }

  deleteGroup(groupName: string) {
    const url = `http://localhost:8762/groups/delete/${groupName}`;
    return this.http.delete(url, {observe: 'response'});
  }

}
