import { Component, OnInit, ElementRef, Input, Inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-submission-event-detail',
  templateUrl: './submission-event-detail.component.html',
  styleUrls: ['./submission-event-detail.component.css']
})
export class SubmissionEventDetailComponent implements OnInit {
  dataName: string;
  dataDescription: string;
  recapSheetList: FileElement[];
  photoList: FileElement[];
  eventId: number;
  displayedColumns: string[] = ['fileName', 'file', 'uploadedOn', 'status', 'actions'];
  fileUpload: ElementRef
  @Input()
  files: File[] = []
  currentRoot: FileElement;
  data: FileElement;

  constructor(private sanitizer: DomSanitizer, public http: HttpClient, public dialog: MatDialog, private route: ActivatedRoute) {
    this.currentRoot = this.data;
  }

  fileURLs: string[] = [];

  ngOnInit() {
    this.eventId = this.route.snapshot.params['eventId'];
    this.getEvent();
    this.getRecapSheet();
  }

  openStatusDialog(data, status) {
    let dialogRef = this.dialog.open(ConfirmDialogComponent, { height: 'auto', width: 'auto' });
    dialogRef.afterClosed().subscribe(
      result => {
        if (result == 'confirm') {
          this.http.put<FileElement>('api/submission/updateStatus/' + data.id, { status }).subscribe(() => {
            this.getRecapSheet();
          }, error => console.error(error));
        }
      }
    );
  }

  onClick() {
    if (this.fileUpload)
      this.fileUpload.nativeElement.click()
  }

  onInput() {
  }

  onFileSelected(event) {
    let files = event.dataTransfer ? event.dataTransfer.files : event.target.files;
    for (let i = 0; i < files.length; i++) {
      let file = files[i];

      if (this.validate(file)) {
        file.objectURL = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(files[i])));
        this.files.push(files[i]);
      }
    }
  }

  removeFile(file) {
    let ix
    if (this.files && -1 !== (ix = this.files.indexOf(file))) {
      this.files.splice(ix, 1)
      this.clearInputElement()
    }
  }

  validate(file: File) {
    for (const f of this.files) {
      if (f.name === file.name
        && f.lastModified === file.lastModified
        && f.size === f.size
        && f.type === f.type
      ) {
        return false
      }
    }
    return true
  }

  clearInputElement() {
    this.fileUpload.nativeElement.value = ''
  }

  uploadUserFiles() {
    if (this.files.length === 0)
      return;
    debugger;
    var records = [];
    this.files.forEach(file => {
      var record = new FormData();
      record.append("document", file, file.name);
      records.push({ name: file.name, parentId: this.currentRoot.id, isDocument: true, document: record });
    });
    this.http.post('/api/submission', records).subscribe(
      result => {
        if (result) {
          //this.dialogRef.close({ id: (result as any).id, name: file.name, isFolder: false, parent: this.currentRoot.id })
        } else {
        }
      },
      () => {
      });
  }

  //openPhoto(fileContent) {
  //  var image = new Image();
  //  image.src = "data:image/jpg;base64," + fileContent;
  //  var w = window.open("");
  //  w.document.write(image.outerHTML);
  //  w.document.close();
  //}

  //openRecapSheet(fileContent) {
  //  var pdfWindow = window.open("", '_blank');
  //  pdfWindow.document.write("<iframe width='100%' style='border: none;' height='100%' src='data:application/pdf;base64, " + encodeURI(fileContent) + "'></iframe>");
  //  pdfWindow.document.close();
  //}

  openPhoto(fileContent, contentType) {
    var pdfWindow = window.open("", '_blank');
    pdfWindow.document.write("<iframe width='100%' style='border: none;' height='100%' src='data:" + contentType + ";base64, " + encodeURI(fileContent) + "'></iframe>");
    pdfWindow.document.close();
  }

  openRecapSheet(fileContent, contentType) {
    var pdfWindow = window.open("", '_blank');
    pdfWindow.document.write("<iframe width='100%' style='border: none;' height='100%' src='data:" + contentType + ";base64, " + encodeURI(fileContent) + "'></iframe>");
    pdfWindow.document.close();
  }

  getEvent() {
    return this.http.get<any>('api/event/' + this.eventId).subscribe((data: any) => {
      this.dataName = data.name;
      this.dataDescription = data.description;
      console.log(this.dataName);
    });
  }

  getRecapSheet() {
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
  conductedOn: string,
  conductedAt: string,
  createdOn: string
}
