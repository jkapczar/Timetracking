import {CalendarEvent} from './event.model';


export class Journal {
  constructor(public id: number,
              public groupName: string,
              public eventOwner: string,
              public events: CalendarEvent[],
              public status: string,
              public updatedBy: string,
              public createdOn: Date,
              public updatedOn: Date) {
    if (events.length > 0) {
      this.type = events[0].groupId;
      for (const e of events) {
        e.start = new Date(e.start);
        this.dates.push((e.start.getFullYear() + '.' + (e.start.getMonth() + 1) + '.' + e.start.getDate() + '.'));
      }
    }

  }

  type: string;
  dates: string[] = [];
  created: string;
  updated: string;


}
