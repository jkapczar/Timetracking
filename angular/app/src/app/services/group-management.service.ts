import {EventEmitter, Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupManagementService {
  groups = new Subject<any[]>();
  teamLeaders = new Subject<any[]>();
  resetEvent = new EventEmitter<any>();
}
