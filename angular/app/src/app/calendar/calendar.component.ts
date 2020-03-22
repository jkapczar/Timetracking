import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import {OptionsInput} from '@fullcalendar/core';
import {FullCalendarComponent} from '@fullcalendar/angular';
import {DateSelectionApi} from '@fullcalendar/core/Calendar';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit, AfterViewInit {

  constructor() { }

  options: OptionsInput;
  eventsModel: any;
  timeFormat = {hour: '2-digit',
    minute: '2-digit',
    meridiem: false};
  @ViewChild('fullcalendar', { static: false }) fullcalendar: FullCalendarComponent;
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

  }

  onSelect(event: DateSelectionApi) {
    console.log('ge');
    console.log(event.start);
    console.log(event.end);
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
