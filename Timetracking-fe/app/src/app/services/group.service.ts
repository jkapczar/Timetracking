import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Group} from '../model/group.model';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  constructor(private http: HttpClient,
              private authService: AuthService) {
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

  getGroupMembersByTeamLeader(username?: string) {
    if (!username) {
      username = `${this.authService.user.getValue().username}`;
    }
    const url = `http://localhost:8762/groups/members/${username}`;
    return this.http.get<{groupName: string, users: string[]}[]>(url, {observe: 'response'});
  }

  getGroups() {
    return this.http.get<string[]>('http://localhost:8762/groups/allGroups', {observe: 'response'});
  }

  getGroupsAndUsers() {
    return this.http.get<{groupName: string, users: string[]}[]>('http://localhost:8762/groups/allGroupsAndUsers', {observe: 'response'});
  }

  getAvailableGroupsForUser(username: string) {
    const url = `http://localhost:8762/groups/availableGroups/${username}`;
    return this.http.get<string[]>(url, {observe: 'response'});
  }

  getUsers() {
    return this.http.get<string[]>('http://localhost:8762/groups/allUsers', {observe: 'response'});
  }

  deleteGroup(groupName: string) {
    const url = `http://localhost:8762/groups/delete/${groupName}`;
    return this.http.delete(url, {observe: 'response'});
  }

}
