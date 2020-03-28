import {AfterViewInit, Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation} from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import {OptionsInput} from '@fullcalendar/core';
import {FullCalendarComponent} from '@fullcalendar/angular';
import {DateSelectionApi} from '@fullcalendar/core/Calendar';
import {MenuItem, TableBody} from 'primeng';
import {CalendarEvent} from '../model/event.model';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NgbModalWindow} from '@ng-bootstrap/ng-bootstrap/modal/modal-window';
import {CalendarService} from '../services/calendar.service';
import {not} from 'rxjs/internal-compatibility';
import {$} from 'protractor';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  @ViewChild('fullcalendar', { static: false }) fullcalendar: FullCalendarComponent;
  @ViewChild('content', { static: false }) modalWindow;
  constructor(private modalService: NgbModal,
              private calendarService: CalendarService) { }

  options: OptionsInput;
  eventsModel: CalendarEvent[] = [];
  timeFormat = {
    hour: '2-digit',
    minute: '2-digit',
    meridiem: false,
    hour12: false,
  };


  editing = false;
  multipleDaySelection = false;
  selectedDayEvents: CalendarEvent[] = [];
  modalHeader: string;
  activeModal: NgbActiveModal;
  validEventTime = true;
  activeSelection: DateSelectionApi;

  checkedIn = false;

  ngOnInit() {

    this.eventsModel = this.calendarService.getEvents();

    this.options = {
      editable: false,
      themeSystem: 'bootstrap',
      customButtons: {
        checkInOutButton: {
          text: 'Check In',
          click: () => this.checkInOut()
        }
      },
      header: {
        left: 'prev checkInOutButton',
        center: 'title',
        right: 'next'
      },
      plugins: [dayGridPlugin, interactionPlugin, bootstrapPlugin]
    };
  }

  onSelect(event: DateSelectionApi) {
    console.log(event);
    this.activeSelection = event;
    console.log('active selection: ', this.activeSelection);
    this.dayOffset();
    this.selectedDayEvents = [];
    if (Math.abs(this.activeSelection.end.getDate() - this.activeSelection.start.getDate()) === 0) {
      this.setModalHeader(this.activeSelection.start);
      this.multipleDaySelection = false;
      this.selectedDayEvents = this.getEventsOnDate(this.activeSelection.start);
    } else {
      console.log('m');
      this.setModalHeader(this.activeSelection.start, this.activeSelection.end);
      this.selectedDayEvents = this.getEventsOnDate(this.activeSelection.start, this.activeSelection.end);
      this.multipleDaySelection = true;
    }
    console.log(this.selectedDayEvents);
    this.activeModal = this.modalService.open(this.modalWindow);
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
        && element.end.getDate() <= endDate.getDate()
        && element.start.getMonth() >= startDate.getMonth()
        && element.end.getMonth() <= endDate.getMonth()
        && element.start.getFullYear() >= startDate.getFullYear()
        && element.end.getFullYear() <= endDate.getFullYear()));
  }

  setModalHeader(start: Date, end?: Date) {
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

  pad(num: number) {
    if (num < 10 && num != null) {
      return ('0' + String(num));
    }
    return num;
  }

  // TODO ora perc range
  // TODO full time jon be de eggyik event endje nullos
  checkEventTimeValidity(event: CalendarEvent) {
    // TODO
    // HA csak az ora vagy csak a perc van kitoltve

    if (event.startHour != null && event.startMinute == null || event.startHour == null && event.startMinute != null) {
      console.log('1');
      return false;
    }

    if (event.endHour != null && event.endMinute == null || event.endHour == null && event.endMinute != null) {
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

      if ((event.start < e.start || event.start < e.end) || (event.end == null && e.end == null)) {
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
      const newEvent = new CalendarEvent('',
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
      this.selectedDayEvents.push(new CalendarEvent('Holiday',
        'holiday',
        new Date(this.activeSelection.start.getTime()),
        new Date(this.activeSelection.end.getTime()),
        'purple',
        'black',
        true));
    }
  }

  deleteCalendarEvent(index: number) {
    this.selectedDayEvents.splice(index, 1);
  }

  save() {
    console.log('save');

    this.eventsModel = this.eventsModel.filter(element =>  !(
      (element.start.getTime() >= this.activeSelection.start.getTime()) &&
      (element.end.getTime() <= this.activeSelection.end.getTime())
    ));

    this.eventsModel = this.eventsModel.concat(this.selectedDayEvents);
    this.activeModal.close();
  }

  checkInOut() {
    if (!this.checkedIn) {
      // TODO Check time ranges hova menthetek
      const newEvent = new CalendarEvent('',
        'workTime',
        new Date(),
        null,
        'yellow',
        'black',
        false);
      if (this.checkEventTimeValidity(newEvent)) {
        console.log('valid');
        this.eventsModel = this.eventsModel.concat(newEvent);
        console.log(this.eventsModel);
      } else {
        console.log('invalid');
      }
    } else {
      console.log('check out');
      const today = new Date();
      const calendarEvent = this.getLastUnFinishedEnvent();
      calendarEvent.end = today;
      const index = this.eventsModel.findIndex(element =>
        element.start.getFullYear() === today.getFullYear() &&
        element.start.getMonth() === today.getMonth() &&
        element.start.getDate() === today.getDate() &&
        element.end === null);
      this.eventsModel.splice(index, 1);
      this.eventsModel = this.eventsModel.concat(calendarEvent);
      console.log(this.eventsModel);
    }
    this.checkedIn = !this.checkedIn;
  }

  getLastUnFinishedEnvent() {
    const today = new Date();
    return this.eventsModel.find(element =>
      element.start.getFullYear() === today.getFullYear() &&
      element.start.getMonth() === today.getMonth() &&
      element.start.getDate() === today.getDate() &&
      element.end === null);
  }

  setHolidays() {
    this.clearEvents();
    const date = new Date(this.activeSelection.start);
    const endDate = this.activeSelection.end;

    while (date.getTime() <= endDate.getTime()) {
      this.selectedDayEvents.push(new CalendarEvent('Holiday',
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

  private dayOffset() {
    this.activeSelection.end.setDate(this.activeSelection.end.getDate() - 1);
    this.activeSelection.end.setHours(23);
    this.activeSelection.end.setMinutes(59);
    this.activeSelection.end.setSeconds(59);
  }

}
