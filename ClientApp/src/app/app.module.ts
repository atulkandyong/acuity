import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './components/nav-menu/nav-menu.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './components/home/home.component';
import { FooterComponent } from './components/footer/footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule, MatCardModule, MatDialogModule, MatInputModule, MatTableModule,
  MatToolbarModule, MatMenuModule, MatIconModule, MatProgressSpinnerModule, MatCheckboxModule,
  MatSnackBarModule, MatSidenavModule, MatListModule, MatPaginatorModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule, MatSlideToggleModule, MatTabsModule, MAT_SNACK_BAR_DEFAULT_OPTIONS
} from '@angular/material';
import { AuthService } from './services/auth.service';
import { AuthHeaderInterceptor } from './interceptors/http.interceptor';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { LandingComponent } from './components/landing/landing.component';
import { CampaignListComponent} from './components/campaign-list/campaign-list.component';
import { CampaignsSupplierComponent } from './components/campaigns-supplier/campaigns-supplier.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { AddUnavailabilityDialog } from './components/calendar/add-unavailability.component'
import { BrandSpecialistComponent } from './components/brand-specialist/brand-specialist.component';
import { SubmissionsComponent } from './components/submissions/submissions.component';
import { ManageUsersComponent, UserAddDialog, UserDeleteDialog, UserEditDialog } from './components/manage-users/manage-users.component';
import { EventListComponent, EventAddDialog } from './components/event-list/event-list.component';
import { EventsBrandSpecialistComponent } from './components/events-brandSpecialist/events-brandSpecialist.component';
import { EventsSupplierComponent, CampaignMetricsDialog } from './components/events-supplier/events-supplier.component';
import { EventDetailComponent, EventUploadRecap, EventUploadPhoto, EventDeleteFile, UpdateEventMetric } from './components/event-detail/event-detail.component';
import { CurrentPayPeriodDetailComponent, PayPeriodPhoto, PayPeriodDeleteFile } from './components/current-pay-period-detail/current-pay-period-detail.component';
import { SubmissionEventDetailComponent } from './components/submission-event-detail/submission-event-detail.component';
import { CurrentPayPeriodComponent } from './components/current-pay-period/current-pay-period.component';
import { ProductInformationComponent, ProductInfoAddDialog, ProductInfoDeleteDialog, ProductInfoEditDialog, ProductInfoViewDialog } from './components/product-information/product-information.component';
import { Alcohol101Component, Alcohol101AddDialog, Alcohol101DeleteDialog, Alcohol101ViewDialog } from './components/alcohol101/alcohol101.component';
import { MessagesComponent, MessageDeleteDialog, MessageAddDialog, MessageViewDialog } from './components/messages/messages.component';
import { ReceiptEventsComponent } from './components/receipt-events/receipt-events.component';
import { BrandspecialistEventDetailsComponent } from './components/brandspecialist-event-details/brandspecialist-event-details.component';
import { ReceiptSubmissionComponent, ReceiptUpload, ReceiptDeleteFile } from './components/receipt-submission/receipt-submission.component';
import { BrandSpecialistDetailsComponent } from './components/brand-specialist-details/brand-specialist-details.component';
import { CampaignDetailsComponent } from './components/campaign-details/campaign-details.component';
import { CompensationDueDetailComponent } from './components/compensation-due-detail/compensation-due-detail.component';
import { CampaignBrandSpecialistDetailsComponent } from './components/campaign-brandSpecialist-details/campaign-brandSpecialist-details.component';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { EmailService } from './services/email.service';
import { AngularDateHttpInterceptor } from './interceptors/AngularDateHttpInterceptor';
import { registerLocaleData } from '@angular/common';
//import localeUs from '@angular/common/locales/es-US';
//registerLocaleData(localeUs, 'en-US');
import { MatDatetimepickerModule, MatNativeDatetimeModule } from "@mat-datetimepicker/core";
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    FooterComponent,
    LoginComponent,
    RegisterComponent,
    LandingComponent,
    CampaignListComponent,
    CampaignsSupplierComponent,
    CalendarComponent,
    AddUnavailabilityDialog,
    BrandSpecialistComponent,
    SubmissionsComponent,
    ManageUsersComponent,
    UserAddDialog,
    UserDeleteDialog,
    UserEditDialog,
    EventListComponent,
    EventAddDialog,
    EventDetailComponent,
    EventUploadRecap,
    EventUploadPhoto,
    EventDeleteFile,
    UpdateEventMetric,
    EventsBrandSpecialistComponent,
    EventsSupplierComponent,
    CampaignMetricsDialog,
    CurrentPayPeriodDetailComponent,
    PayPeriodPhoto,
    PayPeriodDeleteFile,
    SubmissionEventDetailComponent,
    ConfirmDialogComponent,
    CurrentPayPeriodComponent,
    ProductInformationComponent,
    ProductInfoAddDialog,
    ProductInfoEditDialog,
    ProductInfoViewDialog,
    ProductInfoDeleteDialog,
    Alcohol101Component,
    Alcohol101AddDialog,
    Alcohol101DeleteDialog,
    Alcohol101ViewDialog,
    MessagesComponent,
    MessageDeleteDialog,
    MessageAddDialog,
    MessageViewDialog,
    ReceiptSubmissionComponent,
    ReceiptUpload,
    ReceiptDeleteFile,
    ReceiptEventsComponent,
    BrandspecialistEventDetailsComponent,
    BrandSpecialistDetailsComponent,
    CampaignDetailsComponent,
    CompensationDueDetailComponent,
    CampaignBrandSpecialistDetailsComponent
  ],
  entryComponents: [ProductInfoAddDialog, ProductInfoEditDialog, ProductInfoViewDialog, ProductInfoDeleteDialog, CampaignListComponent, EventListComponent, EventAddDialog, ManageUsersComponent, UserAddDialog, UserDeleteDialog, UserEditDialog, SubmissionEventDetailComponent, ConfirmDialogComponent, EventDetailComponent, EventUploadRecap, EventUploadPhoto, EventDeleteFile, UpdateEventMetric, CurrentPayPeriodDetailComponent, PayPeriodPhoto, PayPeriodDeleteFile, ReceiptSubmissionComponent, ReceiptUpload, ReceiptDeleteFile, EventsSupplierComponent, CampaignMetricsDialog, MessagesComponent, MessageDeleteDialog, MessageAddDialog, MessageViewDialog, Alcohol101Component, Alcohol101AddDialog, Alcohol101DeleteDialog, Alcohol101ViewDialog, CampaignDetailsComponent, AddUnavailabilityDialog, BrandSpecialistDetailsComponent],
  imports: [
    BrowserAnimationsModule,
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    MatButtonModule, MatCardModule, MatDialogModule, MatInputModule, MatTableModule,
    MatToolbarModule, MatMenuModule, MatIconModule, MatProgressSpinnerModule, MatCheckboxModule,
    MatSnackBarModule, MatSidenavModule, MatListModule, MatPaginatorModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule, MatSlideToggleModule, MatTabsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    // MatDatepickerModule,
    // use this if you want to use native javascript dates and INTL API if available
    MatNativeDatetimeModule,
    MatDatetimepickerModule,
    // MatMomentDatetimeModule,
    // MatDatetimepickerModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    })
  ],
  providers: [AuthService, EmailService, //ScreenService, AppInfoService, DeactivateGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHeaderInterceptor,
      multi: true,
    },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        duration: 2000,
        verticalPosition: 'bottom',
        horizontalPosition: 'right'
      }
    },
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: AngularDateHttpInterceptor,
    //   multi: true,
    // },
    { provide: LOCALE_ID, useValue: "en-US" }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
