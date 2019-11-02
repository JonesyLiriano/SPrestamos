import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  response = false;
  response$: Promise<boolean>;
  validation = false;
  validation$: Promise<boolean>;
  
  constructor(private firebaseAuth: AngularFireAuth,
    private fire: AngularFirestore) {      
  }

  confirmUser() {
    this.fire
  }

  registerUser(email: string, password: string) {
    return this.firebaseAuth.auth.createUserWithEmailAndPassword(email, password);
  }

  loginUser(email: string, password: string) {
    return this.firebaseAuth.auth.createUserWithEmailAndPassword(email, password);
  }
  
}
