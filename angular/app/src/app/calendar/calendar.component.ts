import {AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import {OptionsInput} from '@fullcalendar/core';
import {FullCalendarComponent} from '@fullcalendar/angular';
import {DateSelectionApi} from '@fullcalendar/core/Calendar';
import {MenuItem} from 'primeng';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit, AfterViewInit {

  constructor() { }

  options: OptionsInput;
  eventsModel: any;
  timeFormat = {
    hour: '2-digit',
    minute: '2-digit',
    meridiem: false
  };
  @ViewChild('fullcalendar', { static: false }) fullcalendar: FullCalendarComponent;

  items: MenuItem[];

  ngOnInit() {
    this.eventsModel = [
      { allDay: false,
        groupId: 'workTime',
        start: '2020-03-21T10:30:00',
        end: '2020-03-21T12:40:00',
        backgroundColor: 'yellow',
        textColor: 'black'},
      { allDay: true,
        title: 'Holiday',
        groupId: 'Holiday',
        start: '2020-03-26T10:30:00',
        backgroundColor: 'purple',
        textColor: 'black'}
      ];

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
    console.log(this.fullcalendar.getApi().view.activeStart);
    console.log(this.fullcalendar.getApi().view.activeEnd);
    console.log('ge');
    console.log(event.start);
    console.log(event.end);
  }

  save() {
    console.log('save');
  }

  update() {
    console.log('update');
  }

  delete() {
    console.log('delete');
  }

  updateHeader() {
    this.options.header = {
      left: 'prev,next myCustomButton',
      center: 'title',
      right: ''
    };
  }
  updateEvents() {
    this.eventsModel = [{
      title: 'Updaten Event',
      start: this.yearMonth + '-08',
      end: this.yearMonth + '-10'
    }];
  }
  get yearMonth(): string {
    const dateObj = new Date();
    return dateObj.getUTCFullYear() + '-' + (dateObj.getUTCMonth() + 1);
  }

  ngAfterViewInit(): void {
  }

}
