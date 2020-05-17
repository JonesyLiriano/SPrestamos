import { Injectable } from '@angular/core';
import { Customer } from '../models/customer';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'
import { delay } from 'q';


@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  customersCollection: AngularFirestoreCollection<Customer>;
  constructor(private authService: AuthService, private afs: AngularFirestore) {
    this.customersCollection = this.afs.collection<Customer>('customers');
  }

  getCustomers() {
    return this.afs.collection<Customer>('customers', ref => ref.where(
      'uid', '==', this.authService.userAuthData.uid)).snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Customer;
          const idDoc = a.payload.doc.id;
          return { idDoc, ...data };
        }))
      );
  }

  createCustomer(customer: Customer) {
    return this.customersCollection.add(customer);
  }


  updateCustomer(idDoc: string,customer: Customer) {
    console.log(customer);
    return this.customersCollection.doc(idDoc).update(customer);
  }

  deleteCustomer(customer: Customer) {
    return this.customersCollection.doc(customer.idDoc).delete();
  }

  getCustomer(idDoc: string) {
    return this.customersCollection.doc(idDoc).get();
  }

}
