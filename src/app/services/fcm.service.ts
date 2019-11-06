import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Platform } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';

@Injectable({
  providedIn: 'root'
})
export class FcmService {

  constructor(private afs: AngularFirestore, private firebaseService: FirebaseX,
              private platform: Platform, private firebaseAuth: AngularFireAuth) { }

  async getToken() {

    let token;

    if(this.platform.is('android')) {
      token = await this.firebaseService.getToken();
    }

    if(this.platform.is('ios')) {
    await this.firebaseService.grantPermission();
    token = await this.firebaseService.getToken();
    ;
    }
    return this.saveTokenToFireStore(token);
  }

  saveTokenToFireStore(token: string) {
    if (!token) {
      return;
    }
    const devicesRef = this.afs.collection('usersDevices');

    const docData = {
      token,
      userId: this.firebaseAuth.auth.currentUser.uid
    };
    return devicesRef.doc(token).set(docData);
   
  }

  listenToNotifications() {
    return this.firebaseService.onMessageReceived();
  }
}
