import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentPayPeriodDetailComponent } from './current-pay-period-detail.component';

describe('CurrentPayPeriodDetailComponent', () => {
  let component: CurrentPayPeriodDetailComponent;
  let fixture: ComponentFixture<CurrentPayPeriodDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CurrentPayPeriodDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentPayPeriodDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
