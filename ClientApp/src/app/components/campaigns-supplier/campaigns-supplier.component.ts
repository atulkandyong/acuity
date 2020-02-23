import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-campaigns-supplier',
  templateUrl: './campaigns-supplier.component.html',
  styleUrls: ['./campaigns-supplier.component.css']
})
export class CampaignsSupplierComponent implements OnInit {

  ELEMENT_DATA: campaignList[];
  displayedColumns: string[] = ['name', 'description'];
  dataSource: campaignList[];
  userId: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private http: HttpClient, private authService: AuthService) { }

  ngOnInit() {
    this.userId = this.authService.userDetail.userId;
    this.getCampaignList();
  }

  getCampaignList() {
    return this.http.get<any>('api/campaign/getSupplierCampaigns/' + this.userId).subscribe((data: campaignList[]) => {
      this.dataSource = data;
    });
  }
}

export interface campaignList {
  id: number;
  name: string;
  description: string;
  createdOn: string;
}
