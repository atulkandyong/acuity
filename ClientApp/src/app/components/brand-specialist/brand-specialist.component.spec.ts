import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandSpecialistComponent } from './brand-specialist.component';

describe('BrandSpecialistComponent', () => {
  let component: BrandSpecialistComponent;
  let fixture: ComponentFixture<BrandSpecialistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrandSpecialistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandSpecialistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
