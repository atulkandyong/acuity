import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignsSupplierComponent } from './campaigns-supplier.component';

describe('CampaignsSupplierComponent', () => {
  let component: CampaignsSupplierComponent;
  let fixture: ComponentFixture<CampaignsSupplierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CampaignsSupplierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignsSupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
