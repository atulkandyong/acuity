import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentPayPeriodComponent } from './current-pay-period.component';

describe('CurrentPayPeriodComponent', () => {
  let component: CurrentPayPeriodComponent;
  let fixture: ComponentFixture<CurrentPayPeriodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentPayPeriodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentPayPeriodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
