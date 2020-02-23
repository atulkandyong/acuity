import { Component, Input, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent {
  message: string = "Are you sure ?";
  confirmButonMessage: string = 'Yes';
  showConfirm: boolean = true;
  showCancel: boolean = true;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ConfirmDialogComponent>) {
    debugger;
    if (data) {
      if (!data.popupMessage) {
        this.message = "Are you sure ?";
      } else {
        this.message = data.popupMessage;
      }
    }
    // if (data.confirmButonMessage == '') {
    //   this.confirmButonMessage = "Are you sure ?";
    // } else {
    //   this.confirmButonMessage = data.confirmButonMessage;
    // }
    // this.showConfirm = data.showConfirm;
    // this.showCancel = data.showCancel;
  }

  confirm() {
    this.dialogRef.close('confirm');
  }

  close() {
    this.dialogRef.close('cancel');
  }
}