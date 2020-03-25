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


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  @ViewChild('fullcalendar', { static: false }) fullcalendar: FullCalendarComponent;
  @ViewChild('content', { static: false }) modalWindow;
  constructor(private modalService: NgbModal) { }

  options: OptionsInput;
  eventsModel: CalendarEvent[] = [];
  timeFormat = {
    hour: '2-digit',
    minute: '2-digit',
    meridiem: false,
    hour12: false
  };

  items: MenuItem[] = [];

  editing = false;
  multipleDaySelection = false;
  selectedDayEvents: CalendarEvent[] = [];
  modalHeader: string;
  activeModal: NgbActiveModal;
  ngOnInit() {
    const a = new CalendarEvent('',
      'workTime',
      new Date('2020-03-21T08:30:00'),
      new Date('2020-03-21T12:40:00'),
      'yellow',
      'black',
      false);
    const b = new CalendarEvent('Holiday',
      'holiday',
      new Date('2020-03-26T00:00:00'),
      new Date('2020-03-26T00:00:00'),
      'purple',
      'black',
      true);
    const c = new CalendarEvent('',
      'workTime',
      new Date('2020-03-21T15:30:00'),
      new Date('2020-03-21T17:00:00'),
      'yellow',
      'black',
      false);
    this.eventsModel = [a, b, c];

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
    if (Math.abs(event.end.getDate() - event.start.getDate()) === 1) {
      this.setModalHeader(event.start);
      this.multipleDaySelection = false;
      this.selectedDayEvents = this.getEventOnDate(event.start);
      console.log(this.selectedDayEvents);
    } else {
      console.log('m');
      this.setModalHeader(event.start, event.end);
      this.selectedDayEvents = [];
      this.multipleDaySelection = true;
    }
    this.activeModal = this.modalService.open(this.modalWindow);
  }

  private getEventOnDate(date: Date) {
    console.log(date.getFullYear(), (date.getMonth() + 1), date.getDate());
    return this.eventsModel.filter(
      element => (element.start.getDate() === date.getDate()
        && element.start.getMonth() === date.getMonth()
        && element.start.getFullYear() === date.getFullYear()));
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
          String(this.pad((end.getDate() - 1))) + '.');
    }
  }

  pad(num: number) {
    if (num < 10) {
      return ('0' + String(num));
    }
    return num;
  }

  // TODO
  checkValidity(event: CalendarEvent) {
    for (const e of this.selectedDayEvents) {
      if (true) {
        console.log('TODO');
      }
    }
  }

  onRowEditInit(data: any) {
    console.log(data);
  }

  onRowEditSave(data: any) {
    console.log(data);
  }

  onRowEditCancel(data: any, index: number) {
    console.log(data, index);
  }

  addNewCalendarEvent(type: string) {
    if (type === 'workTime') {
      this.selectedDayEvents = this.selectedDayEvents.filter(element => element.groupId === 'workTime');
      this.selectedDayEvents.push(new CalendarEvent('',
        'workTime',
        new Date('2020-03-21T00:00:00'),
        new Date('2020-03-21T00:00:00'),
        'yellow',
        'black',
        false));
    } else {
      this.selectedDayEvents = [];
      this.selectedDayEvents.push(new CalendarEvent('Holiday',
        'holiday',
        new Date('2020-03-21T00:00:00'),
        new Date('2020-03-21T00:00:00'),
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
    this.activeModal.close();
  }



  setHoliday() {
    this.selectedDayEvents = [];
    console.log('setHoliday');
  }

}
