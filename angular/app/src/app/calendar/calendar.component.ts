import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import {OptionsInput} from '@fullcalendar/core';
import {FullCalendarComponent} from '@fullcalendar/angular';
import {DateSelectionApi} from '@fullcalendar/core/Calendar';
import {CalendarEvent, CalendarUser} from '../model/event.model';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CalendarService} from '../services/calendar.service';
import {AuthService} from '../services/auth.service';
import {CalendarManagementService} from '../services/calendar-management.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(private modalService: NgbModal,
              private calendarService: CalendarService,
              private calendarManagementService: CalendarManagementService,
              private authService: AuthService) { }

  @ViewChild('fullcalendar', { static: false }) fullcalendar: FullCalendarComponent;
  @ViewChild('modalWindow', { static: false }) modalWindow;

  options: OptionsInput;
  eventsModel: CalendarEvent[] = [];


  multipleDaySelection = false;
  selectedDayEvents: CalendarEvent[] = [];
  modalHeader: string;
  calendarHeader = '';
  activeModal: NgbActiveModal;
  validEventTime = true;
  activeSelection: DateSelectionApi;
  checkedIn = false;

  isHOAllowed = true;
  isHolidayAllowed = true;

  selectedUser: string;
  selectedUserSubscription: Subscription;
  calendarOwner: CalendarUser;
  calendarOwnerSubscription: Subscription;
  calendarProps = {holiday: 0, ho: 0};

  isAdmin = false;


  timeFormat = (date: Date) => {
    return  this.getTime(date);
  }

  ngOnInit() {
    this.isAdmin = (this.authService.user.getValue().roles.includes('ADMIN')
      || this.authService.user.getValue().roles.includes('GROUPOWNER'));
    this.calendarOwnerSubscription = this.calendarManagementService.calendarOwner.subscribe(calendarOwner => {
      this.calendarOwner = calendarOwner;
      this.setCalendarOwnerProps();
    });
    this.selectedUserSubscription = this.calendarManagementService.selectedUser.subscribe(selectedUser => {
      this.selectedUser = selectedUser;
      this.fetchEvents(this.selectedUser);
    });
    this.eventsModel = [];
    this.setHeaderDate();
    this.options = {
      header: false,
      plugins: [dayGridPlugin, interactionPlugin, bootstrapPlugin]
    };
  }

  ngAfterViewInit(): void {
    this.fetchEvents();
  }

  ngOnDestroy(): void {
    this.calendarOwnerSubscription.unsubscribe();
    this.selectedUserSubscription.unsubscribe();
  }

  onDateSelect(event: DateSelectionApi) {
    this.activeSelection = event;
    this.setDayOffset();
    this.setCalendarOwnerProps();
    this.selectedDayEvents = [];
    this.selectedDayEvents = this.getEventsOnDate(this.activeSelection.start, this.activeSelection.end);
    console.log(this.selectedDayEvents);
    const days = this.getDayDifference(this.activeSelection.start, this.activeSelection.end);
    if (days === 1) {
      this.setModalHeader(this.activeSelection.start);
      this.multipleDaySelection = false;
      this.manageHOAndHolidayRequests();
    } else {
      this.setModalHeader(this.activeSelection.start, this.activeSelection.end);
      this.multipleDaySelection = true;
      this.manageHOAndHolidayRequests();
    }
    this.activeModal = this.modalService.open(this.modalWindow);
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
    } else if (type === 'holiday') {
      this.manageHOAndHolidayRequests('holiday');
      if (this.multipleDaySelection) {
        this.setEvents('Holiday', 'holiday', 'purple');
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
    } else {
      this.manageHOAndHolidayRequests('homeOffice');
      if (this.multipleDaySelection) {
        this.setEvents('HomeOffice', 'homeOffice', 'blue');
      } else {
        this.selectedDayEvents = [];
        this.selectedDayEvents.push(new CalendarEvent(null,
          'HomeOffice',
          'homeOffice',
          new Date(this.activeSelection.start.getTime()),
          new Date(this.activeSelection.start.getTime()),
          'blue',
          'black',
          true));
      }
    }
  }

  deleteCalendarEvent(index: number) {
    this.selectedDayEvents.splice(index, 1);
  }

  async save() {

    this.reSetCalendarOwnerProps();
    await this.calendarService.updateCalendarOwner(this.calendarOwner).subscribe(resData => {
      this.calendarManagementService.calendarOwner.next(resData.body);
    });


    let tmp = this.getEventsOnDate(this.activeSelection.start, this.activeSelection.end);

    this.eventsModel = this.eventsModel.filter(element =>  !(
      (element.start.getTime() >= this.activeSelection.start.getTime()) &&
      (element.start.getTime() <= this.activeSelection.end.getTime())
    ));

    tmp = tmp.filter(element => (element.id != null && this.selectedDayEvents.indexOf(element) === -1));

    console.log('delete', tmp);

    await this.calendarService.deleteEvents(tmp).subscribe(resData => {
      console.log(resData);
    });
    await this.calendarService.saveEvents(this.selectedDayEvents, this.selectedUser).subscribe(resData => {
      console.log(resData);
      this.eventsModel = this.eventsModel.concat(resData);
    });
    this.activeModal.close();
  }

  clearEvents() {
    const startDate = this.activeSelection.start;
    const endDate = this.activeSelection.end;

    for (const calEvent of this.selectedDayEvents) {
      if (calEvent.groupId === 'holiday') {
        this.calendarProps.holiday -= 1;
      } else if (calEvent.groupId === 'homeOffice') {
        this.calendarProps.ho -= 1;
      }
    }

    console.log(this.selectedDayEvents);
    this.selectedDayEvents = this.selectedDayEvents.filter(element =>
      !((element.start.getTime() >= startDate.getTime()) && (element.start.getTime() <= endDate.getTime())));
    console.log(this.selectedDayEvents);
  }

  pad(num: number) {
    if (num < 10 && num != null) {
      return ('0' + String(num));
    }
    return num;
  }

  private setCalendarOwnerProps() {
    this.calendarProps.holiday = this.calendarOwner.numOfHolidays;
    this.calendarProps.ho = this.calendarOwner.numOfHOs;
  }

  private reSetCalendarOwnerProps() {
    this.calendarOwner.numOfHolidays = this.calendarProps.holiday;
    this.calendarOwner.numOfHOs = this.calendarProps.ho;
  }

  private setEvents(title: string, groupId: string, color: string) {
    this.clearEvents();
    const date = new Date(this.activeSelection.start);
    const endDate = this.activeSelection.end;

    while (date.getTime() <= endDate.getTime()) {
      this.selectedDayEvents.push(new CalendarEvent(null,
        title,
        groupId,
        new Date(date.getTime()),
        new Date(date.getTime()),
        color,
        'black',
        true));
      date.setDate(date.getDate() + 1);
    }
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
    console.log(this.eventsModel);
    return this.eventsModel.filter(
      element => (element.start.getTime() >= startDate.getTime() && element.start.getTime() <= endDate.getTime()));
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

  private manageHOAndHolidayRequests(type?: string) {
    console.log(this.calendarOwner);
    const days = this.getDayDifference(this.activeSelection.start, this.activeSelection.end);
    console.log(days);
    if (type) {
      if (type === 'holiday') {
        this.calendarProps.holiday = this.calendarProps.holiday + days;
      } else {
        this.calendarProps.ho = this.calendarProps.ho + days;
      }
    }
    if (days > (this.calendarOwner.defaultNumOfHolidays - this.calendarProps.holiday)) {
      this.isHolidayAllowed = true;
    } else {
      this.isHolidayAllowed = false;
    }
    if (days > (this.calendarOwner.defaultNumOfHOs - this.calendarProps.ho)) {
      this.isHOAllowed = true;
    } else {
      this.isHOAllowed = false;
    }
    console.log(this.isHOAllowed, this.isHolidayAllowed);
  }

  private getDayDifference(start: Date, end: Date) {
    return Math.ceil((Math.abs(start.getTime() - end.getTime())) / (1000 * 3600 * 24));
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
