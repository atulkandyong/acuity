import { Component, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material'
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private dialog: MatDialog, private snackBar: MatSnackBar,
    public authService: AuthService, public router: Router) { }
  username: string;
  password: string;
  errorMessage: boolean = false;
  showSpinner: boolean;

  ngOnInit() {
  }

  login = function () {
    this.authService.login(this.username, this.password)
      .subscribe(
        result => {
            this.dialog.closeAll();
            this.authService.updateUser();
            var userRole = JSON.parse(result).userRole[0];
            if (userRole != undefined) {
              if (userRole == 'Admin')
                this.router.navigate(['/home/campaign-list']);
              else if (userRole == 'State Manager')
                this.router.navigate(['/home/campaign-list']);
              else if (userRole == 'Brand Specialist')
                this.router.navigate(['/home/events']);
              else if (userRole == 'Supplier')
                this.router.navigate(['/home/campaign-list']);
            }
            else {
            this.router.navigate(['/landing']);
          }
          this.dialog.closeAll();
          this.authService.dashboardNavigate();
        },
        error => {
          this.errorMessage = true;
          // this.snackBar.openFromComponent('', '', {
          //   duration: 2000,
          // });
        });
  }
}
