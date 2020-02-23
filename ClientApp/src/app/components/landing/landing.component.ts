import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'landing',
  templateUrl: './landing.component.html',
  styleUrls: ['landing.component.css']
})
export class LandingComponent {
  to: string;
  email: string;
  message: string;
  emailSend: boolean;
  constructor(public http: HttpClient, private _snackBar: MatSnackBar) {
    this.emailSend = false;
  }

  ngOnInit() {
  }

  /**
   * Process the form we have. Send to whatever backend
   * Only alerting for now
   */
  processForm(): void {
    debugger;
    this.http.post('api/email/contact', { to: this.to, email: this.email, subject: '', message: this.message }).subscribe(() => {
      this.emailSend = true;
      this._snackBar.open('Email sent successfully');
    },
      () => {
        this._snackBar.open('There was an error in sending the email');
      });
  }
}
