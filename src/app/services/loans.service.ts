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
  constructor(private afs: AngularFirestore, private authService: AuthService) {
    this.loansCollection = this.afs.collection<Loan>('loans');
  }

  getLoans(filter: string) {
    return this.afs.collection<Loan>('loans', ref => {
      let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
<<<<<<< HEAD
      if (filter['value'] == 'active') {
        query = query.where('uid', '==', this.authService.userAuthData.uid).where('state', '==', 'active')
      };
      if (filter['value'] == 'overdue') {
        query = query.where('uid', '==', this.authService.userAuthData.uid).where('overdue', '==', 'true')
      };
      if (filter['value'] == 'settled') {
        query = query.where('uid', '==', this.authService.userAuthData.uid).where('state', '==', 'settled')
      };
      if (filter['value'] == 'cancelled') {
        query = query.where('uid', '==', this.authService.userAuthData.uid).where('state', '==', 'cancelled')
=======
      if (filter == 'active') {
        query = query.where('uid', '==', this.authService.userAuthData.uid).where('status', '==', 'active')
      };
      if (filter == 'overdue') {
        query = query.where('uid', '==', this.authService.userAuthData.uid).where('overdue', '==', true)
        .where('status', '==', 'active')
      };
      if (filter == 'settled') {
        query = query.where('uid', '==', this.authService.userAuthData.uid).where('status', '==', 'settled')
      };
      if (filter == 'cancelled') {
        query = query.where('uid', '==', this.authService.userAuthData.uid).where('status', '==', 'cancelled')
>>>>>>> calculator
      };
      return query;
    }).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Loan;
        const idDoc = a.payload.doc.id;
        return { idDoc, ...data };
      }))
    );
  }

  createLoan(loan: Loan) {
    return this.loansCollection.add(loan);
  }

  addLoanDetails(loanId: string, loanDetails: LoanDetails) {
<<<<<<< HEAD
=======
    console.log('payment');
>>>>>>> calculator
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
<<<<<<< HEAD

  // overdues(payback: string, lastPayment: string): number {
  //   const today = new Date();
  //   const diff = Math.abs(today.getTime() - new Date(lastPayment).getTime());
  //   const dayDiff = Math.ceil(diff / (1000 * 3600 * 24));
  //   const monthDiff = Math.ceil(diff / (86400000*30));
  //   switch (payback) {
  //     case 'Por dia':
  //       const dia = 1;
  //       return dayDiff/dia;
  //     case 'Semanal':
  //       const semanal = 7;
  //       return dayDiff/semanal;
  //     case 'Quincenal':
  //       const quincenal = 15;
  //       return dayDiff/quincenal;
  //     case 'Mensual':
  //       const mensual = 1;
  //       return monthDiff/mensual;
  //     case 'Trimestral':
  //       const trimestal = 3;
  //       return monthDiff/trimestal;
  //     default:
  //      return 0;
  //   }
  // }
=======
>>>>>>> calculator
}
