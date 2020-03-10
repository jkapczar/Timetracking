import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  constructor(private http: HttpClient,
              private router: Router) {
  }

  getGroupsTest() {
    return this.http.get('http://localhost:8762/groups/all', {observe: 'response'});
  }
}
