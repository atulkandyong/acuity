import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-events-brandSpecialist',
  templateUrl: './events-brandSpecialist.component.html',
  styleUrls: ['./events-brandSpecialist.component.css']
})
export class EventsBrandSpecialistComponent implements OnInit {
  dataSource: any[];
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
    return this.http.get<any[]>('api/event').subscribe((data: any[]) => {
      var bsId = this.userId;
      data.map(function (item) {
        item.conductedOn = formatDate(new Date(item.conductedOn * 1000), 'MM/dd/yyyy h:mm a', 'en-US')
      })
      this.dataSource = data.filter(function (item) {
        return item.brandSpecialistId == bsId;
      });
    });
  }
}

export interface eventList {
  id: number,
  name: string,
  description: string,
  campaignId: number,
  brandSpecialistId: number,
  supplierId: number,
  conductedOn: Date,
  conductedAt: string,
  createdOn: string,
  storeName: string,
  storeContact: string,
  storeAddress: string,
  instructions: string,
  compensation: number,
}
