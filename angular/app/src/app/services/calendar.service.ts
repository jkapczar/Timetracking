import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CalendarEvent, CalendarUser} from '../model/event.model';
import {AuthService} from './auth.service';
import {User} from '../model/user.model';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {


  constructor(private http: HttpClient,
              private authService: AuthService) {}


  saveEvents(events: CalendarEvent[], username?: string) {
    if (!username) {
      username = `${this.authService.user.getValue().username}`;
    }
    const url = `http://zuul:8762/calendar/${username}/save`;
    return this.http.post<CalendarEvent[]>(url,
      events, {observe: 'response'}).pipe(map(res => {
        return this.createResponseObjects(res.body);
    }));
  }

  getEvents(start: string, end: string, username?: string) {
    if (!username) {
      username = `${this.authService.user.getValue().username}`;
    }
    const url = `http://zuul:8762/calendar/${username}/${start}/${end}`;
    return this.http.get<CalendarEvent[]>(url, {observe: 'response'})
      .pipe(map(res => {
        return this.createResponseObjects(res.body);
      }));
  }

  deleteEvents(events: CalendarEvent[]) {
    return this.http.post('http://zuul:8762/calendar/delete', events, {observe: 'response'});
  }


  getCalendarOwner(username?: string) {
    if (!username) {
      username = `${this.authService.user.getValue().username}`;
    }
    const url = `http://zuul:8762/calendar/${username}`;
    return this.http.get<CalendarUser>(url, {observe: 'response'});
  }

  updateCalendarOwner(owner: CalendarUser) {
    return this.http.post<CalendarUser>('http://zuul:8762/calendar/updateOwner', owner, {observe: 'response'});
  }

  private createResponseObjects(data: CalendarEvent[]) {
    const tmp: CalendarEvent[] = [];
    for (const e of data) {
      tmp.push(new CalendarEvent(e.id, e.title, e.groupId , new Date(e.start), (e.end ? new Date(e.end) : null),
        e.backgroundColor, 'white', e.allDay, e.status, e.user));
    }
    return tmp;
  }

}
