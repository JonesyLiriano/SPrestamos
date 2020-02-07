import * as functions from 'firebase-functions';
import { Loan } from "../../models/loans";
const admin = require('firebase-admin');


export const verifyLoansOverdue = functions.pubsub.topic('VerifyLoansOverdue').onPublish(() => {

    admin.initializeApp({
        credential: admin.credential.applicationDefault()
    });
    var db = admin.firestore();
    var loansRef = db.collection('loans').where('status', '=', 'active');
    var activeLoans = loansRef.get()
        .then((snapshot: { id: string; data: () => Loan; }[]) => {
            snapshot.forEach((doc: { id: string; data: () => Loan; }) => {
        var payments = db.collection('loans').doc(doc.id).collection('loanDetail').add();
        
        const lastPayment = new Date(Math.max.apply(null, payments.filter( (x: { paid: boolean; type: string; }) => x.paid == true && x.type == 'Interes').map(function (o: { logDate: string }) { return new Date(o.logDate) })).toString() !=  '-Infinity' ?
        Math.max.apply(null, payments.filter((x: { paid: boolean, type: string; }) => x.paid == true && x.type == 'Interes').map(function (o: { logDate: string; }) { return new Date(o.logDate) })) : doc.data().initialDate).toISOString();
        
        const lastCuote =  new Date(Math.max.apply(null, payments.filter( (x: { paid: boolean; type: string; }) => x.paid == false && x.type == 'Interes').map(function (o: { logDate: string }) { return new Date(o.logDate) })).toString() !=  '-Infinity' ?
        Math.max.apply(null, payments.filter((x: { paid: boolean, type: string; }) => x.paid == false && x.type == 'Interes').map(function (o: { logDate: string; }) { return new Date(o.logDate) })) : doc.data().initialDate).toISOString();       
        
        overdues(doc.data().payBack, lastPayment);
            });
        })
        .catch((err: any) => {
            console.log('Error getting documents', err);
        });

});


 function overdues(payback: string | undefined, lastPayment: string): number {
    const today = new Date();
    const diff = Math.abs(today.getTime() - new Date(lastPayment).getTime());
    const dayDiff = Math.ceil(diff / (1000 * 3600 * 24));
    const monthDiff = Math.ceil(diff / (86400000*30));
    switch (payback) {
      case 'Por dia':
        const dia = 1;
        return dayDiff/dia;
      case 'Semanal':
        const semanal = 7;
        return dayDiff/semanal;
      case 'Quincenal':
        const quincenal = 15;
        return dayDiff/quincenal;
      case 'Mensual':
        const mensual = 1;
        return monthDiff/mensual;
      case 'Trimestral':
        const trimestal = 3;
        return monthDiff/trimestal;
      default:
       return 0;
    }
  }
