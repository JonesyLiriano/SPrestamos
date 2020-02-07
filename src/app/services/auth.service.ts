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
    this.isLoggedIn();
  }

  isLoggedIn() {
     this.firebaseAuth.authState.subscribe( user => {
      if (user) {
        console.log(user);
        this.userAuthData = user; 
      }
      else {        
       
      }
    });
  }
  setUserAuthData(userAuthData) {
    return this.firebaseAuth.auth.currentUser.updateProfile(userAuthData);
  }

  registerUser(email: string, password: string) {
    return this.firebaseAuth.auth.createUserWithEmailAndPassword(email, password);
  }

  loginUser(email: string, password: string) {
    return this.firebaseAuth.auth.signInWithEmailAndPassword(email, password);
  }

  sendVerificationMail() {
    return this.firebaseAuth.auth.currentUser.sendEmailVerification();
  }

  signOut() {
    return this.firebaseAuth.auth.signOut();
  }

  forgotPassword(passwordResetEmail) {
    return this.firebaseAuth.auth.sendPasswordResetEmail(passwordResetEmail);
  }

}
