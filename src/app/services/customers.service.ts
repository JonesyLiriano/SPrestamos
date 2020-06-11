import { Injectable } from '@angular/core';
import { Customer } from '../models/customer';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  customersCollection: AngularFirestoreCollection<Customer>;
  limit = 15;
  public nextQueryAfter;
  allCustomerLoaded = false;

  constructor(private authService: AuthService, private afs: AngularFirestore) {
    this.customersCollection = this.afs.collection<Customer>('customers');
  }

  getCustomers(filter) {
    console.log('custoemr');
    if (this.nextQueryAfter) {
    return this.afs.collection<Customer>('customers', ref => ref.where(
      'uid', '==', this.authService.userAuthData.uid).orderBy('name')
      .startAt(filter).endAt(filter+ "\uf8ff").startAfter(this.nextQueryAfter).limit(this.limit))
      .snapshotChanges().pipe( 
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Customer;
          const idDoc = a.payload.doc.id;
          this.nextQueryAfter = a.payload.doc;          
          return { idDoc, ...data };
        }))
      );
    } else {
      return this.afs.collection<Customer>('customers', ref => ref.where(
        'uid', '==', this.authService.userAuthData.uid).orderBy('name')
        .startAt(filter).endAt(filter+ "\uf8ff").limit(this.limit))
        .snapshotChanges().pipe( 
          map(actions => actions.map(a => {
            const data = a.payload.doc.data() as Customer;
            const idDoc = a.payload.doc.id;
            this.nextQueryAfter = a.payload.doc;          
            return { idDoc, ...data };
          }))
        );
    }
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
