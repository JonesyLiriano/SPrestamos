import { Component } from '@angular/core';
import { FcmService } from '../services/fcm.service';
<<<<<<< HEAD
import { AlertController } from '@ionic/angular';
import { LoadingService } from '../services/loading.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
=======
import { AlertController, ModalController } from '@ionic/angular';
import { LoadingService } from '../services/loading.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Loan } from '../models/loan';
import { PaymentModalPage } from '../pages/payment-modal/payment-modal.page';
>>>>>>> calculator

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(private fcmService: FcmService, private alertController: AlertController,
              private loadingService: LoadingService, private authService: AuthService,
<<<<<<< HEAD
              private router: Router) {
    this.fcmService.getToken();
      this.fcmService.listenToNotifications().subscribe((data) => {
        alert(data);
      });
  }

=======
              private router: Router, private modalController: ModalController) {
    this.fcmService.getToken();
    this.fcmService.listenToNotifications().subscribe((data: any) => {
      if(data.tap == 'background'){
        this.router.navigate(['tabs/loans-display']);  
        this.presentPaymentModal({
          idDoc: data.idDoc,
          initialDate: data.initialDate,
          customerId: data.customerId,
          customer: data.customer,
          interestRate: data.interestRate,
          loanAmount: data.loanAmount,
          loanTerm: data.loanTerm,
          payBack: data.payBack,
          logDate: data.logDate,
          uid:data.uid,
          status: data.status,
          overdue: data.overdue});
        }
      });
  }

  async presentPaymentModal(loan: Loan) {
    await this.loadingService.presentLoading('Cargando...');
    const modal = await this.modalController.create({
    component: PaymentModalPage,
    componentProps: {loan}
  });
    await modal.present();
  }
  
>>>>>>> calculator
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
