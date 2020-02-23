import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-current-pay-period',
  templateUrl: './current-pay-period.component.html',
  styleUrls: ['./current-pay-period.component.css']
})
export class CurrentPayPeriodComponent implements OnInit {
  dataSource: any[];
  userList: any;
  userBsList: any;
  userSpList: any;
  campaignId: any;
  userId: any;
  displayedColumns: string[] = ['name', 'compensation', 'receipts', 'receiptsum', 'totalDue'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private http: HttpClient, private authService: AuthService) { }

  ngOnInit() {
    this.userId = this.authService.userDetail.userId;
    this.getEventList();
  }

  getEventList() {
    return this.http.get<any>('api/eventswithreceipt').subscribe((data: any[]) => {
      this.dataSource = data;
      var _this = this;
      this.dataSource.map(function (item) {
        if (item.totalDue) {
          item.totalDue = '$ ' + _this.currencyFormat(item.totalDue);
        }
        if (item.receiptSum) {
          item.receiptSum = '$ ' + _this.currencyFormat(item.receiptSum);
        }
        if (item.compensation) {
          item.compensation = '$ ' + _this.currencyFormat(item.compensation);
        }
      });
    });
  }

  currencyFormat(value) {
    return Number(value).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
}
