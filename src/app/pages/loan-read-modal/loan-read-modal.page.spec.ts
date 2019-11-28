import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanReadModalPage } from './loan-read-modal.page';

describe('LoanReadModalPage', () => {
  let component: LoanReadModalPage;
  let fixture: ComponentFixture<LoanReadModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanReadModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanReadModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
