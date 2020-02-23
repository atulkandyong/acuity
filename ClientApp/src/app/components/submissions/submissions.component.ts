import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-submissions',
  templateUrl: './submissions.component.html',
  styleUrls: ['./submissions.component.css']
})
export class SubmissionsComponent implements OnInit {
  
  dataSource: eventList[];
  displayedColumns: string[] = ['name', 'description', 'conductedOn', 'conductedAt'];

  constructor(public http: HttpClient) { }

  ngOnInit() {
    this.getEventList();
  }

  getEventList() {
    return this.http.get<any>('api/event/getEventsWithNewSubmissions/').subscribe((data: eventList[]) => {
      this.dataSource = data;
      this.dataSource.map((q) => { q.conductedOn = formatDate(new Date(q.conductedOn * 1000), 'MM/dd/yyyy h:mm a', 'en-US') })
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
  conductedOn: any,
  conductedAt: string,
}
