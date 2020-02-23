import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptEventsComponent } from './receipt-events.component';

describe('ReceiptEventsComponent', () => {
  let component: ReceiptEventsComponent;
  let fixture: ComponentFixture<ReceiptEventsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReceiptEventsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiptEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
