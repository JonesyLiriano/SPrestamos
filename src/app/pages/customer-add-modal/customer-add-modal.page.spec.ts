import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerAddModalPage } from './customer-add-modal.page';

describe('CustomerAddModalPage', () => {
  let component: CustomerAddModalPage;
  let fixture: ComponentFixture<CustomerAddModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerAddModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerAddModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
