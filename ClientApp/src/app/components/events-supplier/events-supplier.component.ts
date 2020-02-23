import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-events-supplier',
  templateUrl: './events-supplier.component.html',
  styleUrls: ['./events-supplier.component.css']
})
export class EventsSupplierComponent implements OnInit {
  eventByCampaignId: eventList[];
  campaignEvents: eventList[];
  campaignName: string;
  campaignDesc: string;
  eventMetricData: eventMetric;
  userList: any;
  userBsList: any;
  userSpList: any;
  campaignId: any;
  userId: any;
  displayedColumns: string[] = ['name', 'conductedOn', 'conductedAt'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private http: HttpClient, private authService: AuthService, public dialog: MatDialog, private route: ActivatedRoute) { }

  ngOnInit() {
    this.campaignId = this.route.snapshot.params['campaignId'];
    this.userId = this.authService.userDetail.userId;
    this.getEventList();
    this.getCampaignDetails();
    this.getEventMetric();
  }

    openCampaignMetricsDialog() {
    var prcentageOfBottlesSold = this.eventMetricData.numberOfBottlesSold / this.eventMetricData.numberOfPeopleSampled * 100;
    let dialogRefDel = this.dialog.open(CampaignMetricsDialog, {
      height: 'auto',
      width: '600px',
      data: {
        id: this.eventMetricData.id,
        eventId: this.eventMetricData.eventId,
        campaignId: this.campaignId,
        campaignEventCount: this.eventMetricData.campaignEventCount,
        numberOfPeopleSampled: this.eventMetricData.numberOfPeopleSampled,
        numberOfBottlesSold: this.eventMetricData.numberOfBottlesSold,
        prcentageOfBottlesSold: isNaN(prcentageOfBottlesSold) ? 0 : prcentageOfBottlesSold.toFixed(2),
        approxNumberOfCustomersInStore: this.eventMetricData.approxNumberOfCustomersInStore,
          approxAgeBreakdown: JSON.parse(this.eventMetricData.approxAgeBreakdown),
        approxGenderBreakdown: JSON.parse(this.eventMetricData.approxGenderBreakdown),
        approxEthnicityBreakdown: JSON.parse(this.eventMetricData.approxEthnicityBreakdown)
      }
    });
    dialogRefDel.afterClosed().subscribe(
      val => { }
    );
  }

  getEventList() {
    return this.http.get<any>('api/event/getEventsForSupplier/' + this.campaignId).subscribe((data: eventList[]) => {
      var spId = this.userId;
      this.campaignEvents = data.filter(function (item) {
        return item.supplierId == spId;
      });
      this.campaignEvents.map(function (item) {
        item.conductedOn = formatDate(new Date(item.conductedOn * 1000), 'MM/dd/yyyy h:mm a', 'en-US');
      });
    });
  }

  getCampaignDetails() {
    return this.http.get<any>('api/campaign/' + this.campaignId).subscribe((data: eventList) => {
      this.campaignName = data.name;
      this.campaignDesc = data.description;
    });
  }

  getEventMetric() {
      return this.http.get<any>('api/campaign/getSupplierEventMetricUsingCampaignId/' + this.campaignId).subscribe((data: eventMetric) => {
      this.eventMetricData = data;
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

export interface eventMetric {
  id: number,
  eventId: number,
  campaignEventCount: number,
  prcentageOfBottlesSold: number,
  numberOfPeopleSampled: number,
  numberOfBottlesSold: number,
  approxNumberOfCustomersInStore: number,
  approxAgeBreakdown: any,
  approxGenderBreakdown: any,
  approxEthnicityBreakdown: any
}

@Component({
  selector: 'app-campaign-metrics',
  templateUrl: './campaign-metrics.component.html',
})
export class CampaignMetricsDialog {
  campaignId: number;
  constructor(
    private dialogRef: MatDialogRef<CampaignMetricsDialog>, private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.campaignId = data.campaignId;
  }
  confirmDelete() {
    this.close();
  }

  print() {
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');
    this.http.get('api/report/downloadCampaignMetrics/' + this.campaignId, { headers: headers, responseType: 'blob' }).subscribe((fileContent: any) => {
      var a = document.createElement("a");
      document.body.appendChild(a);
      var url = window.URL.createObjectURL(fileContent);
      a.href = url;
      a.download = 'Recap Sheet Template.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  close() {
    this.dialogRef.close();
  }
}
