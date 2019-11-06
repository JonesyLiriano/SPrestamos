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


export const sendWelcomeEmail = functions.auth.user().onCreate((user) => {  

    const email = user.email; // The email of the user.
    const displayName = user.displayName; // The display name of the user.
    const password = user.passwordHash; // users password.   
    
    sendNotificactionNewUserMessage(email, displayName);
    return sendUserWelcomeMessage(email, displayName, password);
});

async function sendUserWelcomeMessage(email: any, displayName: any, password: any,) {
    const welcomeText = `
      Bienvenido!!!                 
      Hey ${displayName || ''}!, Gracias por utilizar nuestra aplicacion de administracion de prestamos, esperamos que sea de tu agrado,
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
      Email: ${displayName || ''}
      El usuario ${displayName || ''} se ha registrado en la aplicacion SPrestamos!!!`;

    const mailOptions = {
      from: `${APP_NAME}`,
      to: email,
      subject: `Nuevo registro en ${APP_NAME}!`,
      text: newUserText
    };    

    await mailTransporter.sendMail(mailOptions);
    console.log('Notificacion de nuevo usuario: ', email);
    return null;
  }