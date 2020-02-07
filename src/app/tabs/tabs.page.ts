import { Component } from '@angular/core';
import { FcmService } from '../services/fcm.service';
import { AlertController } from '@ionic/angular';
import { LoadingService } from '../services/loading.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(private fcmService: FcmService, private alertController: AlertController,
              private loadingService: LoadingService, private authService: AuthService,
              private router: Router) {
    this.fcmService.getToken();
      this.fcmService.listenToNotifications().subscribe((data) => {
        alert(data);
      });
  }

  async logOut() {
    const alert = await this.alertController.create({
      header: 'Confirmacion!',
      message: 'Esta seguro que desea <strong>cerrar</strong> sesion?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Cerrar Sesion',
          handler: async () => {
            await this.loadingService.presentLoading('Cargando...');            
            await this.authService.signOut();
            this.loadingService.dismissLoading();
            this.router.navigate(['/login']);
          }
        }
      ]
    });

    await alert.present();
  }

  

}
