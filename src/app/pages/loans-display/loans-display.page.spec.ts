import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoansDisplayPage } from './loans-display.page';

describe('LoansDisplayPage', () => {
  let component: LoansDisplayPage;
  let fixture: ComponentFixture<LoansDisplayPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoansDisplayPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoansDisplayPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
