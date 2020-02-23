import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompensationDueDetailComponent } from './compensation-due-detail.component';

describe('CompensationDueDetailComponent', () => {
  let component: CompensationDueDetailComponent;
  let fixture: ComponentFixture<CompensationDueDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CompensationDueDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompensationDueDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
