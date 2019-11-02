import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor(public toastController: ToastController) {}

  async presentDefaultToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }

async presentSuccessToast(msg: string) {
  const toast = await this.toastController.create({
    message: msg,
    color: 'success',
    duration: 3000
  });
  toast.present();
}

async presentErrorToast(msg: string) {
  const toast = await this.toastController.create({
    message: msg,
    color: 'danger',
    duration: 3000
  });
  toast.present();
}
}

