import { Component, EventEmitter, OnInit, Output, ElementRef, ViewChild, Input, Inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-compensation-due-detail',
  templateUrl: './compensation-due-detail.component.html',
  styleUrls: ['./compensation-due-detail.component.css']
})
export class CompensationDueDetailComponent implements OnInit {
  dataName: string;
  dataDescription: string;
  recapSheetList: FileElement[];
  photoList: FileElement[];
  eventId: number;
  displayedColumns: string[] = ['img', 'fileName', 'uploadedOn', 'status'];

  constructor(public http: HttpClient, public dialog: MatDialog, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.eventId = this.route.snapshot.params['eventId'];
    this.getEvent();
    this.getSubmissions();
  }

  getEvent() {
    return this.http.get<any>('api/event/' + this.eventId).subscribe((data: Event) => {
      this.dataName = data.name;
      this.dataDescription = data.description;
    });
  }

  getSubmissions() {
    return this.http.get<any>('api/submission/getEventSubmissions/' + this.eventId).subscribe((submissionList: FileElement[]) => {
      submissionList.map(function (item) {
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
      });
      this.recapSheetList = submissionList.filter(function (item) {
        return item.type == "recap";
      });
      this.photoList = submissionList.filter(function (item) {
        return item.type == "photo";
      });
    });
  }
}

export interface FileElement {
  id?: number,
  fileName: string,
  fileContent: string,
  type: string,
  status: any,
  eventId: number,
  uploadedOn: string
}

export interface Event {
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
