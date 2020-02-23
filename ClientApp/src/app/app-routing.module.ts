import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { LandingComponent } from './components/landing/landing.component';
import { AuthGuardService } from './services/auth.service';
import { CampaignListComponent } from './components/campaign-list/campaign-list.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { BrandSpecialistComponent } from './components/brand-specialist/brand-specialist.component';
import { EventListComponent } from './components/event-list/event-list.component';
import { EventDetailComponent } from './components/event-detail/event-detail.component';
import { SubmissionEventDetailComponent } from './components/submission-event-detail/submission-event-detail.component';
import { SubmissionsComponent } from './components/submissions/submissions.component';
import { ManageUsersComponent } from './components/manage-users/manage-users.component';
import { CurrentPayPeriodComponent } from './components/current-pay-period/current-pay-period.component';
import { EventsBrandSpecialistComponent } from './components/events-brandSpecialist/events-brandSpecialist.component';
import { EventsSupplierComponent } from './components/events-supplier/events-supplier.component';
import { CurrentPayPeriodDetailComponent } from './components/current-pay-period-detail/current-pay-period-detail.component';
import { ReceiptEventsComponent } from './components/receipt-events/receipt-events.component';
import { ReceiptSubmissionComponent } from './components/receipt-submission/receipt-submission.component';
import { ProductInformationComponent } from './components/product-information/product-information.component';
import { CampaignsSupplierComponent } from './components/campaigns-supplier/campaigns-supplier.component';
import { MessagesComponent } from './components/messages/messages.component';
import { Alcohol101Component } from './components/alcohol101/alcohol101.component';
import { BrandSpecialistDetailsComponent } from './components/brand-specialist-details/brand-specialist-details.component';
import { CampaignDetailsComponent } from './components/campaign-details/campaign-details.component';
import { CompensationDueDetailComponent } from './components/compensation-due-detail/compensation-due-detail.component';
import { CampaignBrandSpecialistDetailsComponent } from './components/campaign-brandSpecialist-details/campaign-brandSpecialist-details.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AuthGuardService],
    },
    {
     path: 'register',
     component: RegisterComponent,
     canActivate: [AuthGuardService],
    },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuardService],
    children: [
      { path: 'campaign-list', component: CampaignListComponent },
      { path: 'campaigns', component: CampaignsSupplierComponent },
      { path: 'calendar', component: CalendarComponent },
      { path: 'event-list', component: EventListComponent },
      { path: 'event-list/:campaignId', component: EventListComponent },
      { path: 'order-page', component: BrandSpecialistComponent },
      { path: 'brand-specialist-details/:userId', component: BrandSpecialistDetailsComponent },
      { path: 'event-detail', component: EventDetailComponent },
      { path: 'event-detail/:eventId', component: EventDetailComponent },
      { path: 'current-pay-period-detail/:eventId', component: CurrentPayPeriodDetailComponent },
      { path: 'submission', component: SubmissionsComponent },
      { path: 'manage-user', component: ManageUsersComponent },
      { path: 'submission-event-detail/:eventId', component: SubmissionEventDetailComponent },
      { path: 'current-pay-period', component: CurrentPayPeriodComponent },
      { path: 'events', component: EventsBrandSpecialistComponent },
      { path: 'receipt-events', component: ReceiptEventsComponent },
      { path: 'receipt-submission/:eventId', component: ReceiptSubmissionComponent },
      { path: 'products', component: ProductInformationComponent },
      { path: 'events-supplier/:campaignId', component: EventsSupplierComponent },
      { path: 'service', component: CampaignDetailsComponent },
      { path: 'alcohol101', component: Alcohol101Component },
      { path: 'messages', component: MessagesComponent },
      { path: 'compensation-due-detail/:eventId', component: CompensationDueDetailComponent },
      { path: 'campaign-brandspecialist-details/:campaignId', component: CampaignBrandSpecialistDetailsComponent }
    ]
  },
  {
    path: 'landing',
    component: LandingComponent,
  },
  {
    path: '**',
    component: LandingComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [AuthGuardService],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule { }
