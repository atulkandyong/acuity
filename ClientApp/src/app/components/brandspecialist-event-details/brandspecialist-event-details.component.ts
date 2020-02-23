import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { formatDate } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-brandspecialist-event-details',
  templateUrl: './brandspecialist-event-details.component.html',
  styleUrls: ['./brandspecialist-event-details.component.css']
})
export class BrandspecialistEventDetailsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
