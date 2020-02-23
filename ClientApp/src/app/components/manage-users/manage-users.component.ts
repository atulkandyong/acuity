import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent implements OnInit {
  userList: UserList[];
  roleList: any;
  displayedColumns: string[] = ['userName', 'fullName', 'role', 'status', 'actions'];

  constructor(public http: HttpClient, public dialog: MatDialog, private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.getUserList();
    this.getRoleList();
  }

  openAddDialog() {
    let dialogRefDel = this.dialog.open(UserAddDialog, {
      height: 'auto',
      width: '600px',
      data: {
        id: 0,
        userName: '',
        firstName: '',
        lastName: '',
        password: '',
        roles: this.roleList,
        userRole: null,
        isActive: true
      }
    });
    dialogRefDel.afterClosed().subscribe(
      val => {
        if (val == 'success') {
          this._snackBar.open('User added successfully');
          this.getUserList()
        }
      }
    );
  }

  openEditDialog(id, userName, firstName, lastName, password, isActive, userRole) {
    debugger;
    let dialogRefDel = this.dialog.open(UserEditDialog, {
      height: 'auto',
      width: '600px',
      data: {
        id: id,
        userName: userName,
        firstName: firstName,
        lastName: lastName,
        password: password,
        isActive: isActive == "Active" ? true : false,
        roles: this.roleList,
        userRole: userRole
      }
    });
    dialogRefDel.afterClosed().subscribe(
      val => {
        if (val == 'success') {
          this._snackBar.open('User saved successfully');
          this.getUserList()
        }
      }
    );
  }

  sendEmail(to, email, subject, message) {
    this.http.post('api/email', { to: to, email: email, subject: subject, message: message }).subscribe(() => {
      this._snackBar.open('Email sent successfully');
    },
      () => {
        this._snackBar.open('There was an error in sending the email');
      });
  }

  openDeleteDialog(id) {
    let dialogRefDel = this.dialog.open(UserDeleteDialog, { data: { deleteId: id } });
    dialogRefDel.afterClosed().subscribe(
      val => {
        if (val == 'success') {
          this._snackBar.open('User deleted successfully');
          this.getUserList()
        }
      }
    );
  }

  getRoleList() {
    this.http.get<any>('api/role').subscribe((data: any[]) => {
      this.roleList = data;
      console.log(this.roleList);
    });
  }

  getUserList() {
    return this.http.get<any>('user/manageUserList').subscribe((data: UserList[]) => {
      data.map(function (item) {
        item.isActive = item.isActive ? 'Active' : 'Inactive';
      })
      this.userList = data;
    });
  }
}

export interface UserList {
  id?: number,
  userName: string,
  firstName: string,
  lastName: string,
  password: string,
  isActive: string,
  userRole: number,
  role: number,
  email: string
}

@Component({
  selector: 'manage-users-add',
  templateUrl: './manage-users-add.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class UserAddDialog {
  formGroup: FormGroup;
  addData: UserList;
  todaysDataTime = '';
  showPassword: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<UserAddDialog>, private authService: AuthService, fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.formGroup = fb.group({
      id: [this.data.id],
      userName: [this.data.userName, Validators.required],
      firstName: [this.data.firstName, Validators.required],
      lastName: [this.data.lastName, Validators.required],
      password: [this.data.password, Validators.required],
      userRole: [this.data.userRole, Validators.required],
      isActive: [this.data.isActive]
    });
  }

  onAdd() {
    debugger;
    this.authService.register(this.formGroup.value.firstName, this.formGroup.value.lastName, this.formGroup.value.userName, this.formGroup.value.password, this.formGroup.value.userRole, this.formGroup.value.isActive)
      .subscribe(
        result => {
          if (result) {
            this.close('success');
            console.log(result);
          }
        });
  }

  close(result) {
    this.dialogRef.close(result);
  }
}

@Component({
  selector: 'manage-users-delete',
  templateUrl: './manage-users-delete.component.html'
})
export class UserDeleteDialog {
  constructor(
    private dialogRef: MatDialogRef<UserDeleteDialog>, private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
  confirmDelete() {
    return this.http.delete<any>('user/' + this.data.deleteId).subscribe(() => {
      this.close('success');
    }, error => console.error(error));
  }
  close(result) {
    this.dialogRef.close(result);
  }
}

@Component({
  selector: 'manage-users-edit',
  templateUrl: './manage-users-edit.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class UserEditDialog {
  formGroup: FormGroup;
  editData: UserList;
  showPassword: boolean = false;
  constructor(
    private dialogRef: MatDialogRef<UserEditDialog>, private http: HttpClient, fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.formGroup = fb.group({
      id: [this.data.id],
      userName: [this.data.userName, Validators.required],
      firstName: [this.data.firstName, Validators.required],
      lastName: [this.data.lastName, Validators.required],
      password: [this.data.password, Validators.required],
      role: [this.data.userRole.id, Validators.required],
      isActive: [this.data.isActive]
    });
  }

  onEdit() {
    return this.http.put<UserList>('user/' + this.data.id, this.formGroup.value, { responseType: 'text' as 'json' }).subscribe(() => {
      this.close('success');
    }, error => console.error(error));
  }
  close(result) {
    this.dialogRef.close(result);
  }
}
