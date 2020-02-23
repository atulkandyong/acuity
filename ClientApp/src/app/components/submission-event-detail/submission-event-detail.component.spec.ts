import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmissionEventDetailComponent } from './submission-event-detail.component';

describe('SubmissionEventDetailComponent', () => {
  let component: SubmissionEventDetailComponent;
  let fixture: ComponentFixture<SubmissionEventDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SubmissionEventDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmissionEventDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
