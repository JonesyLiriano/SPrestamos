import * as functions from 'firebase-functions';
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const APP_NAME = 'SPrestamos';
const sesAccessKey = functions.config().gmail.email;
const sesSecretKey = functions.config().gmail.password;
const mailTransporter = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    auth: {
      user: sesAccessKey,
      pass: sesSecretKey
    }
  }));
  
const admin = require('firebase-admin');


export const sendWelcomeEmail = functions.auth.user().onCreate((user) => {  

    const email = user.email? user.email.toString() : ''; // The email of the user.  
    if (!admin.apps.length) {
      admin.initializeApp({
       credential: admin.credential.applicationDefault()
     });
    let db = admin.firestore();
    let userData = db.collection("users").doc(user.uid);
    userData.get().then(function(doc: any) {
      if (doc.exists) {
          sendNotificactionNewUserMessage(email, doc.data().name + ' ' + doc.data().lastName);
    return sendUserWelcomeMessage(email,  doc.data().name + doc.data().lastName);
      } else {          
         return console.log("No such document!");
      }
  }).catch(function(error: any) {
      return console.log("Error getting document:", error);
  });    
}
});

async function sendUserWelcomeMessage(email: any, displayName: any) {
    const welcomeText = `            
      Hey ${displayName}!, Gracias por utilizar nuestra aplicacion de administracion de prestamos, esperamos que sea de tu agrado,
      cualquier duda o inconvenientes no dudes en contactarnos. :)`;

    const mailOptions = {
      from: `${APP_NAME}`,
      to: email,
      subject: `Bienvenido a ${APP_NAME}!`,
      text: welcomeText
    };    

    await mailTransporter.sendMail(mailOptions);
    console.log('New welcome email sent to:', email);
    return null;
  }

  async function sendNotificactionNewUserMessage(email: any, displayName: any) {
    const newUserText = `
      Email: ${email}
      El usuario ${displayName} se ha registrado en la aplicacion SPrestamos!!!`;

    const mailOptions = {
      from: `${APP_NAME}`,
      to: 'jlirianoadames@gmail.com; lirianoadames@gmail.com',
      subject: `Nuevo registro en ${APP_NAME}!`,
      text: newUserText
    };    

    await mailTransporter.sendMail(mailOptions);
    console.log('Notificacion de nuevo usuario: ', email);
    return null;
  }