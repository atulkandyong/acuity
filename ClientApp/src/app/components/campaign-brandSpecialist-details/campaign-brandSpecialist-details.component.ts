import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-campaign-brandSpecialist-details',
  templateUrl: './campaign-brandSpecialist-details.component.html',
  styleUrls: ['./campaign-brandSpecialist-details.component.css']
})
export class CampaignBrandSpecialistDetailsComponent implements OnInit {
  ELEMENT_DATA: campaignEventDetails[];
  displayedColumnsTop: string[] = ['eventCount'];
  displayedColumnsBottom: string[] = ['conductedOn', 'conductedAt', 'numberOfPeopleSampled', 'numberOfBottlesSold', 'retailerSurveyScore'];
  eventsList: any;
  eventCount: number;
  campaignId: number;
  overAllPercentage: any;
  avgRetailScore: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private http: HttpClient, public dialog: MatDialog, private route: ActivatedRoute) { }

  ngOnInit() {
    this.campaignId = this.route.snapshot.params['campaignId'];
    this.getEventCount();
    this.getEventList();

  }

  getEventCount() {
    this.http.get<any>('/api/campaign/getEventMetricUsingCampaignId/' + this.campaignId).subscribe((data: any) => {
      this.eventsList = data;
      this.avgRetailScore = data.retailerSurveyScore;
      this.eventCount = data.campaignEventCount;
      var _overAllPercentage = data.numberOfBottlesSold / data.numberOfPeopleSampled * 100;
      if (_overAllPercentage)
        this.overAllPercentage = _overAllPercentage + '%';
    });
  }

  getEventList() {
    this.http.get<any>('/api/campaign/getEventMetricListUsingCampaignId/' + this.campaignId).subscribe((data: any) => {
        debugger;
      data.map((q) => { q.conductedOn = formatDate(new Date(q.conductedOn * 1000), 'MM/dd/yyyy h:mm a', 'en-US') });
      this.eventsList = data;
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
  conductedOn: string,
  conductedAt: string,
  numberOfPeopleSampled: number,
  numberOfBottlesSold: number,
  retailerSurveyScore: string
  createdOn: string
}

export interface campaignEventDetails {
  numOfEvents: number;
  percentageOfBottles: number,
  AvgSurveyScore: number
}
