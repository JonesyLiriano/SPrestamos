import * as WelcomeEmail from './users/onCreate/welcomeMessage';
import * as VerifyLoansOverdue from './loans/loansScan/verifyLoansOverduePerDay';


// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

export const sendWelcomeEmail = WelcomeEmail.sendWelcomeEmail;
export const verifyLoansOverdue = VerifyLoansOverdue.verifyLoansOverdue;
