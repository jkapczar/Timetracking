import {Component, OnInit, ViewChild} from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import {FullCalendar} from 'primeng';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit{
  @ViewChild('fc') cal: FullCalendar;

  constructor() { }

  events: any[];
  options: any;

  ngOnInit() {
    this.events = [
      {
        title: 'All Day Event',
        start: '2020-03-01'
      },
      {
        title: 'Long Event',
        start: '2020-03-07',
        end: '2020-03-10'
      },
      {
        title: 'Repeating Event',
        start: '2020-03-09T16:00:00'
      },
      {
        title: 'Repeating Event',
        start: '2020-03-16T16:00:00'
      },
      {
        title: 'Conference',
        start: '2020-03-11',
        end: '2020-03-13'
      }
    ];

    this.options = {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      defaultDate: '2020-03-18',
      header: {
        left: 'prev,next',
        center: 'title',
        right: 'month,agendaWeek,agendaDay'
      }
    };


  }

}
