import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoansHistoryPage } from './loans-history.page';

describe('LoansHistoryPage', () => {
  let component: LoansHistoryPage;
  let fixture: ComponentFixture<LoansHistoryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoansHistoryPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoansHistoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
