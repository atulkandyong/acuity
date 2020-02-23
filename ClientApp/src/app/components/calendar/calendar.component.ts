import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { startOfDay, endOfDay, isSameDay, isSameMonth } from 'date-fns';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView, CalendarMonthViewBeforeRenderEvent } from 'angular-calendar';
import { AuthService } from 'src/app/services/auth.service';
import { MatPaginator } from '@angular/material/paginator';
import RRule from 'rrule';
import moment from 'moment-timezone';
import { ViewPeriod } from 'calendar-utils';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatSnackBar } from '@angular/material';
import { AddUnavailabilityDialog } from './add-unavailability.component';
import { formatDate } from '@angular/common';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { ActivatedRoute } from '@angular/router';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

interface RecurringEvent {
  title: string;
  color: any;
  rrule?: {
    freq: any;
    bymonth?: number;
    bymonthday?: number;
    byweekday?: any;
    interval?: number;
  };
}

moment.tz.setDefault('Utc');

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  role: string;
  displayedColumns: string[] = ['brandSpecialist', 'description', 'startDate', 'endDate', 'status', 'actions'];
  brandSpecialistUnavailability: any[];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private authService: AuthService, public dialog: MatDialog, private _snackBar: MatSnackBar, private http: HttpClient, private cdr: ChangeDetectorRef, private route: ActivatedRoute) {
    this.role = this.authService.userDetail.role;
    this.userId = this.authService.userDetail.userId;
    this.getBrandSpecialistUnavailability();
  }

  view: CalendarView = CalendarView.Month;
  viewDate = moment().toDate();
  CalendarView = CalendarView;
  userId: string;

  ngOnInit() {
  }

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        this.handleEvent('Deleted', event);
      }
    }
  ];

  recurringEvents: RecurringEvent[] = [
    {
      title: 'Pay Day',
      color: colors.red,
      rrule: {
        freq: RRule.WEEKLY,
        byweekday: [RRule.FR],
        interval: 2
      }
    }
  ];

  events: CalendarEvent[] = [];

  viewPeriod: ViewPeriod;

  activeDayIsOpen: boolean = true;

  updateCalendarEvents(viewRender: CalendarMonthViewBeforeRenderEvent): void {
    if (
      !this.viewPeriod ||
      !moment(this.viewPeriod.start).isSame(viewRender.period.start) ||
      !moment(this.viewPeriod.end).isSame(viewRender.period.end)
    ) {
      this.viewPeriod = viewRender.period;
      this.events = [];

      this.recurringEvents.forEach(event => {
        const rule: RRule = new RRule({
          ...event.rrule,
          dtstart: moment(viewRender.period.start).startOf('day').toDate(),
          until: moment(viewRender.period.end).endOf('day').toDate()
        });
        const { title, color } = event;

        rule.all().forEach(date => {
          this.events.push({
            title,
            color,
            start: moment(date).toDate()
          });
        });
      });

      if (this.role == "Admin") {
        this.http.get<any>('api/event').subscribe((data: any[]) => {
          data.forEach(eventItem => {
            this.events = [
              ...this.events,
              {
                title: eventItem.name,
                color: colors.yellow,
                start: new Date(eventItem.conductedOn * 1000),
              }
            ];
          });
        });
      }
      else {
        this.http.get<any>('api/event/getEventsByUserId/' + this.userId).subscribe((data: any[]) => {
          data.forEach(eventItem => {
            this.events = [
              ...this.events,
              {
                title: eventItem.name,
                color: colors.yellow,
                start: new Date(eventItem.conductedOn * 1000),
              }
            ];
          });
        });
      }
      this.cdr.detectChanges();
    }
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map(iEvent => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    //alert('');
    // this.modalData = { event, action };
    // this.modal.open(this.modalContent, { size: 'lg' });
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors.red,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true
        },
      }
    ];
  }

  openAddUnavailabilityDialog() {
    let dialogRefDel = this.dialog.open(AddUnavailabilityDialog, { data: {} });
    dialogRefDel.afterClosed().subscribe(
      result => {
        if (result == 'success') {
          this.getBrandSpecialistUnavailability();
        }
      }
    );
  }

  getBrandSpecialistUnavailability() {
    return this.http.get('api/brandSpecialistUnavailability').subscribe((result: any) => {
      result.map(function (item) {
        item.startDate = formatDate(new Date(item.startDate * 1000), 'MM/dd/yyyy h:mm a', 'en-US');
        item.endDate = formatDate(new Date(item.endDate * 1000), 'MM/dd/yyyy h:mm a', 'en-US');
        switch (item.status) {
          case true:
            item.status = 'Accepted';
            break;
          case false:
            item.status = 'Rejected';
            break;
          case null:
            item.status = 'New';
            break;
        }
      })
      this.brandSpecialistUnavailability = result;
    }, error => {
    });
  }

  openDeleteDialog(id: any) {
    let dialogRefDel = this.dialog.open(ConfirmDialogComponent, { data: { deleteId: id } });
    dialogRefDel.afterClosed().subscribe(
      val => {
        if (val == 'confirm') {
          this.http.delete('api/brandSpecialistUnavailability/' + id).subscribe((result: any) => {
            this._snackBar.open('Event deleted successfully');
            this.getBrandSpecialistUnavailability();
          }, error => {
            this._snackBar.open('Error deleting Event');
          });
        }
      }
    );
  }

  openStatusDialog(data, status) {
    let dialogRef = this.dialog.open(ConfirmDialogComponent, { height: 'auto', width: 'auto' });
    dialogRef.afterClosed().subscribe(
      result => {
        if (result == 'confirm') {
          this.http.put('api/brandSpecialistUnavailability/updateStatus/' + data.id, { status }).subscribe(() => {
            this.getBrandSpecialistUnavailability();
          }, error => console.error(error));
        }
      }
    );
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter(event => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
}
