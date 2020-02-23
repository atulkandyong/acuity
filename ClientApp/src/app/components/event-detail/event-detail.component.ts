import { Component, OnInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatSnackBar } from '@angular/material';
import { formatDate } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {
  name: string;
  description: string;
  compensation: string;
  conductedOn: any;
  instructions: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  storeContact: string;
  contactName: string;
  storeName: string;
  status: string;
  recapSheetList: FileElement[];
  photoList: FileElement[];
  eventId: number;
  role: string;
  displayedColumns: string[] = ['fileName', 'file', 'uploadedOn'];

  constructor(public http: HttpClient, public dialog: MatDialog, private _snackBar: MatSnackBar, private route: ActivatedRoute, private authService: AuthService) {
    this.role = this.authService.userDetail.role;
    if (this.role != "Supplier") {
      this.displayedColumns.push('status');
    }
    if (this.role == "Supplier") {
      this.displayedColumns.push('actions');
    }
  }

  openSubmitDialog() {
    let dialogRefDel = this.dialog.open(ConfirmDialogComponent, {
      data: { popupMessage: 'After submitting you will not be able to edit this event again. Are you sure? ' }
    });
    dialogRefDel.afterClosed().subscribe(
      val => {
        if (val == 'confirm') {
          this.http.post('api/event/submitEvent/' + this.eventId, {}).subscribe(() => {
            this.getEvent();
            this.getSubmissions();
          }, error => console.error(error));
        }
      }
    );
  }

  ngOnInit() {
    this.eventId = this.route.snapshot.params['eventId'];
    this.getEvent();
    this.getSubmissions();
  }

  openAddRecapDialog() {
    let dialogRefDel = this.dialog.open(EventUploadRecap, {
      data: { eventId: this.eventId }
    });
    dialogRefDel.afterClosed().subscribe(
      () => { this.getSubmissions() }
    );
  }

  openAddPhotoDialog() {
    let dialogRefDel = this.dialog.open(EventUploadPhoto, {
      data: { eventId: this.eventId }
    });
    dialogRefDel.afterClosed().subscribe(
      () => { this.getSubmissions() }
    );
  }

  openDeleteDialog(id) {
    let dialogRefDel = this.dialog.open(EventDeleteFile, { data: { deleteId: id } });
    dialogRefDel.afterClosed().subscribe(
      () => { this.getSubmissions() }
    );
  }

  openUpdateEventMetricDialog() {
    this.http.get<any>('api/eventmetric/getEventMetricByEventId/' + this.eventId).subscribe((data: any) => {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.height = 'auto';
      dialogConfig.width = '600px';
      dialogConfig.data = {
        id: this.eventId,
        editEnabled: this.role == 'Admin' || (this.role == 'Brand Specialist' && this.status == 'New'),
        numberOfPeopleSampled: data.numberOfPeopleSampled,
        numberOfBottlesSold: data.numberOfBottlesSold,
        approxNumberOfCustomersInStore: data.approxNumberOfCustomersInStore,
        retailerSurveyScore: data.retailerSurveyScore,
        approxAgeBreakdown: data.approxAgeBreakdown == null ? {} : JSON.parse(data.approxAgeBreakdown),
        approxGenderBreakdown: data.approxGenderBreakdown == null ? {} : JSON.parse(data.approxGenderBreakdown),
        approxEthnicityBreakdown: data.approxEthnicityBreakdown == null ? {} : JSON.parse(data.approxEthnicityBreakdown),
      };
      let dialogUpdateEventMetric = this.dialog.open(UpdateEventMetric, dialogConfig);
      dialogUpdateEventMetric.afterClosed().subscribe(
        response => {
          if (response == 'success') {
            this._snackBar.open('Event details updated successfully');
          } else if (response == 'fail') {
            this._snackBar.open('Error in updating Event details');
          }
        }
      );
    });
  }

  open(fileContent, contentType) {
    var pdfWindow = window.open("", '_blank');
    pdfWindow.document.write("<iframe width='100%' style='border: none;' height='100%' src='data:" + contentType + ";base64, " + encodeURI(fileContent) + "'></iframe>");
    pdfWindow.document.close();
  }
    
  download(fileContent, contentType, fileName) {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.href = "data:" + contentType + ";base64, " + encodeURI(fileContent);
    a.download = fileName;
    a.click();
  }

  downloadRecapSheetTemplate() {
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');
    this.http.get('api/report/downloadRecapSheet/' + this.eventId, { headers: headers, responseType: 'blob' }).subscribe((fileContent: any) => {
      var a = document.createElement("a");
      document.body.appendChild(a);
      var url = window.URL.createObjectURL(fileContent);
      a.href = url;
      a.download = 'Recap Sheet Template.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  getEvent() {
    return this.http.get<any>('api/event/' + this.eventId).subscribe((data: any) => {
      this.name = data.name;
      this.description = data.description;
      this.compensation = data.compensation;
      this.conductedOn = formatDate(new Date(data.conductedOn * 1000), 'MM/dd/yyyy h:mm a', 'en-US');
      this.instructions = data.instructions;
      this.street = data.street;
      this.city = data.city;
      this.state = data.state;
      this.zipCode = data.zipCode;
      this.storeContact = data.storeContact;
      this.contactName = data.contactName;
      this.storeName = data.storeName;
      this.status = data.status;
    });
  }

  getSubmissions() {
    return this.http.get<any>('api/submission/getEventSubmissions/' + this.eventId).subscribe((submissionList: FileElement[]) => {
      submissionList.map(function (item) {
        switch (item.contentType) {
          case 'application/pdf':
          case 'application/docx':
            item.src = '/assets/PDF-exploit.png';
            break;
          case 'image/png':
          case 'image/jpeg':
            item.src = 'data:image/png;base64,' + item.fileContent;
            break;
          default:
            item.src = '/assets/Document.png';
            break;
        }
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
  contentType: string,
  type: string,
  src: any,
  status: any,
  eventId: number
}

export interface Event {
  id: number,
  name: string,
  description: string,
  campaignId: number,
  brandSpecialistId: number,
  supplierId: number,
  conductedOn: any,
  conductedAt: string,
}

@Component({
  selector: 'event-detail-uploadPhoto',
  templateUrl: './event-detail-uploadPhoto.component.html',
})
export class EventUploadPhoto {
  formGroup: FormGroup;
  constructor(
    private dialogRef: MatDialogRef<EventUploadPhoto>, private http: HttpClient, fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.formGroup = fb.group({
      id: [this.data.id],
    });
  }

  @ViewChild('photoUpload')
  photoUpload: ElementRef
  fileData: FileElement;
  url: any;

  onPhotoUploadClicked() {
    if (this.photoUpload)
      this.photoUpload.nativeElement.click()
  }

  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      var files = event.target.files;
      for (let i = 0; i < files.length; i++) {
        var reader = new FileReader();
        reader.onload = (event: any) => {
          this.fileData = {
            fileName: files[i].name,
            fileContent: event.target.result.split(",")[1],
            type: "photo",
            src: '',
            contentType: files[i].type,
            status: null,
            eventId: this.data.eventId
          }
          switch (files[i].type) {
            case 'application/pdf':
            case 'application/docx':
              this.url = '/assets/PDF-exploit.png';
              break;
            case 'image/png':
            case 'image/jpeg':
              this.url = event.target.result;
              break;
            default:
              this.url = '/assets/Document.png';
              break;
          }
        }
        reader.readAsDataURL(files[i]);
      }
    }
  }

  onAdd() {
    return this.http.post<FileElement>('api/submission', this.fileData).subscribe(() => {
      this.close();
    }, error => console.error(error));
  }

  close() {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'event-detail-uploadRecap',
  templateUrl: './event-detail-uploadRecap.component.html',
})
export class EventUploadRecap {
  formGroup: FormGroup;
  constructor(
    private dialogRef: MatDialogRef<EventUploadRecap>, private http: HttpClient, fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.formGroup = fb.group({
      id: [this.data.id],
    });
  }

  @ViewChild('recapUpload')
  recapUpload: ElementRef
  fileData: FileElement;
  url: any;

  onRecapUploadClicked() {
    if (this.recapUpload)
      this.recapUpload.nativeElement.click()
  }

  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      var files = event.target.files;
      for (let i = 0; i < files.length; i++) {
        var reader = new FileReader();
        reader.onload = (event: any) => {
          this.fileData = {
            fileName: files[i].name,
            fileContent: event.target.result.split(",")[1],
            type: "recap",
            src: '',
            contentType: files[i].type,
            status: null,
            eventId: this.data.eventId
          }
          switch (files[i].type) {
            case 'application/pdf':
            case 'application/docx':
              this.url = '/assets/PDF-exploit.png';
              break;
            case 'image/png':
            case 'image/jpeg':
              this.url = event.target.result;
              break;
            default:
              this.url = '/assets/Document.png';
              break;
          }
        }
        reader.readAsDataURL(files[i]);
      }
    }
  }

  onAdd() {
    return this.http.post<FileElement>('api/submission', this.fileData).subscribe(() => {
      this.close();
    }, error => console.error(error));
  }

  close() {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'event-detail-deleteFile',
  templateUrl: './event-detail-deleteFile.component.html',
})
export class EventDeleteFile {
  constructor(
    private dialogRef: MatDialogRef<EventDeleteFile>, private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
  confirmDelete() {
    return this.http.delete<any>('api/submission/' + this.data.deleteId).subscribe(() => {
      this.close();
    }, error => console.error(error));
  }
  close() {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'event-detail-updateEventMetric',
  templateUrl: './event-detail-updateEventMetric.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class UpdateEventMetric {
  formGroup: FormGroup;
  editEnabled: any;
  constructor(
    private dialogRef: MatDialogRef<UpdateEventMetric>, private http: HttpClient, fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.formGroup = fb.group({
      id: [this.data.id],
    });
    this.editEnabled = data.editEnabled;
  }

  save() {
    this.data.approxAgeBreakdown = JSON.stringify(this.data.approxAgeBreakdown);
    this.data.approxEthnicityBreakdown = JSON.stringify(this.data.approxEthnicityBreakdown);
    this.data.approxGenderBreakdown = JSON.stringify(this.data.approxGenderBreakdown);
    return this.http.post<any>('api/eventmetric/' + this.data.id, this.data).subscribe(() => {
      this.close('success');
    }, error => this.close('fail'));
  }

  close(response) {
    this.dialogRef.close(response);
  }
}
