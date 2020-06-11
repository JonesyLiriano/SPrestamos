
import * as functions from 'firebase-functions';
import { Loan } from '../../models/loans';
const admin = require('firebase-admin');
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.applicationDefault()
    });
}
export const loanDetailOnCreated = functions.firestore.document('/loans/{loanId}/loanDetail/{loanDetailId}')
    .onCreate(async (snapshot, context) => {

        try {
            if (snapshot.data()!.type == 'Interes') {
                const db = admin.firestore();
                const loanId = context.params.loanId;
                const promises: any[] = [];
                const loanSnapshot = await db.collection('loans').doc(loanId).get();
                const loan = loanSnapshot.data();

                const usersDevicesSnapshot = await db.collection("usersDevices").where('userId', '==', loan.uid).get();
                const usersDevices = usersDevicesSnapshot.docs.
                    map((uDevicesSnapshot: any) => {
                        const data = uDevicesSnapshot.data();
                        const idDoc = uDevicesSnapshot.id;
                        console.log('device: ' + idDoc + ' ' + data );
                        return { idDoc, ...data };
                    });

                usersDevices.forEach((userDevice: any) => {
                    const pushNotification = sendPushNotification(snapshot.data()!.amount, userDevice.token, loan, loanId);
                    promises.push([pushNotification]);
                });

                return Promise.resolve(promises).then(() => {
                    return true;
                }).catch(er => {
                    console.error('...', er);
                });;
            } else {
                return Promise.reject(true);
            }
        }
        catch (error) {
            console.log(error);
            return Promise.reject(error);
        }
    });

async function sendPushNotification(amountInteres: number, userToken: string, loan: Loan, idDoc: string) {
    const payload = {
        notification: {
            title: `Nueva cuota de ${loan.customer}`,
            body: `Se ha generado una nueva cuota con el monto de: $${amountInteres.toFixed(2)}`
        },
        data: {
            idDoc: idDoc,
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
    return admin.messaging().sendToDevice(userToken, payload);
}
