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


export const sendWelcomeEmail = functions.auth.user().onCreate(async (user) => {  
try {    
    if (!admin.apps.length) {
      admin.initializeApp({
       credential: admin.credential.applicationDefault()
     });
    }
    const email = user.email? user.email.toString() : ''; 
    let db = admin.firestore();
    let userSnapshot = await db.collection("users").doc(user.uid).get();
    let userData = userSnapshot.data();
    let p1 = sendNotificactionNewUserMessage(email, userData.name + ' ' + userData.lastName);
    let p2 = sendUserWelcomeMessage(email,  userData.name + ' ' + userData.lastName);
    return Promise.all([p1,p2]).then(() => {
      return true;
    }).catch(er => {
      console.log(er);
      return false;
    });;
    }
    catch (error) {
      console.log(error)
      return Promise.reject(error);
    }  
});

 function sendUserWelcomeMessage(email: any, displayName: any) {
    const welcomeText = `            
      Hey ${displayName}!, Gracias por utilizar nuestra aplicacion de administracion de prestamos, esperamos que sea de tu agrado,
      cualquier duda o inconvenientes no dudes en contactarnos. :)`;

    const mailOptions = {
      from: `${APP_NAME}`,
      to: email,
      subject: `Bienvenido a ${APP_NAME}!`,
      text: welcomeText
    };    

    return mailTransporter.sendMail(mailOptions);
  }

  function sendNotificactionNewUserMessage(email: any, displayName: any) {
    const newUserText = `
      Email: ${email}
      El usuario ${displayName} se ha registrado en la aplicacion SPrestamos!`;

    const mailOptions = {
      from: `${APP_NAME}`,
      to: 'jlirianoadames@gmail.com; lirianoadames@gmail.com',
      subject: `Nuevo registro en ${APP_NAME}!`,
      text: newUserText
    };    

    return mailTransporter.sendMail(mailOptions);    
  }