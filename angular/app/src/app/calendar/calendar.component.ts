import {AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import {OptionsInput} from '@fullcalendar/core';
import {FullCalendarComponent} from '@fullcalendar/angular';
import {DateSelectionApi} from '@fullcalendar/core/Calendar';
import {MenuItem, TableBody} from 'primeng';
import {CalendarEvent} from '../model/event.model';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  @ViewChild('fullcalendar', { static: false }) fullcalendar: FullCalendarComponent;
  @ViewChild('mytable', { static : false}) table;
  constructor() { }

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
  selectedCalendarEvent: any;
  ngOnInit() {
    const a = new CalendarEvent('',
      'workTime',
      new Date('2020-03-21T08:30:00'),
      new Date('2020-03-21T12:40:00'),
      'yellow',
      'black',
      false);
    const b = new CalendarEvent('Holiday',
      'Holiday',
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

    this.items = [
      {label: 'Update', icon: 'pi pi-fw pi-refresh', command: () => {
          this.update();
        }},
      {label: 'Delete', icon: 'pi pi-fw pi-times', command: () => {
          this.delete();
        }},
      {label: 'Angular.io', icon: 'pi pi-fw pi-external-link', url: 'http://angular.io'},
      {label: 'Theming', icon: 'pi pi-fw pi-cog', routerLink: ['/theming']}
    ];

  }

  onSelect(event: DateSelectionApi) {
    if (Math.abs(event.end.getDate() - event.start.getDate()) === 1) {
      this.multipleDaySelection = false;
      this.selectedDayEvents = this.getEventOnDate(event.start);
      console.log(this.selectedDayEvents);
    } else {
      console.log('m');
      this.selectedDayEvents = [];
      this.multipleDaySelection = true;
    }
  }

  private getEventOnDate(date: Date) {
    console.log(date.getFullYear(), (date.getMonth() + 1), date.getDate());
    return this.eventsModel.filter(
      element => (element.start.getDate() === date.getDate()
      && element.start.getMonth() === date.getMonth()
      && element.start.getFullYear() === date.getFullYear()));
  }

  getSelectedDay() {
   return (String(this.selectedDayEvents[0].start.getFullYear()) + '.' +
    String(this.pad(this.selectedDayEvents[0].start.getMonth() + 1))  + '.' +
    String(this.pad(this.selectedDayEvents[0].start.getDate())));
  }

  pad(num: number) {
    if (num < 10) {
      return ('0' + String(num));
    }
    return num;
  }

  onEditInit() {
    console.log('edit');
    console.log(this.selectedCalendarEvent);
  }

  onCellEdit(e: CalendarEvent) {
    // console.log(e);
    this.selectedCalendarEvent = e;
  }

  onEditComplete() {
    console.log(this.selectedDayEvents);
  }

  save() {
    console.log('save');
    console.log(this.selectedDayEvents);
  }

  update() {
    console.log('update');
  }

  delete() {
    console.log('delete');
  }
}
