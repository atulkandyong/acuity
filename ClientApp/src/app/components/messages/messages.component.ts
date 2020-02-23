import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatSnackBar } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  dataSource: messageList[];
  userList: any;
  userBsList: any;
  userSpList: any;
  campaignId: any;
  userId: any;
  userName: string;
  displayedColumns: string[] = ['subject', 'userName', 'createdOn'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private http: HttpClient, private authService: AuthService, public dialog: MatDialog, private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.userId = this.authService.userDetail.userId;
    this.getMessageList();
  }

  openAddDialog() {
    let dialogRefDel = this.dialog.open(MessageAddDialog, {
      height: 'auto',
      width: '600px',
      data: {
        id: 0,
        subject: "",
        body: "",
        userId: this.userId,
        userName: this.userName, 
        createdOn: ""
      }
    });
    dialogRefDel.afterClosed().subscribe(
      val => {
        if (val == 'success') {
          this._snackBar.open('Message added successfully');
          this.getMessageList();
        }
      }
    );
  }

  openViewDialog(subject, body, createdOn) {
    let dialogRefDel = this.dialog.open(MessageViewDialog, {
      height: 'auto',
      width: '600px',
      data: {
        subject: subject,
        body: body,
        createdOn: createdOn
      }
    });
    dialogRefDel.afterClosed().subscribe(
      val => { this.getMessageList() }
    );
  }

  openDeleteDialog(id) {
    let dialogRefDel = this.dialog.open(MessageDeleteDialog, { data: { deleteId: id } });
    dialogRefDel.afterClosed().subscribe(
      val => {
        if (val == 'success') {
          this._snackBar.open('Message deleted successfully');
          this.getMessageList();
        }
      }
    );
  }

  getMessageList() {
    return this.http.get<any>('api/message').subscribe((data: messageList[]) => {
      this.dataSource = data;
    });
  }
}

export interface messageList {
  id: number,
  subject: string,
  body: string,
  userId: number,
}

@Component({
  selector: 'messages-add',
  templateUrl: './messages-add.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessageAddDialog {
  formGroup: FormGroup;
  addData: messageList;
  constructor(
    private dialogRef: MatDialogRef<MessageAddDialog>, private http: HttpClient, fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.formGroup = fb.group({
      id: [this.data.id],
      userId:[this.data.userId],
      userName: [this.data.userName],
      subject: [this.data.subject,Validators.required],
      body: [this.data.body,Validators.required]
    });
  }

  onAdd() {
    this.addData = {
      id: 0,
      subject: this.formGroup.value.subject,
      body: this.formGroup.value.body,
      userId: this.formGroup.value.userId,
    }
    return this.http.post<messageList>('api/message', this.addData).subscribe((result: messageList) => {
      this.close('success');
    }, error => console.error(error));
  }
  close(result) {
    this.dialogRef.close(result);
  }
}

@Component({
  selector: 'messages-delete',
  templateUrl: './messages-delete.component.html',
})
export class MessageDeleteDialog {
  constructor(
    private dialogRef: MatDialogRef<MessageDeleteDialog>, private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
  confirmDelete() {
    return this.http.delete<any>('api/message/' + this.data.deleteId).subscribe((result: any) => {
      this.close('success');
    }, error => console.error(error));
  }
  close(result) {
    this.dialogRef.close(result);
  }
}

@Component({
  selector: 'messages-view',
  templateUrl: './messages-view.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessageViewDialog {
  constructor(
    private dialogRef: MatDialogRef<MessageViewDialog>, private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  close() {
    this.dialogRef.close();
  }
}
