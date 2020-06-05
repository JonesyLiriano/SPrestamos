import { Injectable } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class PopoverService {

  constructor(public popoverController: PopoverController) { }

  async presentPopover() {
    const popover = await this.popoverController.create({
      component: `<h1>HELLO</h1>`,
      showBackdrop: false,
      translucent: true
    });
    return await popover.present();
  }

}
