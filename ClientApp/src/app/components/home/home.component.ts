import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['home.component.css']
})
export class HomeComponent {
  roleBs: boolean;
  roleAdmin: boolean;
  roleSm: boolean;
  roleSp: boolean;
  public pageTitle: string;
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(private router: Router, public http: HttpClient, changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private authService: AuthService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    this.checkRole();
  }

  checkRole() {
    var role = this.authService.userDetail.role;
    this.roleBs = false;
    this.roleAdmin = false;
    this.roleSp = false;
    this.roleSm = false;
    if (role == 'Admin') {
      this.roleAdmin = true;
    } else if (role == 'State Manager') {
      this.roleSm = true;
    } else if (role == 'Supplier') {
      this.roleSp = true;
    } else if (role == 'Brand Specialist') {
      this.roleBs = true;
    }
  }

  onRouterActivate(e) {
    if (this.router.url.includes('/home/campaign-list')) {
      this.pageTitle = 'Campaigns';
    }
    else if (this.router.url.includes('/home/campaigns')) {
      this.pageTitle = 'Campaigns';
    }
    else if (this.router.url.includes('/home/event-list')) {
      this.pageTitle = 'Events';
    }
    else if (this.router.url.includes('/home/brand-specialist-details')) {
        this.pageTitle = 'Brand Specialist Details';
    }
    else if (this.router.url.includes('/home/campaign-brandspecialist-details')) {
        this.pageTitle = 'Brand Specialist Campaign Details';
    }
    else if (this.router.url.includes('/home/brand-specialist')) {
        this.pageTitle = 'Brand Specialists';
    }
    else if (this.router.url.includes('/home/events')) {
      this.pageTitle = 'Events';
    }
    else if (this.router.url.includes('/home/submission-event-detail')) {
      this.pageTitle = 'Event Submission Details';
    }
    else if (this.router.url.includes('/home/submission')) {
      this.pageTitle = 'Event Submissions';
    }
    else if (this.router.url.includes('/home/manage-user')) {
      this.pageTitle = 'Manage Users';
    }
    else if (this.router.url.includes('/home/messages')) {
      this.pageTitle = 'Messages';
    }
    else if (this.router.url.includes('/home/alcohol101')) {
      this.pageTitle = 'Alcohol 101';
    }
    else if (this.router.url.includes('/home/products')) {
      this.pageTitle = 'Products';
    }
    else if (this.router.url.includes('/home/current-pay-period')) {
      this.pageTitle = 'Current Pay Period';
    }
    else if (this.router.url.includes('/home/receipt-events')) {
      this.pageTitle = 'Receipt Submissions';
    }
    else if (this.router.url.includes('/home/receipt-submission')) {
      this.pageTitle = 'Receipt Submission Detail';
    }
    else if (this.router.url.includes('/home/calendar')) {
      this.pageTitle = 'Calendar';
    }
    else if (this.router.url.includes('/home/event-detail')) {
      this.http.get<any>('api/event/' + this.router.url.split('/')[3]).subscribe((data: any) => {
        this.pageTitle = 'Event - ' + data.name;
      });
      this.pageTitle = 'Event';
    }
    else {
      this.pageTitle = '';
    }
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
