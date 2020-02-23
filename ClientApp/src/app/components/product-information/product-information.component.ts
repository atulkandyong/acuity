import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatSnackBar } from '@angular/material';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-product-information',
  templateUrl: './product-information.component.html',
  styleUrls: ['./product-information.component.css']
})
export class ProductInformationComponent implements OnInit {

  ELEMENT_DATA: productInfo[];
  displayedColumns: string[] = ['name', 'actions'];
  dataSource: productInfo[];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private http: HttpClient, public dialog: MatDialog, private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.getProductInfo();
  }

  openAddDialog() {
    let dialogRefDel = this.dialog.open(ProductInfoAddDialog, {
      height: 'auto',
      width: '600px',
      data: {
        id: 0,
        name: "",
        description: "",
        mode:"Add"
      }
    });
    dialogRefDel.afterClosed().subscribe(
      val => {
        if (val == 'success') {
          this._snackBar.open('Product added successfully');
          this.getProductInfo();
        }
      }
    );
  }

  openDeleteDialog(id) {
    let dialogRefDel = this.dialog.open(ProductInfoDeleteDialog, {
      data: { deleteId: id }
    });
    dialogRefDel.afterClosed().subscribe(
      val => {
        if (val == 'success') {
          this._snackBar.open('Product deleted successfully');
          this.getProductInfo();
        }
      }
    );
  }

  openEditDialog(id, name, description) {
    let dialogRefDel = this.dialog.open(ProductInfoAddDialog, {
      height: 'auto',
      width: '600px',
      data: { id: id, name: name, description: description,mode:"Edit" }
    });
    dialogRefDel.afterClosed().subscribe(
      val => {
        if (val == 'success') {
          this._snackBar.open('Product saved successfully');
          this.getProductInfo();
        }
      }
    );
  }

  openViewDialog(id, name, description) {
    let dialogRefDel = this.dialog.open(ProductInfoViewDialog, {
      height: 'auto',
      width: '600px',
      data: { id: id, name: name, description: description }
    });
    dialogRefDel.afterClosed().subscribe(
      val => { this.getProductInfo() }
    );
  }

  getProductInfo() {
    return this.http.get<any>('api/ProductInformation').subscribe((data: productInfo[]) => {
      this.dataSource = data;
    });
  }
}

export interface productInfo {
  id: number;
  name: string;
  description: string;
}

@Component({
  selector: 'product-information-add',
  templateUrl: './product-information-add.component.html',
  styleUrls: ['./product-information.component.css']
})
export class ProductInfoAddDialog {
  formGroup: FormGroup;
  description: string;
  addData: productInfo;
  mode: string;
  constructor(
    private fb: FormBuilder, private http: HttpClient,
    private dialogRef: MatDialogRef<ProductInfoAddDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.mode = data.mode;
    this.formGroup = fb.group({
      name: [data.name, Validators.required],
      description: [data.description, Validators.required]
    });
  }

  save() {
    if (this.mode == "Add") {

      return this.http.post<productInfo>('api/ProductInformation', this.formGroup.value).subscribe((result: productInfo) => {
        this.dialogRef.close('success');
      }, error => console.error(error));
    }
    else {
      return this.http.put<productInfo>('api/ProductInformation/' + this.data.id, this.formGroup.value).subscribe((result: productInfo) => {
        this.close('success');
      }, error => console.error(error));

    }
  }

  close(result) {
    this.dialogRef.close(result);
  }
}

@Component({
  selector: 'product-information-delete',
  templateUrl: './product-information-delete.component.html',
})
export class ProductInfoDeleteDialog {
  constructor(
    private dialogRef: MatDialogRef<ProductInfoDeleteDialog>, private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
  confirmDelete() {
    return this.http.delete<any>('api/ProductInformation/' + this.data.deleteId).subscribe((result: any) => {
      this.close('success');
    }, error => console.error(error));
  }
  close(result) {
    this.dialogRef.close(result);
  }
}

@Component({
  selector: 'product-information-edit',
  templateUrl: './product-information-edit.component.html',
  styleUrls: ['./product-information.component.css']
})
export class ProductInfoEditDialog {
  editData: productInfo;
  formGroup: FormGroup;
  constructor(
    private dialogRef: MatDialogRef<ProductInfoEditDialog>, private http: HttpClient, fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.formGroup = fb.group({
      id: [this.data.id],
    });
  }

  onEdit() {
    this.editData = {
      id: this.data.id,
      name: this.data.name,
      description: this.data.description
    }
    return this.http.put<productInfo>('api/ProductInformation/' + this.data.id, this.editData).subscribe((result: productInfo) => {
      this.close('success');
    }, error => console.error(error));
  }
  close(result) {
    this.dialogRef.close(result);
  }
}

@Component({
  selector: 'product-information-view',
  templateUrl: './product-information-view.component.html',
  styleUrls: ['./product-information.component.css']
})
export class ProductInfoViewDialog {

  constructor(
    private dialogRef: MatDialogRef<ProductInfoViewDialog>, private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  close() {
    this.dialogRef.close();
  }
}
