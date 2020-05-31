import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  
  usersCollection: AngularFirestoreCollection<User>;

  constructor(private afs: AngularFirestore) {
    this.usersCollection = this.afs.collection<User>('users');
   }

  createUser(uid: string, user: User) {
    this.usersCollection.doc(uid).set(user);
  }  
  updateUser(uid: string, user) {
    return this.usersCollection.doc(uid).update(user);
  }
}
