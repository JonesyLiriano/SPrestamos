import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanGeneratorPage } from './loan-generator.page';

describe('LoanGeneratorPage', () => {
  let component: LoanGeneratorPage;
  let fixture: ComponentFixture<LoanGeneratorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanGeneratorPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanGeneratorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
