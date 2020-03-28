import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CalendarEvent} from '../model/event.model';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  events: CalendarEvent[] = [
  new CalendarEvent('',
    'workTime',
    new Date('2020-03-21T01:00:00'),
    new Date('2020-03-21T12:00:00'),
    'yellow',
    'black',
    false),
  new CalendarEvent('Holiday',
    'holiday',
    new Date('2020-03-26T00:00:00'),
    new Date('2020-03-26T00:00:00'),
    'purple',
    'black',
    true),
  new CalendarEvent('',
    'workTime',
    new Date('2020-03-21T15:30:00'),
    new Date('2020-03-21T17:00:00'),
    'yellow',
    'black',
    false)
  ];

  constructor(private http: HttpClient) {}


  getEvents() {
    return this.events.slice();
  }

}
