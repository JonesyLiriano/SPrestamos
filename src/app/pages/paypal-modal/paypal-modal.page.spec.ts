import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaypalModalPage } from './paypal-modal.page';

describe('PaypalModalPage', () => {
  let component: PaypalModalPage;
  let fixture: ComponentFixture<PaypalModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaypalModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaypalModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
