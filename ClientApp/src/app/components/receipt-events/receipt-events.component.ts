import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-receipt-events',
  templateUrl: './receipt-events.component.html',
  styleUrls: ['./receipt-events.component.css']
})
export class ReceiptEventsComponent implements OnInit {
  dataSource: eventList[];
  userList: any;
  userBsList: any;
  userSpList: any;
  campaignId: any;
  userId: any;
  displayedColumns: string[] = ['name', 'conductedOn', 'conductedAt'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private http: HttpClient, private authService: AuthService) { }

  ngOnInit() {
    this.userId = this.authService.userDetail.userId;
    this.getEventList();
  }

  getEventList() {
      debugger;
    if (this.authService.userDetail.role == 'Brand Specialist') {
      return this.http.get<any>('api/event/getEventsByUserId/' + this.userId).subscribe((data: any[]) => {
        this.dataSource = data;
        this.dataSource.map(function (item) {
          item.conductedOn = formatDate(new Date(item.conductedOn * 1000), 'MM/dd/yyyy h:mm a', 'en-US');
        });
      });
    } else if (this.authService.userDetail.role == 'Admin') {
      return this.http.get<any>('api/event/getEventsWithNewReceipts/').subscribe((data: any[]) => {
        this.dataSource = data;
        this.dataSource.map(function (item) {
          item.conductedOn = formatDate(new Date(item.conductedOn * 1000), 'MM/dd/yyyy h:mm a', 'en-US');
        });
      });
    }
  }
}

export interface eventList {
  id: number,
  name: string,
  description: string,
  campaignId: number,
  brandSpecialistId: number,
  supplierId: number,
  conductedOn: any,
  conductedAt: string
}
