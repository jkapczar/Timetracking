export interface CalendarUser {
  id: number;
  username: string;
  defaultNumOfHOs: number;
  defaultNumOfHolidays: number;
  numOfHOs: number;
  numOfHolidays: number;
}

export class CalendarEvent {
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  constructor(public id: number,
              public title: string,
              public groupId: string,
              public start: Date,
              public end: Date,
              public backgroundColor: string,
              public textColor: string,
              public allDay: boolean,
              public status: string,
              public user?: CalendarUser) {
    this.startHour = this.start.getHours();
    this.startMinute = this.start.getMinutes();
    if (this.end) {
      this.endHour = this.end.getHours();
      this.endMinute = this.end.getMinutes();
    }
  }

  public setDates() {
    this.start.setHours(this.startHour);
    this.start.setMinutes(this.startMinute);
    if (!this.endHour && !this.endMinute) {
      this.end = null;
    } else {
      this.end = new Date(this.start);
      this.end.setHours(this.endHour);
      this.end.setMinutes(this.endMinute);
    }
  }
}
