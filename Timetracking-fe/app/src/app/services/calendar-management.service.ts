import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {CalendarUser} from '../model/event.model';

@Injectable({
  providedIn: 'root'
})
export class CalendarManagementService {
  calendarOwner = new Subject<CalendarUser>();
  selectedUser = new Subject<string>();
}
