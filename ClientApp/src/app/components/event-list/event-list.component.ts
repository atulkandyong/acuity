import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatSnackBar } from '@angular/material';
import { formatDate } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {
  dataSource: any[];
  userList: any;
  userBsList: any;
  userSpList: any;
  campaignId: any;
  displayedColumns: string[] = ['name', 'conductedOn', 'storeName', 'actions'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private http: HttpClient, public dialog: MatDialog, private _snackBar: MatSnackBar, private route: ActivatedRoute) { }

  ngOnInit() {
    this.campaignId = this.route.snapshot.params['campaignId'];
    console.log(this.campaignId);
    this.getEventList();
    this.getUserList();
  }

  openAddDialog() {
    let dialogRefDel = this.dialog.open(EventAddDialog, {
      height: 'auto',
      width: '600px',
      data: {
        id: 0,
        name: "",
        description: "",
        campaignId: this.campaignId,
        brandSpecialistList: this.userBsList,
        brandSpecialistId: null,
        supplierList: this.userSpList,
        supplierId: null,
        conductedOn: "",
        storeName: "",
        contactName: "",
        storeContact: "",
        storeAddress: "",
        street: "",
        city: "",
        state: "",
        zipCode: "",
        instructions: "",
        compensation: "",
        mode: 'Add'
      }
    });
    dialogRefDel.afterClosed().subscribe(
      val => {
        if (val == 'success') {
          this._snackBar.open('Event added successfully');
          this.getEventList();
        } else if (val == 'fail') {
          this._snackBar.open('Error adding Event');
        }
      }
    );
  }

  openEditDialog(id) {
    var data = this.dataSource.filter(function (item) { return item.id == id; })[0];
    data.brandSpecialistList = this.userBsList;
    data.supplierList = this.userSpList;
    data.mode = 'Edit';
    let dialogRefDel = this.dialog.open(EventAddDialog, {
      height: 'auto',
      width: '600px',
      data: data
    });
    dialogRefDel.afterClosed().subscribe(
      val => {
        if (val == 'success') {
          this._snackBar.open('Event saved successfully');
          this.getEventList();
        } else if (val == 'fail') {
          this._snackBar.open('Error saving Event');
        }
      }
    );
  }

  openDeleteDialog(id) {
    let dialogRefDel = this.dialog.open(ConfirmDialogComponent);
    dialogRefDel.afterClosed().subscribe(
      val => {
        if (val == 'confirm') {
          return this.http.delete<any>('api/event/' + id).subscribe((result: any) => {
            this.getEventList();
          }, error => console.error(error));
        }
      }
    );
  }

  getEventList() {
    return this.http.get<any>('api/event/getCampaignEvents/' + this.campaignId).subscribe((data: eventList[]) => {
      this.dataSource = data;
      debugger;
      this.dataSource.map((q) => { q.conductedOn = formatDate(new Date(q.conductedOn * 1000), 'MM/dd/yyyy h:mm a', 'en-US') })
    });
  }

  getUserList() {
    return this.http.get<any>('user').subscribe((data: any) => {
      this.userBsList = data.filter(function (item) {
        return item.userRole.name == "Brand Specialist" && item.isActive;
      });
      this.userSpList = data.filter(function (item) {
        return item.userRole.name == "Supplier";
      });
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
  storeName: string,
  contactName: string,
  status: string,
  storeContact: string,
  storeAddress: string,
  street: string,
  city: string,
  state: string,
  zipCode: string,
  instructions: string,
  compensation: number,
}

@Component({
  selector: 'event-list-add',
  templateUrl: './event-list-add.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventAddDialog {
  formGroup: FormGroup;
  mode: string;
  constructor(
    private dialogRef: MatDialogRef<EventAddDialog>, public dialog: MatDialog, private http: HttpClient, fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.mode = data.mode;
    this.formGroup = fb.group({
      id: [this.data.id],
      name: [this.data.name, Validators.required],
      description: [this.data.description],
      campaignId: [this.data.campaignId],
      brandSpecialistId: [this.data.brandSpecialistId],
      supplierId: [this.data.supplierId],
      conductedOn: [new Date(this.data.conductedOn), Validators.required],
      storeName: [this.data.storeName],
      contactName: [this.data.contactName],
      storeContact: [this.data.storeContact],
      storeAddress: [this.data.storeAddress],
      street: [this.data.street],
      city: [this.data.city],
      state: [this.data.state],
      zipCode: [this.data.zipCode],
      instructions: [this.data.instructions],
      compensation: [this.data.compensation],
    });
  }

  onAdd() {
    this.formGroup.value.conductedOn = Date.parse(this.formGroup.value.conductedOn.toString());
    if (this.mode == "Add") {
      this.http.post<eventList>('api/event', this.formGroup.value).subscribe((eventList: eventList) => this.close('success'),
      error => this.close('fail'));
    } else {
      this.http.put<eventList>('api/event/' + this.data.id, this.formGroup.value).subscribe((eventList: eventList) => this.close('success'),
      error => this.close('fail'));
    }
  }

  close(result) {
    this.dialogRef.close(result);
  }
}
