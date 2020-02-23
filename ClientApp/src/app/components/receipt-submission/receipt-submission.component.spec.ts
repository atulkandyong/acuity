import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptSubmissionComponent } from './receipt-submission.component';

describe('ReceiptSubmissionComponent', () => {
  let component: ReceiptSubmissionComponent;
  let fixture: ComponentFixture<ReceiptSubmissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiptSubmissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiptSubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
