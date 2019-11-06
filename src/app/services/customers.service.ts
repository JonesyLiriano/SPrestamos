import { Injectable } from '@angular/core';
import { Customer } from '../models/customer';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'


@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  customersCollection: AngularFirestoreCollection<Customer> ;
  customers$: Observable<Array<Customer>>;
  uid: string;
  constructor(private afs: AngularFirestore, authService: AuthService) {
    this.uid = authService.userAuthData.uid;
    this.customersCollection = this.afs.collection('customers', ref => ref.where('uid', '==', this.uid));
    this.customers$ = this.customersCollection.snapshotChanges().pipe(
      map(actions => actions.map( a => {
        const data = a.payload.doc.data() as Customer;
        const idDoc = a.payload.doc.id;
        return {idDoc, ...data };
      }))
    ); 
  }

  getCustomers() {    
    return this.customers$;
  }

  async createCustomer(customer: Customer) {    
    var newCustomerRef = this.customersCollection.ref.doc();
    customer.id = newCustomerRef.id   
    return newCustomerRef.set(customer);
  }
  

  updateCustomer(customer: Customer) {
    return this.customersCollection.doc(customer.id).update(customer);
  }

  deleteCustomer(customer: Customer) {
    return this.customersCollection.doc(customer.id).delete();
  }

  getCustomer(id: string) {
    return this.customersCollection.doc(id).get();
  }

}
