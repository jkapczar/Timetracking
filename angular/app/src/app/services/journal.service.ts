import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {tap} from 'rxjs/operators';
import {Journal} from '../model/journal.model';

@Injectable({
  providedIn: 'root'
})
export class JournalService {
  constructor(private http: HttpClient) {}

  getTest(data: {status: string, users: string[]}) {
    return this.http.post<Journal[]>('http://localhost:8762/calendar/getEventByStatus', data, {observe: 'response'});
  }

  updateEvent(data: {status: string, id: number}) {
    return this.http.post<Journal>('http://localhost:8762/calendar/updateEventStatus', data, {observe: 'response'});
  }
}
