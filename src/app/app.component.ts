import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { FcmService } from './services/fcm.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

<<<<<<< HEAD
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByHexString('#7044ff');
      this.splashScreen.hide();      
      
=======
  async initializeApp() {
    await this.platform.ready();
    this.statusBar.overlaysWebView(false);
    this.statusBar.backgroundColorByHexString('#7044ff');
    this.splashScreen.hide();      
    this.platform.backButton.subscribeWithPriority(1, () => { // to disable hardware back button on whole app
>>>>>>> calculator
    });
  }
}
