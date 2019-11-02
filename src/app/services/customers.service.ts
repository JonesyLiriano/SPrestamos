import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Customer } from '../models/customer';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {
  private customers$: Subject<any>;

  constructor() {
    this.customers$ = new Subject();
  }

  getCustomers() {    
  }

  createCustomer(customer: Customer) {
  }

  updateCustomer(customer: Customer) {
  }

  deleteCustomer(customer: Customer) {
  }

  getCustomerName(id: number) {
  }

}
