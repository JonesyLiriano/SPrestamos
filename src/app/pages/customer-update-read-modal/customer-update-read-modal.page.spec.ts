import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerUpdateReadModalPage } from './customer-update-read-modal.page';

describe('CustomerUpdateReadModalPage', () => {
  let component: CustomerUpdateReadModalPage;
  let fixture: ComponentFixture<CustomerUpdateReadModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerUpdateReadModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerUpdateReadModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
