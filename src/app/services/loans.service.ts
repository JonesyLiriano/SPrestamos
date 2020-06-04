import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Loan } from '../models/loan';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';
import { LoanDetails } from '../models/loanDetails';

@Injectable({
  providedIn: 'root'
})
export class LoansService {

  loansCollection: AngularFirestoreCollection<Loan>;
  limit = 10;
  public nextQueryAfter;
  constructor(private afs: AngularFirestore, private authService: AuthService) {
    this.loansCollection = this.afs.collection<Loan>('loans');
  }

  getLoans(filter: string, search: string) {
    return this.afs.collection<Loan>('loans', ref => {
      let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
      if (filter == 'active') {
        if (this.nextQueryAfter) {
        query = query.where('uid', '==', this.authService.userAuthData.uid).where('status', '==', 'active')
        .where('overdue', '==', false).orderBy('customer').orderBy('loanAmount', 'desc').startAt(search).endAt(search+ "\uf8ff")
        .startAfter(this.nextQueryAfter).limit(this.limit)
        } else {
          query = query.where('uid', '==', this.authService.userAuthData.uid).where('status', '==', 'active')
          .where('overdue', '==', false).orderBy('customer').orderBy('loanAmount', 'desc').startAt(search).endAt(search+ "\uf8ff")
          .limit(this.limit)
        }
      };
      if (filter == 'allActive') {
        query = query.where('uid', '==', this.authService.userAuthData.uid).where('status', '==', 'active')
      };
      if (filter == 'all') {
        query = query.where('uid', '==', this.authService.userAuthData.uid).where('status', 'in', ['active', 'settled'])
      };
      if (filter == 'overdue') {
        if (this.nextQueryAfter) {
        query = query.where('uid', '==', this.authService.userAuthData.uid).where('overdue', '==', true)
        .where('status', '==', 'active').orderBy('customer').orderBy('loanAmount', 'desc').startAt(search).endAt(search+ "\uf8ff")
        .startAfter(this.nextQueryAfter).limit(this.limit)
        } else {
          query = query.where('uid', '==', this.authService.userAuthData.uid).where('overdue', '==', true)
        .where('status', '==', 'active').orderBy('customer').orderBy('loanAmount', 'desc').startAt(search).endAt(search+ "\uf8ff")
        .limit(this.limit)
        }
      };
      if (filter == 'settled') {
        if (this.nextQueryAfter) {
        query = query.where('uid', '==', this.authService.userAuthData.uid).where('status', '==', 'settled')
        .orderBy('customer').orderBy('loanAmount', 'desc').startAt(search).endAt(search+ "\uf8ff").startAfter(this.nextQueryAfter)
        .limit(this.limit)
        } else {
          query = query.where('uid', '==', this.authService.userAuthData.uid).where('status', '==', 'settled')
          .orderBy('customer').orderBy('loanAmount', 'desc').startAt(search).endAt(search+ "\uf8ff").limit(this.limit)
        }
      };
      if (filter == 'cancelled') {
        if (this.nextQueryAfter) {
        query = query.where('uid', '==', this.authService.userAuthData.uid).where('status', '==', 'cancelled')
        .orderBy('customer').orderBy('loanAmount', 'desc').startAt(search).endAt(search+ "\uf8ff").startAfter(this.nextQueryAfter)
        .limit(this.limit)
        } else {
          query = query.where('uid', '==', this.authService.userAuthData.uid).where('status', '==', 'cancelled')
        .orderBy('customer').orderBy('loanAmount', 'desc').startAt(search).endAt(search+ "\uf8ff").limit(this.limit)
        }
      };
      return query;
    }).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Loan;
        const idDoc = a.payload.doc.id;
        this.nextQueryAfter = a.payload.doc; 
        return { idDoc, ...data };
      }))
    );
  }

  createLoan(loan: Loan) {
    return this.loansCollection.add(loan);
  }

  addLoanDetails(loanId: string, loanDetails: LoanDetails) {
    return this.loansCollection.doc(loanId).collection('loanDetail').add(loanDetails);
  }

  updateLoanDetails(loanId: string, loanDetail: LoanDetails) {
    return this.loansCollection.doc(loanId).collection('loanDetail').doc(loanDetail.idDoc).update(loanDetail);
  }

  updateLoan(loan: Loan) {
    return this.loansCollection.doc(loan.idDoc).update(loan);
  }

  getLoanDetail(idDoc: string) {
    return this.loansCollection.doc(idDoc).collection('loanDetail').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as LoanDetails;
        const idDoc = a.payload.doc.id;
        return { idDoc, ...data };
      }))
    );
  }
}
