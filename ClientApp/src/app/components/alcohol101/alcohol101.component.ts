import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatSnackBar } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-messages',
  templateUrl: './alcohol101.component.html',
  styleUrls: ['./alcohol101.component.css']
})
export class Alcohol101Component implements OnInit {
  articleList: articleList;
  alcoholcategoryData: any;
  userList: any;
  userBsList: any;
  userSpList: any;
  campaignId: any;
  userId: any;
  displayedColumns: string[] = ['name', 'description', 'alcoholCategoryId', 'userName', 'createdOn', 'actions'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private http: HttpClient, private authService: AuthService, public dialog: MatDialog, private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.userId = this.authService.userDetail.userId;
    this.getArticleList();
    this.getAlcoholCategoryList();
  }

  openAddDialog() {
    let dialogRefDel = this.dialog.open(Alcohol101AddDialog, {
      data: {
        id: 0,
        name: "",
        description: "",
        alcoholCategory: "",
        alcoholCategoryList: this.alcoholcategoryData,
        userName: this.userId,
        createdOn: ""
      }
    });
    dialogRefDel.afterClosed().subscribe(
      val => {
        if (val == 'success') {
          this._snackBar.open('Added successfully');
          this.getArticleList();
        }
      }
    );
  }

  openViewDialog(name, description, createdOn) {
    let dialogRefDel = this.dialog.open(Alcohol101ViewDialog, {
      data: {
        name: name,
        description: description,
        createdOn: createdOn
      }
    });
    dialogRefDel.afterClosed().subscribe(
      val => { this.getArticleList() }
    );
  }

  openDeleteDialog(id) {
    let dialogRefDel = this.dialog.open(ConfirmDialogComponent, { data: { deleteId: id } });
    dialogRefDel.afterClosed().subscribe(
      val => {
        if (val == 'confirm') {
          this.http.delete<any>('api/article/' + id).subscribe((result: any) => {
            this._snackBar.open('Article deleted successfully');
            this.getArticleList()
          }, error => console.error(error));
        }
      }
    );
  }

  getArticleList() {
    return this.http.get<any>('api/article').subscribe((data: articleList) => {
      
      this.articleList = data;
    });
  }

  getAlcoholCategoryList() {
    return this.http.get<any>('api/alcoholcategory').subscribe((data: alcoholcategory[]) => {
      this.alcoholcategoryData = data;
    });
  }
}

export interface articleList {
  id: number,
  name: string,
  description: string,
  alcoholCategoryId: number,
  userId: number
}

export interface alcoholcategory {
  id: number,
  name: string,
  description: string,
}

@Component({
  selector: 'alcohol101-add',
  templateUrl: './alcohol101-add.component.html',
})
export class Alcohol101AddDialog {
  formGroup: FormGroup;
  addData: articleList;

  constructor(
    private dialogRef: MatDialogRef<Alcohol101AddDialog>, private http: HttpClient, fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.formGroup = fb.group({
      id: [this.data.id],
      name: [this.data.name,Validators.required],
      description: [this.data.description, Validators.required],
      alcoholCategoryId: [this.data.alcoholCategory, Validators.required]
    });
  }

  onAdd() {
    return this.http.post<articleList>('api/article', this.formGroup.value).subscribe((result: articleList) => {
      this.close('success');
    }, error => console.error(error));
  }
  close(result) {
    this.dialogRef.close(result);
  }
}

@Component({
  selector: 'alcohol101-delete',
  templateUrl: './alcohol101-delete.component.html',
})
export class Alcohol101DeleteDialog {
  constructor(
    private dialogRef: MatDialogRef<Alcohol101DeleteDialog>, private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
  confirmDelete() {
    return this.http.delete<any>('api/article/' + this.data.deleteId).subscribe((result: any) => {
      this.close('success');
    }, error => console.error(error));
  }
  close(result) {
    this.dialogRef.close(result);
  }
}

@Component({
  selector: 'alcohol101-view',
  templateUrl: './alcohol101-view.component.html',
})
export class Alcohol101ViewDialog {
  constructor(
    private dialogRef: MatDialogRef<Alcohol101ViewDialog>, private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  close() {
    this.dialogRef.close();
  }
}
