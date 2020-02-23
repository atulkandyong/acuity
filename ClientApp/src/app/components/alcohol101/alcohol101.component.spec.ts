import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Alcohol101Component } from './alcohol101.component';

describe('Alcohol101Component', () => {
  let component: Alcohol101Component;
  let fixture: ComponentFixture<Alcohol101Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [Alcohol101Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Alcohol101Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
