import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from "@angular/material";
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
  isExpanded = false;
  userName: any;
  constructor(private dialog: MatDialog, private authService: AuthService, public router: Router) { }

  isAuthorized() {
    this.userName = this.authService.userDetail.name;
    return this.authService.isLoggedIn;
  }

  openDashboard() {
    this.authService.dashboardNavigate();
  }

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  openLoginDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.minWidth = 300;
    this.dialog.open(LoginComponent, dialogConfig);
  }

  openRegisterDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.minWidth = 300;
    this.dialog.open(RegisterComponent, dialogConfig);
  }

  SignOut() {
    this.authService.logout();
  }
}
