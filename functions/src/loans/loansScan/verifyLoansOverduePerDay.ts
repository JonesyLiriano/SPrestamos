import { LoanDetails } from './../../models/loanDetails';
import * as functions from 'firebase-functions';
import { Loan } from '../../models/loans';
const admin = require('firebase-admin');


export const verifyLoansOverdue = functions.pubsub.schedule('0 5 * * *').timeZone('America/New_York') // Users can choose timezone - default is America/Los_Angeles
  .onRun(() => {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.applicationDefault()
      });
    }
    let db = admin.firestore();
    let loansRef = db.collection('loans');
    return loansRef.where('status', '==', 'active').get()
      .then((querySnapshot: any): void => {
        return querySnapshot.forEach(async (doc: any) => {
          let paymentsCollection = db.collection('loans').doc(doc.id).collection('loanDetail');
          let payments = await paymentsCollection.get()
            .then((snapshot: any) => {
              return snapshot.docs.map((doc: any) => {
                return doc.data();              
              });
            }).catch((error: any) => {
              console.log(error);
            });
              
            const lastPayment = new Date(Math.max.apply(null, payments.filter((x: any) => x.paid == true && x.type == 'Interes').map(function (o: any) {
              return Number(new Date(o.logDate));
            })).toString() != '-Infinity' ?
              Math.max.apply(null, payments.filter((x: any) => x.paid == true && x.type == 'Interes')
                .map(function (o: any) { return Number(new Date(o.logDate)); })) : doc.data().initialDate).toISOString();
  
            const lastCuote = new Date(Math.max.apply(null, payments.filter((x: any) => x.type == 'Interes')
              .map(function (o: any) { return Number(new Date(o.logDate)); })).toString() != '-Infinity' ?
              Math.max.apply(null, payments.filter((x: any) => x.type == 'Interes')
                .map(function (o: any) { return Number(new Date(o.logDate)); })) : doc.data().initialDate).toISOString();
  
            if (overdues(doc.data().payBack, lastPayment, lastCuote)) {
              let interes = 0;
              let capital = 0;
              payments.filter((x: any) => x.paid == true)
                .forEach((payment: any) => {
                  if (payment.type == 'Interes') {
                    interes += payment.amount;
                  } else if (payment.type == 'Capital') {
                    capital += payment.amount;
                  }
                });
              let interesAmount = generateCuote(paymentsCollection, doc.data().loanAmount
                , doc.data().interestRate, interes, capital);
  
             changeLoanStatus(loansRef, doc.id, doc.data());

            return db.collection("usersDevices").where('userId', '==', doc.data().uid).get()
              .then((usersDevicesSnapshot: any): Promise<boolean> => {
                usersDevicesSnapshot.forEach((userDevice: any) => {
                  sendPushNotification(interesAmount, userDevice.data().token, doc.data(), doc.id);
                  });
                  return Promise.resolve(true);
                }).catch((error: any) => {
                  console.log('error2: ' + error);
                  return Promise.resolve(false);
                });
            }
            

        });
      }).catch((err: any) => {
        console.log('Error getting documents', err);
      });
  });


function overdues(payback: string | undefined, lastPayment: string, lastCuote: string): boolean {
  const today = new Date();
  const paymentDiff = Math.abs(today.getTime() - new Date(lastPayment).getTime());
  const cuoteDiff = Math.abs(today.getTime() - new Date(lastCuote).getTime());
  const paymentDayDiff = (paymentDiff / (1000 * 3600 * 24));
  const paymentMonthDiff = (paymentDiff / (86400000 * 30));
  const cuoteDayDiff = (cuoteDiff / (1000 * 3600 * 24));
  const cuoteMonthDiff = (cuoteDiff / (86400000 * 30));

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

function generateCuote(loanPayment: any, loanAmount: number | undefined, interesRate: number | undefined,
  interes: number, capital: number): number {
  let loanDetail: LoanDetails;
  let amountInteres = (interesRate ? interesRate / 100 : 0) * Math.abs((capital - (loanAmount ? loanAmount : 0)));

  loanDetail = {
    logDate: new Date().toISOString(),
    paid: false,
    amount: amountInteres,
    type: 'Interes'

  }
  return loanPayment.add(loanDetail).then(() => {
    return amountInteres;
  }).catch((error: any) => {
    console.log(error);
    return amountInteres;
  });
  

}

function changeLoanStatus(loan: any, id: string, data: any): void {
  data.overdue = true;
  loan.doc(id).update(data).then().catch((error: any) => {
    console.log(error);
  });
}

function sendPushNotification(amountInteres: number, userToken: string, loan: Loan, doc: string) {
  const payload = {
    notification: {
      title: `Nueva cuota de ${loan.customer}`,
      body: `Se ha generado una nueva cuota con el monto de: $${amountInteres}`
    },
    data: {
      idDoc: doc,
      initialDate: loan.initialDate,
      customerId: loan.customerId,
      customer: loan.customer,
      interestRate: (loan.interestRate || '').toString(),
      loanAmount: (loan.loanAmount || '').toString(),
      loanTerm: loan.loanTerm,
      payBack: loan.payBack,
      logDate: loan.logDate,
      uid: loan.uid,
      status: loan.status,
      overdue: (loan.overdue || '').toString(),
      notification_foreground: "true"
    }
  };
  admin.messaging().sendToDevice(userToken, payload).then().catch((error: any) => {
    console.log('error mensaje: ' + error);
  });

}
