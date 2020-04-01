import {AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import {OptionsInput} from '@fullcalendar/core';
import {FullCalendarComponent} from '@fullcalendar/angular';
import {DateSelectionApi} from '@fullcalendar/core/Calendar';
import {CalendarEvent, CalendarUser} from '../model/event.model';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CalendarService} from '../services/calendar.service';
import {NgForm} from '@angular/forms';
import {GroupService} from '../services/group.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit, AfterViewInit {
  constructor(private modalService: NgbModal,
              private calendarService: CalendarService,
              private groupService: GroupService) { }

  @ViewChild('fullcalendar', { static: false }) fullcalendar: FullCalendarComponent;
  @ViewChild('modalWindow', { static: false }) modalWindow;
  @ViewChild('userSelectionForm', { static: false }) userSelectionForm;
  @ViewChild('userDetailsForm', { static: false }) userDetailsForm;

  options: OptionsInput;
  eventsModel: CalendarEvent[] = [];


  editing = false;
  multipleDaySelection = false;
  selectedDayEvents: CalendarEvent[] = [];
  modalHeader: string;
  calendarHeader = '';
  activeModal: NgbActiveModal;
  validEventTime = true;
  activeSelection: DateSelectionApi;

  checkedIn = false;


  users: {label: string, value: string}[] = [];
  selectedUser: string;
  calendarOwner: CalendarUser;


  timeFormat = (date: Date) => {
    return  this.getTime(date);
  }

  // TODO set selected user with auth
  ngOnInit() {
    this.eventsModel = [];
    this.setHeaderDate();
    this.getCalendarOwner().then(r => (this.setUserData(r.body), this.fetchUsers(r.body.username)));
    this.options = {
      header: false,
      plugins: [dayGridPlugin, interactionPlugin, bootstrapPlugin]
    };
  }

  ngAfterViewInit(): void {
    this.fetchEvents();
  }

  onSelect(event: DateSelectionApi) {
    this.activeSelection = event;
    this.setDayOffset();
    this.selectedDayEvents = [];
    this.selectedDayEvents = this.getEventsOnDate(this.activeSelection.start, this.activeSelection.end);
    if (Math.abs(this.activeSelection.end.getDate() - this.activeSelection.start.getDate()) === 0) {
      this.setModalHeader(this.activeSelection.start);
      this.multipleDaySelection = false;
    } else {
      this.setModalHeader(this.activeSelection.start, this.activeSelection.end);
      this.multipleDaySelection = true;
    }
    this.activeModal = this.modalService.open(this.modalWindow);
  }

  userSelection() {
    if (this.selectedUser) {
      this.getCalendarOwner(this.selectedUser).then(r => this.setUserData(r.body));
      this.fetchEvents(this.selectedUser);
    }
  }

  userDetailsUpdate(form: NgForm) {
    console.log(form);
    this.calendarOwner.defaultNumOfHolidays = form.form.value.defNumOfHolidays;
    this.calendarOwner.defaultNumOfHOs = form.form.value.defNumOfHomeOffice;
    this.calendarService.updateCalendarOwner(this.calendarOwner).subscribe(resData => {
      this.calendarOwner = resData.body;
    });
  }

  checkInOut() {
    const tmp: CalendarEvent[] = [];
    if (!this.checkedIn) {
      // TODO Check time ranges hova menthetek
      const newEvent = new CalendarEvent(null,
        '',
        'workTime',
        new Date(),
        null,
        'yellow',
        'black',
        false);
      if (this.checkEventTimeValidity(newEvent)) {
        tmp.push(newEvent);
        this.calendarService.saveEvents(tmp, this.selectedUser).subscribe(resData => {
          this.eventsModel = this.eventsModel.concat(resData);
        });
      } else {
      }
    } else {
      const today = new Date();
      const calendarEvent = this.getLastUnFinishedEvent();
      console.log('getLastUnFinishedEvent', calendarEvent);
      calendarEvent.end = today;
      this.eventsModel = this.eventsModel.filter(element => element.id !== calendarEvent.id);
      console.log(this.eventsModel);
      tmp.push(calendarEvent);
      this.calendarService.saveEvents(tmp, this.selectedUser).subscribe(resData => {
        this.eventsModel = this.eventsModel.concat(resData);
      });
    }
    console.log('Checkout', this.eventsModel);
    this.checkedIn = !this.checkedIn;
  }

  getNextMonth() {
    console.log('next');
    this.fullcalendar.getApi().next();
    this.fetchEvents(this.selectedUser);
    this.setHeaderDate(this.fullcalendar.getApi().view.currentStart);
  }

  getPreviousMonth() {
    console.log('prev');
    this.fullcalendar.getApi().prev();
    this.fetchEvents(this.selectedUser);
    this.setHeaderDate(this.fullcalendar.getApi().view.currentStart);
  }

  onRowEditInit(data: any) {
    console.log(data);
  }

  onRowEditSave(data: CalendarEvent) {
    this.validEventTime = this.checkEventTimeValidity(data);
    console.log(data);
  }

  // TODO load original
  onRowEditCancel(data: any, index: number) {
    console.log(data, index);
  }

  addNewCalendarEvent(type: string) {
    if (type === 'workTime') {
      this.selectedDayEvents = this.selectedDayEvents.filter(element => element.groupId === 'workTime');
      console.log(new Date(this.activeSelection.start.getTime()));
      console.log(new Date(this.activeSelection.end.getTime()));
      const newEvent = new CalendarEvent(null,
        '',
        'workTime',
        new Date(this.activeSelection.start.getTime()),
        new Date(this.activeSelection.end.getTime()),
        'yellow',
        'black',
        false);
      this.selectedDayEvents.push(newEvent);
      this.validEventTime = this.checkEventTimeValidity(newEvent);
    } else {
      this.selectedDayEvents = [];
      this.selectedDayEvents.push(new CalendarEvent(null,
        'Holiday',
        'holiday',
        new Date(this.activeSelection.start.getTime()),
        new Date(this.activeSelection.start.getTime()),
        'purple',
        'black',
        true));
    }
  }

  deleteCalendarEvent(index: number) {
    this.selectedDayEvents.splice(index, 1);
  }

  async save() {

    let tmp = this.getEventsOnDate(this.activeSelection.start, this.activeSelection.end);

    this.eventsModel = this.eventsModel.filter(element =>  !(
      (element.start.getTime() >= this.activeSelection.start.getTime()) &&
      (element.start.getTime() <= this.activeSelection.end.getTime())
    ));

    tmp = tmp.filter(element => (element.id != null && this.selectedDayEvents.indexOf(element) === -1));

    await this.calendarService.deleteEvents(tmp).subscribe(resData => {
      console.log(resData);
    });
    console.log(this.selectedUser);
    await this.calendarService.saveEvents(this.selectedDayEvents, this.selectedUser).subscribe(resData => {
      console.log(resData);
      this.eventsModel = this.eventsModel.concat(resData);
      console.log('events after save ', this.eventsModel);
    });
    this.activeModal.close();
  }

  setHolidays() {
    this.clearEvents();
    const date = new Date(this.activeSelection.start);
    const endDate = this.activeSelection.end;

    while (date.getTime() <= endDate.getTime()) {
      this.selectedDayEvents.push(new CalendarEvent(null,
        'Holiday',
        'holiday',
        new Date(date.getTime()),
        new Date(date.getTime()),
        'purple',
        'black',
        true));
      date.setDate(date.getDate() + 1);
    }

  }

  clearEvents() {
    const startDate = this.activeSelection.start;
    const endDate = this.activeSelection.end;
    this.selectedDayEvents = this.selectedDayEvents.filter(element =>
      !((element.start.getTime() >= startDate.getTime()) && (element.start.getTime() <= endDate.getTime())));
  }

  pad(num: number) {
    if (num < 10 && num != null) {
      return ('0' + String(num));
    }
    return num;
  }

  private setHeaderDate(date?: Date) {
    if (!date) {
      date = new Date();
    }
    this.calendarHeader = date.getFullYear() + ' ' + date.toLocaleString('default', { month: 'long' });
  }

  private getLastUnFinishedEvent() {
    const today = new Date();
    return this.eventsModel.find(element =>
      element.end === null &&
      element.start.getFullYear() === today.getFullYear() &&
      element.start.getMonth() === today.getMonth() &&
      element.start.getDate() === today.getDate());
  }

  private getEventsOnDate(startDate: Date, endDate?: Date) {
    console.log(startDate, endDate);
    if (!endDate) {
      return this.eventsModel.filter(
        element => (element.start.getDate() === startDate.getDate()
          && element.start.getMonth() === startDate.getMonth()
          && element.start.getFullYear() === startDate.getFullYear()));
    }
    return this.eventsModel.filter(
      element => (element.start.getDate() >= startDate.getDate()
        && element.start.getMonth() >= startDate.getMonth()
        && element.start.getFullYear() >= startDate.getFullYear()
        && element.start.getFullYear() <= endDate.getFullYear()
        && element.start.getMonth() <= endDate.getMonth()
        && element.start.getDate() <= endDate.getDate()));
  }

  private async getCalendarOwner(username?: string) {
    return await this.calendarService.getCalendarOwner(username).toPromise();
  }

  private setUserData(user: CalendarUser) {
      this.calendarOwner = user;
      this.userDetailsForm.form.setValue({
        defNumOfHolidays: this.calendarOwner.defaultNumOfHolidays,
        defNumOfHomeOffice: this.calendarOwner.defaultNumOfHOs
      });
  }

  private getDate(date: Date) {
    return date.getFullYear() + '-' + this.pad((date.getMonth() + 1)) + '-' + this.pad(date.getDate());
  }

  private getTime(date) {
    return this.pad(date.start.hour) + ':' + this.pad(date.start.minute) + ' - ' +
      (date.end ? (this.pad(date.end.hour) + ':' + this.pad(date.end.minute)) : '');
  }

  private fetchEvents(username?: string) {
    this.calendarService.getEvents(
      this.getDate(this.fullcalendar.getApi().view.activeStart),
      this.getDate(this.fullcalendar.getApi().view.activeEnd),
      username).subscribe(resData => {
        this.eventsModel = resData;
        console.log(this.eventsModel);
        this.setCheckInStatus();
    });
  }

  private fetchUsers(username?: string) {
      this.groupService.getGroupByTeamLeader(username).subscribe(resData => {
        if (resData.body) {
          for (const e of resData.body) {
            this.users.push({label: e, value: e});
          }
          this.userSelectionForm.form.patchValue(
            {calendarUser: this.users}
          );
        }
        this.selectedUser = this.calendarOwner.username;
      });
  }

  private setDayOffset() {
    this.activeSelection.end.setDate(this.activeSelection.end.getDate() - 1);
    this.activeSelection.end.setHours(23);
    this.activeSelection.end.setMinutes(59);
    this.activeSelection.end.setSeconds(59);
  }

  private setCheckInStatus() {
    this.checkedIn = (this.getLastUnFinishedEvent() != null);
  }

  private setModalHeader(start: Date, end?: Date) {
    if (!end) {
      this.modalHeader = (String(start.getFullYear()) + '.' +
        String(this.pad(start.getMonth() + 1))  + '.' +
        String(this.pad(start.getDate())) + '.');
    } else {
      this.modalHeader = (String(start.getFullYear()) + '.' +
        String(this.pad(start.getMonth() + 1))  + '.' +
        String(this.pad(start.getDate())) + '. - ' +
        String(end.getFullYear()) + '.' +
        String(end.getMonth() + 1)  + '.' +
        String(this.pad((end.getDate()))) + '.');
    }
  }

  // TODO ora perc range
  // TODO full time jon be de eggyik event endje nullos
  checkEventTimeValidity(event: CalendarEvent) {
    // TODO
    // HA csak az ora vagy csak a perc van kitoltve

    if ((event.startHour != null && event.startMinute == null) ||
      (event.startHour == null && event.startMinute != null)) {
      console.log('1');
      return false;
    }

    if ((event.endHour != null && event.endMinute == null) ||
      (event.endHour == null && event.endMinute != null)) {
      console.log('2');
      return false;
    }

    event.setDates();

    if (!event.start) {
      console.log('3');
      return false;
    }

    for (const e of this.selectedDayEvents) {
      if (e === event) {
        continue;
      }

      if (((event.start < e.start || event.start < e.end) && event.end == null)
        || (event.end == null && e.end == null)) {
        console.log('4');
        return false;
      }

      if (event.end == null) {
        continue;
      }

      if (event.start > event.end) {
        console.log('5');
        return false;
      }

      if (
        (
          (event.start.getTime() > e.start.getTime() && event.start.getTime() < e.end.getTime())
          || (event.end.getTime() < e.end.getTime() && event.end.getTime() > e.start.getTime())
        )
        ||
        (
          (e.start.getTime() > event.start.getTime() && e.end.getTime() < event.end.getTime())
          || (e.start.getTime() < event.start.getTime() && e.end.getTime() > event.end.getTime())
        )
      ) {
        console.log('6');
        return false;
      }
    }
    return true;
  }
}
