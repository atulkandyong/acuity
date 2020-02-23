import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsSupplierComponent } from './events-supplier.component';

describe('EventsSupplierComponent', () => {
  let component: EventsSupplierComponent;
  let fixture: ComponentFixture<EventsSupplierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EventsSupplierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsSupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
