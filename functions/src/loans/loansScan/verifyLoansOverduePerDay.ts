import { LoanDetails } from './../../models/loanDetails';
import * as functions from 'firebase-functions';
const admin = require('firebase-admin');


export const verifyLoansOverdue = functions.pubsub.schedule('0 5 * * *').timeZone('America/New_York') // Users can choose timezone - default is America/Los_Angeles
  .onRun(async () => {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.applicationDefault()
      });
    }    
    let promises: any[] = [];
    const db = admin.firestore();
    const loansSnapshot = await db.collection('loans').where('status', '==', 'active').get();
    const loans = loansSnapshot.docs
      .map((loanSnapshot: any) => {
        const data = loanSnapshot.data();
        const idDoc = loanSnapshot.id;
        return { idDoc, ...data };
      });
   await loans.map(async (loan: any) => {      
        const paymentsSnapshot = await db.collection('loans').doc(loan.idDoc).collection('loanDetail').get();
        const payments = paymentsSnapshot.docs
          .map((paymentSnapshot: any) => {
            const data = paymentSnapshot.data();
            const idDoc = paymentSnapshot.id;
            return { idDoc, ...data };
          });
        const lastPayment = new Date(Math.max.apply(null, payments.filter((x: any) => x.paid == true && x.type == 'Interes')
          .map(function (o: any) { return Number(new Date(o.logDate)); })).toString() != '-Infinity' ?
          Math.max.apply(null, payments.filter((x: any) => x.paid == true && x.type == 'Interes')
            .map(function (o: any) { return Number(new Date(o.logDate)); })) : loan.initialDate).toISOString();

        const lastCuote = new Date(Math.max.apply(null, payments.filter((x: any) => x.type == 'Interes')
          .map(function (o: any) { return Number(new Date(o.logDate)); })).toString() != '-Infinity' ?
          Math.max.apply(null, payments.filter((x: any) => x.type == 'Interes')
            .map(function (o: any) { return Number(new Date(o.logDate)); })) : loan.initialDate).toISOString();

        if (overdues(loan.payBack, lastPayment, lastCuote)) {
        let capital = 0;
          payments.filter((x: any) => x.paid == true)
            .forEach((payment: any) => {
              if (payment.type == 'Capital') {
                capital += payment.amount;
              }
            });

          let newCuotes = generateCuote(db, loan, capital);
          let updateLoanStatus = changeLoanStatus(db, loan);
          promises.push(updateLoanStatus, newCuotes);
        }; 
    });
    return Promise.all(promises).then(() => {
      return true;
    }).catch(er => {
    return Promise.reject(er);
    });     
  });

function overdues(payback: string | undefined, lastPayment: string, lastCuote: string): boolean {
  const today = new Date(new Date().setHours(0,0,0,0));
  const paymentDiff = Math.abs(today.getTime() - new Date(new Date(lastPayment).setHours(0,0,0,0)).getTime());
  const cuoteDiff = Math.abs(today.getTime() - new Date(new Date(lastCuote).setHours(0,0,0,0)).getTime());
  const paymentDayDiff = (paymentDiff / (1000 * 60 * 60 * 24));
  const paymentMonthDiff = (paymentDiff / (1000 * 60 * 60 * 24 * 7 * 4));
  const cuoteDayDiff = (cuoteDiff / (1000 * 60 * 60 * 24));
  const cuoteMonthDiff = (cuoteDiff / (1000 * 60 * 60 * 24 * 7 * 4));
  switch (payback) {
    case 'Por dia':
      const dia = 1;
      if (paymentDayDiff / dia >= 1 && cuoteDayDiff / dia >= 1) {
        return true;
      }
      return false;
    case 'Semanal':
      const semanal = 7;
      if (paymentDayDiff / semanal >= 1 && cuoteDayDiff / semanal >= 1) {
        return true;
      }
      return false;
    case 'Quincenal':
      const quincenal = 15;
      if (paymentDayDiff / quincenal >= 1 && cuoteDayDiff / quincenal >= 1) {
        return true;
      }
      return false;
    case 'Mensual':
      const mensual = 1;
      if (paymentMonthDiff / mensual >= 1 && cuoteMonthDiff / mensual >= 1) {
        return true;
      }
      return false;
    case 'Trimestral':
      const trimestal = 3;
      if (paymentMonthDiff / trimestal >= 1 && cuoteMonthDiff / trimestal >= 1) {
        return true;
      }
      return false;
    default:
      return false;
  }
}

async function generateCuote(db: any, loan: any, capital: number): Promise<number> {

  let loanDetail: LoanDetails;
  let amountInteres = (loan.interestRate ? loan.interestRate / 100 : 0) * Math.abs((capital - (loan.loanAmount ? loan.loanAmount : 0)));
  loanDetail = {
    logDate: new Date().toISOString(),
    paid: false,
    amount: amountInteres,
    type: 'Interes'
  };
  db.collection("loans").doc(loan.idDoc).collection("loanDetail").add(loanDetail);
  return amountInteres;
}

async function changeLoanStatus(db: any, loan: any) {
  loan.overdue = true;
  const tempLoan = {
    initialDate: loan.initialDate,
    customerId: loan.customerId,
    customer: loan.customer,
    interestRate: loan.interestRate,
    loanAmount: loan.loanAmount,
    loanTerm: loan.loanTerm,
    payBack: loan.payBack,
    logDate: loan.logDate,
    uid: loan.uid,
    status: loan.status,
    overdue: loan.overdue
  };
  return db.collection("loans").doc(loan.idDoc).update(tempLoan);
}