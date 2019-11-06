import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userAuthData: User;
  
  constructor(private firebaseAuth: AngularFireAuth) {    
      this.firebaseAuth.authState.subscribe(user => {
        if (user) {
          this.userAuthData = user;
          localStorage.setItem('user', JSON.stringify(this.userAuthData));
          JSON.parse(localStorage.getItem('user'));
        } else {
          localStorage.setItem('user', null);
          JSON.parse(localStorage.getItem('user'));
        }
      })    
  }

  setUserAuthData(userAuthData) {
    console.log(userAuthData);
    return this.firebaseAuth.auth.currentUser.updateProfile(userAuthData);
  }

  registerUser(email: string, password: string) {
    return this.firebaseAuth.auth.createUserWithEmailAndPassword(email, password);
  }

  loginUser(email: string, password: string) {
    return this.firebaseAuth.auth.signInWithEmailAndPassword(email, password);
  } 

  async sendVerificationMail() {
    return await this.firebaseAuth.auth.currentUser.sendEmailVerification();
  }

  signOut() {
    return this.firebaseAuth.auth.signOut().then(() => {
      localStorage.removeItem('user');
    });
  }

  forgotPassword(passwordResetEmail) {
    return this.firebaseAuth.auth.sendPasswordResetEmail(passwordResetEmail)
    .then(() => {
      window.alert('Password reset email sent, check your inbox.');
    }).catch((error) => {
      window.alert(error)
    })
  }

}
