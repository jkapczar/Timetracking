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
      this.end.setHours(this.endHour);
      this.end.setMinutes(this.endMinute);
    }
  }
}
