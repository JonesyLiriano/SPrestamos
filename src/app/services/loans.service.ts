import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Loan } from '../models/loan';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoansService {
  loansCollection: AngularFirestoreCollection<Loan> ;
  constructor(private afs: AngularFirestore, private authService: AuthService) {
    this.loansCollection = this.afs.collection<Loan>('loans');
  }

  getLoans(filter: string) {    
    return this.afs.collection<Loan>('loans', ref => {      
      let query : firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
      if (filter == 'active') { 
        query = query.where('uid', '==', this.authService.userAuthData.uid).where('state', '==', 'active')
      };
      if (filter == 'overdue') {
        query = query.where('uid', '==', this.authService.userAuthData.uid).where('overdue', '==', 'true') 
      };
      if (filter == 'settled') {
        query = query.where('uid', '==', this.authService.userAuthData.uid).where('state', '==', 'settled') 
      };
      if (filter == 'cancelled') {
        query = query.where('uid', '==', this.authService.userAuthData.uid).where('state', '==', 'cancelled')
      };
      return query;
    }).snapshotChanges().pipe(
      map(actions => actions.map( a => {
        const data = a.payload.doc.data() as Loan;
        const idDoc = a.payload.doc.id;
        return {idDoc, ...data };
      }))
    ); 
  }

  createLoan(loan: Loan) {    
    return this.loansCollection.add(loan);
  }
  
  updateLoan(loan: Loan) {
    return this.loansCollection.doc(loan.idDoc).update(loan);
  }
  
  getLoan(idDoc: string) {
    return this.loansCollection.doc(idDoc).get();
  }
}
