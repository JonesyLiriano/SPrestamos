import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

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

  async initializeApp() {
    await this.platform.ready();
    this.statusBar.overlaysWebView(false);
    this.statusBar.backgroundColorByHexString('#7044ff');
    this.platform.backButton.subscribeWithPriority(1, () => { // to disable hardware back button on whole app
    });
    setTimeout(() => {
      this.splashScreen.hide(); 
    }, 1000);
   
  }
}
