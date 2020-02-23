import { Component, OnInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { AuthService } from '../../services/auth.service';
import { formatDate } from '@angular/common';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-receipt-submission',
  templateUrl: './receipt-submission.component.html',
  styleUrls: ['./receipt-submission.component.css']
})
export class ReceiptSubmissionComponent implements OnInit {
  eventName: string;
  receiptList: ReceiptElement[];
  eventId: number;
  displayedColumns: string[] = ['fileName', 'description', 'img', 'amount', 'uploadedOn', 'status', 'actions'];
  role: string;

  constructor(public http: HttpClient, public dialog: MatDialog, private authService: AuthService, private route: ActivatedRoute, private _snackBar: MatSnackBar) {
    this.role = this.authService.userDetail.role;
  }

  ngOnInit() {
    this.eventId = this.route.snapshot.params['eventId'];
    this.getEvent();
    this.getReceipts();
  }

  openAddImgDialog() {
    let dialogRefDel = this.dialog.open(ReceiptUpload, {
      height: 'auto',
      width: '600px',
      data: {
        id: 0,
        fileName: '',
        description: '',
        amount: 0,
        status: null,
        eventId: this.eventId,
      }
    });
    dialogRefDel.afterClosed().subscribe(
      val => {
        if (val == 'success') {
          this._snackBar.open('Receipt added successfully');
          this.getReceipts();
        }
      }
    );
  }

  openDeleteDialog(id) {
    let dialogRefDel = this.dialog.open(ReceiptDeleteFile, {
      height: 'auto',
      width: '600px',
      data: { deleteId: id }
    });
    dialogRefDel.afterClosed().subscribe(
      val => {
        if (val == 'success') {
          this._snackBar.open('Receipt deleted successfully');
          this.getReceipts();
        }
      }
    );
  }

  openPhoto(fileContent) {
    var image = new Image();
    image.src = "data:image/jpg;base64," + fileContent;
    var w = window.open("");
    w.document.write(image.outerHTML);
    w.document.close();
  }

  openStatusDialog(data, status) {
    let dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.afterClosed().subscribe(
      (response) => {
        if (response == 'confirm') {
          data.status = status;
          this.http.put('api/receipt/updateStatus/' + data.id, { status }).subscribe(() => {
            this.getReceipts();
          }, error => console.error(error));
        }
      }
    );
  }

  getEvent() {
    return this.http.get<any>('api/event/' + this.eventId).subscribe((data: Event) => {
      this.eventName = data.name;
    });
  }

  getReceipts() {
    if (this.authService.userDetail.role == 'Brand Specialist') {
      return this.http.get<any>('api/receipt/getReceiptsByEventId/' + this.eventId).subscribe((data: ReceiptElement[]) => {
        this.receiptList = data;
        var _this = this;
        this.receiptList.map(function (item) {
          if (item.amount) {
            item.amount = '$ ' + _this.currencyFormat(item.amount);
          }
          item.uploadedOn = formatDate(new Date(item.uploadedOn * 1000), 'MM/dd/yyyy h:mm a', 'en-US');
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
      });
    } else if (this.authService.userDetail.role == 'Admin') {
      return this.http.get<any>('api/receipt/getNewReceiptsByEventId/' + this.eventId).subscribe((data: ReceiptElement[]) => {
        this.receiptList = data;
        var _this = this;
        this.receiptList.map(function (item) {
          item.uploadedOn = formatDate(new Date(item.uploadedOn * 1000), 'MM/dd/yyyy h:mm a', 'en-US');
          if (item.amount) {
            item.amount = '$ ' + _this.currencyFormat(item.amount);
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
      });
    }
  }

  currencyFormat(value) {
    return Number(value).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
}

export interface ReceiptElement {
  id?: number,
  fileName: string,
  fileContent: string,
  description: string,
  amount: string,
  status: any,
  eventId: number,
  uploadedOn: any,
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

@Component({
  selector: 'receipt-submission-upload',
  templateUrl: './receipt-submission-upload.component.html',
  styleUrls: ['./receipt-submission.component.css']
})
export class ReceiptUpload {
  formGroup: FormGroup;
  url: any;
  fileContent: any;
  imageName: any;
  contentType: any;
  fileData: ReceiptElement;
  todaysDataTime = '';

  @ViewChild('receiptUpload')
  receiptUpload: ElementRef

  constructor(
    private dialogRef: MatDialogRef<ReceiptUpload>, private http: HttpClient, fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.formGroup = fb.group({
      id: [this.data.id],
      fileName: [this.data.fileName, Validators.required],
      description: [this.data.description],
      amount: [this.data.amount, Validators.required],
    });
  }

  onReceiptUploadClicked() {
    if (this.receiptUpload)
      this.receiptUpload.nativeElement.click()
  }

  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      var files = event.target.files;
      for (let i = 0; i < files.length; i++) {
        var reader = new FileReader();
        reader.onload = (event: any) => {
          this.url = event.target.result;
          this.fileContent = event.target.result.split(",")[1];
          this.imageName = files[i].name;
          this.contentType = files[i].type;
        }
        reader.readAsDataURL(files[i]);
      }
    }
  }

  onAdd() {
    debugger;
    this.formGroup.value.fileContent = this.fileContent;
    this.formGroup.value.contentType = this.contentType;
    this.formGroup.value.eventId = this.data.eventId;
    return this.http.post<ReceiptElement>('api/receipt', this.formGroup.value).subscribe(() => {
      this.close('success');
    }, error => console.error(error));
  }
  close(result) {
    this.dialogRef.close(result);
  }
}

@Component({
  selector: 'receipt-submission-deleteFile',
  templateUrl: './receipt-submission-deleteFile.component.html',
})
export class ReceiptDeleteFile {
  constructor(
    private dialogRef: MatDialogRef<ReceiptDeleteFile>, private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
  confirmDelete() {
    return this.http.delete<any>('api/receipt/' + this.data.deleteId).subscribe(() => {
      this.close('success');
    }, error => console.error(error));
  }
  close(result) {
    this.dialogRef.close(result);
  }
}
