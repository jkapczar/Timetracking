export class CalendarEvent {
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  constructor(public title: string,
              public groupId: string,
              public start: Date,
              public end: Date,
              public backgroundColor: string,
              public textColor: string,
              public allDay: boolean) {
    this.startHour = this.start.getHours();
    this.startMinute = this.start.getMinutes();
    this.endHour = this.end.getHours();
    this.endMinute = this.end.getMinutes();
  }
}
