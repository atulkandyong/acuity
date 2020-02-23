import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsBrandSpecialistComponent } from './events-brandSpecialist.component';

describe('EventsBrandSpecialistComponent', () => {
  let component: EventsBrandSpecialistComponent;
  let fixture: ComponentFixture<EventsBrandSpecialistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EventsBrandSpecialistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsBrandSpecialistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
