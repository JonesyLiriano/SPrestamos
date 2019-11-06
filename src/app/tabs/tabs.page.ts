import { Component } from '@angular/core';
import { FcmService } from '../services/fcm.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(private fcmService: FcmService) {
    this.fcmService.getToken();
      this.fcmService.listenToNotifications().subscribe((data) => {
        alert(data);
      });
  }

  

}
