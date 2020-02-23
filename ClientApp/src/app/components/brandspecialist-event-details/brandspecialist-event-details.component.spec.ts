import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandspecialistEventDetailsComponent } from './brandspecialist-event-details.component';

describe('BrandspecialistEventDetailsComponent', () => {
  let component: BrandspecialistEventDetailsComponent;
  let fixture: ComponentFixture<BrandspecialistEventDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrandspecialistEventDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandspecialistEventDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
