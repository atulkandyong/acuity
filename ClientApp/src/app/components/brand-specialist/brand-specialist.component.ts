import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-brand-specialist',
  templateUrl: './brand-specialist.component.html',
  styleUrls: ['./brand-specialist.component.css']
})
export class BrandSpecialistComponent implements OnInit {
  ELEMENT_DATA: brandSpecialists[];
  displayedColumns: string[] = ['FirstName', 'LastName'];
  userIsActive: boolean;
  dataSource: brandSpecialists[];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private http: HttpClient, public dialog: MatDialog) { }

  ngOnInit() {
    this.getBrandSpecialists();
    this.userIsActive = true;
  }

  viewActiveUsers() {
    if (this.userIsActive) {
      this.userIsActive = false;
      this.getBrandSpecialists();
    } else {
      this.userIsActive = true;
      this.getBrandSpecialists();
    }
  }

  getBrandSpecialists() {
    return this.http.get<any>('api/BrandSpecialist').subscribe((data: brandSpecialists[]) => {
      var userIsActive = this.userIsActive;
      this.dataSource = data.filter(function (item) {
        return item.isActive == userIsActive;
      });
    });
  }
}

export interface brandSpecialists {
  id: number;
  firstName: string;
  lastName: string;
  isActive: boolean;
}
