import { Component, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material'
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private dialog: MatDialog, private snackBar: MatSnackBar,
      public authService: AuthService, public router: Router) { }
    firstName: string;
    lastName: string;
    userName: string;
    password: string;
    userRole: number = 1;
    isActive: boolean = true;
    errorMessage: boolean = false;
    showSpinner: boolean;

  ngOnInit() {
  }

  onAdd() {
    debugger;
    this.authService.register(this.firstName, this.lastName, this.userName, this.password, this.userRole, this.isActive)
    .subscribe(
      result => {
       if (result) {
       console.log(result);
      }
    });
    }
}
