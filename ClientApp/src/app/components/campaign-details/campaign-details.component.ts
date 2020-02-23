import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { formatDate } from '@angular/common';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-campaign-details',
  templateUrl: './campaign-details.component.html',
  styleUrls: ['./campaign-details.component.css']
})
export class CampaignDetailsComponent implements OnInit {
  ELEMENT_DATA: campaignEventDetails[];
  displayedColumns: string[] = ['numOfEvents', 'percentageOfBottles', 'AvgSurveyScore'];
  dataSource: campaignEventDetails;
  eventCount: number;
  campaignId: number;
  eventsList: eventList[];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private http: HttpClient, public dialog: MatDialog, private route: ActivatedRoute) { }

  ngOnInit() {
   
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
  createdOn: string
}

export interface campaignEventDetails {
  numOfEvents: number;
  percentageOfBottles: number,
  AvgSurveyScore: number

}



