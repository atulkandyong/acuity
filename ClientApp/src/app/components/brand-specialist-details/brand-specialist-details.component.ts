import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-brand-specialist-details',
  templateUrl: './brand-specialist-details.component.html',
  styleUrls: ['./brand-specialist-details.component.css']
})
export class BrandSpecialistDetailsComponent implements OnInit {
  ELEMENT_DATA: campaignList[];
  displayedColumnsCampaign: string[] = ['name', 'description'];
  displayedColumnsEvents: string[] = ['name', 'description', 'conductedOn', 'conductedAt']; //'campaignId', 
  displayedColumnsCompensation: string[] = ['name', 'description', 'compensation', 'receiptCount', 'totalDue'];
  campaignList: campaignList[];
  eventsList: any;
  userId: number;
  activeUser: boolean;
  eventCount: number;
  overAllPercentage: any;
  avgRetailScore: any;
  totalCompensation: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private http: HttpClient, public dialog: MatDialog, private route: ActivatedRoute) { }

  ngOnInit() {
    this.userId = this.route.snapshot.params['userId'];
    this.getEventList();
    this.getCampaignList();
    this.getUserDetail();
  }

  getEventList() {
    return this.http.get<any>('api/event/getEventsByUserId/' + this.userId).subscribe((data: any) => {
      debugger;
      data.map((q) => { q.conductedOn = formatDate(new Date(q.conductedOn * 1000), 'MM/dd/yyyy h:mm a', 'en-US') });
      this.eventsList = data;
      var _this = this;
      this.eventsList.map(function (item) {
        if (item.compensation)
          item.compensation = '$ ' + _this.currencyFormat(item.compensation);
        if (item.totalDue)
          item.totalDue = '$ ' + _this.currencyFormat(item.totalDue);
      })
      this.eventCount = data.length;
    });
  }

  currencyFormat(value) {
    return Number(value).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  getCampaignList() {
    return this.http.get<any>('api/campaign/getUserCampaigns/' + this.userId).subscribe((data: campaignList[]) => {
      this.campaignList = data
    });
  }

  getUserDetail() {
    return this.http.get<any>('user/' + this.userId).subscribe((data: any) => {
      if (data.isActive) {
        this.activeUser = true;
      } else {
        this.activeUser = false;
      }
    });
  }
}

export interface campaignList {
  id: number;
  name: string;
  description: string;
  createdOn: string;
}
export interface eventList {
  id: number,
  name: string,
  description: string,
  campaignId: number,
  brandSpecialistId: number,
  supplierId: number,
  conductedOn: string,
  conductedAt: string,
  createdOn: string
}
