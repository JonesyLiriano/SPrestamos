import { Injectable } from '@angular/core';
import { Payment } from '../models/payment';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {
  paymentsCollection: AngularFirestoreCollection<Payment>;

  constructor(private afs: AngularFirestore) {
    this.paymentsCollection = this.afs.collection<Payment>('payments');
   }  

  createPayment(payment: Payment) {
    return this.paymentsCollection.add(payment);
  }  
}