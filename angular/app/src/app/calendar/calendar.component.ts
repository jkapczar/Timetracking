import {AfterViewInit, Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation} from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import {OptionsInput} from '@fullcalendar/core';
import {FullCalendarComponent} from '@fullcalendar/angular';
import {DateSelectionApi} from '@fullcalendar/core/Calendar';
import {MenuItem, TableBody} from 'primeng';
import {CalendarEvent} from '../model/event.model';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NgbModalWindow} from '@ng-bootstrap/ng-bootstrap/modal/modal-window';
import {CalendarService} from '../services/calendar.service';


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
    hour12: false
  };

  editing = false;
  multipleDaySelection = false;
  selectedDayEvents: CalendarEvent[] = [];
  modalHeader: string;
  activeModal: NgbActiveModal;
  validEventTime = true;
  activeSelection: DateSelectionApi;
  ngOnInit() {

    this.eventsModel = this.calendarService.getEvents();

    this.options = {
      editable: false,
      customButtons: {
        myCustomButton: {
          text: 'custom!',
          click() {
            alert('clicked the custom button!');
          }
        }
      },
      header: {
        left: 'prev dayGrid today myCustomButton',
        center: 'title',
        right: 'next'
      },
      plugins: [dayGridPlugin, interactionPlugin]
    };
  }

  onSelect(event: DateSelectionApi) {
    this.activeSelection = event;
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
  // TODO change date
  addNewCalendarEvent(type: string) {
    if (type === 'workTime') {
      this.selectedDayEvents = this.selectedDayEvents.filter(element => element.groupId === 'workTime');
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

  deleteCalendarEvent() {
    console.log('delete');
  }

  save() {
    console.log('save');

    console.log(this.activeSelection);
    console.log(this.eventsModel);
    console.log(this.selectedDayEvents);

    this.eventsModel = this.eventsModel.filter(element => !(
      (element.start.getTime() >= this.activeSelection.start.getTime()) &&
      (element.end.getTime() <= this.activeSelection.end.getTime())
    ));
    this.eventsModel = this.eventsModel.concat(this.selectedDayEvents);

    this.activeModal.close();
  }

  setHolidays() {
    this.clearEvents();
    const date = this.activeSelection.start;
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
