import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-current-pay-period-detail',
  templateUrl: './current-pay-period-detail.component.html',
  styleUrls: ['./current-pay-period-detail.component.css']
})
export class CurrentPayPeriodDetailComponent implements OnInit {
  dataName: string;
  dataDescription: string;
  recapSheetList: FileElement[];
  recieptList: FileElement[];
  eventId: number;
  displayedColumns: string[] = ['fileName', 'file', 'uploadedOn', 'amount', 'status', 'actions'];

  constructor(public http: HttpClient, public dialog: MatDialog, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.eventId = this.route.snapshot.params['eventId'];
    this.getEvent();
    this.getRecapSheet();
  }

  openAddPhotoDialog() {
    let dialogRefDel = this.dialog.open(PayPeriodPhoto, {
      data: {

      }
    });
    dialogRefDel.afterClosed().subscribe(
      () => { this.getRecapSheet() }
    );
  }

  openDeleteDialog(id) {
    let dialogRefDel = this.dialog.open(PayPeriodDeleteFile, { data: { deleteId: id } });
    dialogRefDel.afterClosed().subscribe(
      () => { this.getRecapSheet() }
    );
  }

  getEvent() {
    return this.http.get<any>('api/event/' + this.eventId).subscribe((data: Event) => {
      this.dataName = data.name;
      this.dataDescription = data.description;
    });
  }

  getRecapSheet() {
    debugger;
    return this.http.get<any>('api/receipt').subscribe((data: FileElement[]) => {
      var id = this.eventId;
      var submissionList = data.filter(function (item) {
        return item.eventId == id;
      });
      this.recieptList = submissionList;
    });
  }
}

export interface FileElement {
  id?: number,
  fileName: string,
  fileContent: string,
  type: string,
  status: boolean,
  eventId: number,
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
}

@Component({
  selector: 'current-pay-period-detail-uploadPhoto',
  templateUrl: './current-pay-period-detail-uploadPhoto.component.html',
})
export class PayPeriodPhoto {
  formGroup: FormGroup;
  constructor(
    private dialogRef: MatDialogRef<PayPeriodPhoto>, private http: HttpClient, fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.formGroup = fb.group({
        id: [this.data.id],
      });
  }

  urls = [];
  fileData: FileElement;
  todaysDataTime = '';

  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();
        reader.onload = (event: any) => {
          this.fileData = event.target.result;
          this.urls.push(event.target.result);
        }
        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }

  onAdd() {
    for (var i = 0; i < this.urls.length; i++) {
      this.fileData = {
        fileName: "name" + i,
        fileContent: this.urls[i].split(",")[1],
        type: "photo",
        status: null,
        eventId: 6,
      }
      return this.http.post<FileElement>('api/submission', this.fileData).subscribe(() => {
        this.close();
      }, error => console.error(error));
    }
  }
  close() {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'current-pay-period-detail-deleteFile',
  templateUrl: './current-pay-period-detail-deleteFile.component.html',
})
export class PayPeriodDeleteFile {
  formGroup: FormGroup;
  constructor(
    private dialogRef: MatDialogRef<PayPeriodDeleteFile>, private http: HttpClient, fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.formGroup = fb.group({
      id: [this.data.id],
    });
  }
  confirmDelete() {
    return this.http.delete<any>('api/submission/' + this.data.deleteId).subscribe(() => {
      this.close();
    }, error => console.error(error));
  }
  close() {
    this.dialogRef.close();
  }
}
