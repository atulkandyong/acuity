import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatSnackBar } from '@angular/material';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { formatDate } from '@angular/common';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-campaign-list',
  templateUrl: './campaign-list.component.html',
  styleUrls: ['./campaign-list.component.css']
})
export class CampaignListComponent implements OnInit {
  ELEMENT_DATA: campaignList[];
  users:any;
  services = [
{
name: 'General Pest Control',
imageLink: 'assets/Bed-Bug.jpg'
},{
  name: 'Commercial Pest Control',
  imageLink: 'assets/cockroaches.png'
},{
  name: 'Commercial Pest Control',
  imageLink: 'assets/cockroaches.png'
},{
  name: 'Commercial Pest Control',
  imageLink: 'assets/cockroaches.png'
},{
  name: 'Commercial Pest Control',
  imageLink: 'assets/cockroaches.png'
},{
  name: 'Commercial Pest Control',
  imageLink: 'assets/cockroaches.png'
},{
  name: 'Commercial Pest Control',
  imageLink: 'assets/cockroaches.png'
}
];
  displayedColumns: string[] = ['name', 'description', 'actions'];
  dataSource: campaignList[];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private http: HttpClient, public dialog: MatDialog, private _snackBar: MatSnackBar) { 
  }

  ngOnInit() {
    this.getCampaignList();
  }


  getCampaignList() {
    return this.http.get<any>('api/campaign').subscribe((data: campaignList[]) => {
      this.dataSource = data;
    });
  }
}

export interface campaignList {
  id: number;
  name: string;
  description: string;
}

export interface Event {
  id: number;
  name: string;
  description: string;
}





