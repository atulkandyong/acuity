import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignBrandSpecialistDetailsComponent } from './campaign-brandSpecialist-details.component';

describe('CampaignBrandSpecialistDetailsComponent', () => {
  let component: CampaignBrandSpecialistDetailsComponent;
  let fixture: ComponentFixture<CampaignBrandSpecialistDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CampaignBrandSpecialistDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignBrandSpecialistDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
