import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Southern Flair Promo';
  
  constructor(private authService: AuthService) { }

  isAuthorized() {
    return this.authService.isLoggedIn;
  }
}
