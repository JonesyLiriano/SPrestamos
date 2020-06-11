import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  
  usersCollection: AngularFirestoreCollection<User>;

  constructor(private afs: AngularFirestore) {
    this.usersCollection = this.afs.collection<User>('users');
   }

   getUser(uid: string) {
    return this.usersCollection.doc(uid).get().toPromise();
   }

  createUser(uid: string, user: User) {
    this.usersCollection.doc(uid).set(user);
  }  
  updateUser(uid: string, user) {
    return this.usersCollection.doc(uid).update(user);
  }
}
