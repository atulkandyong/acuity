import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandSpecialistDetailsComponent } from './brand-specialist-details.component';

describe('BrandSpecialistDetailsComponent', () => {
  let component: BrandSpecialistDetailsComponent;
  let fixture: ComponentFixture<BrandSpecialistDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrandSpecialistDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandSpecialistDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
