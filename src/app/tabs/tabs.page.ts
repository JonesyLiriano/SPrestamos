import { Component } from '@angular/core';
import { FcmService } from '../services/fcm.service';
import { AlertController, ModalController } from '@ionic/angular';
import { LoadingService } from '../services/loading.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Loan } from '../models/loan';
import { PaymentModalPage } from '../pages/payment-modal/payment-modal.page';
import { Subscription } from 'rxjs';
import { AdmobService } from '../services/admob.service';
import { UsersService } from '../services/users.service';
import { PopoverService } from '../services/popover.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(private fcmService: FcmService, private alertController: AlertController,
    private loadingService: LoadingService, private authService: AuthService,
    private router: Router, private modalController: ModalController,
    private adMobService: AdmobService, private usersService: UsersService,
    private popoverService: PopoverService) {

    this.fcmService.getToken();
    this.fcmService.listenToNotifications().subscribe(async (data: any) => {
      if (data.tap == 'background') {
        await this.router.navigate(['tabs/loans-display']);
        this.presentPaymentModal({
          idDoc: data.idDoc,
          initialDate: data.initialDate,
          customerId: data.customerId,
          customer: data.customer,
          interestRate: parseFloat(data.interestRate),
          loanAmount: parseFloat(data.loanAmount),
          loanTerm: data.loanTerm,
          payBack: data.payBack,
          logDate: data.logDate,
          uid: data.uid,
          status: data.status,
          overdue: (data.overdue.toLowerCase() === 'true')
        });
      }
    });
    this.presentAdmobBanner();
    this.presentPaymentButton();

  }

  async presentAdmobBanner() {
    await this.adMobService.showAdmobBanner();
  }

  async presentPaymentButton() {
    const user = await this.usersService.getUser(this.authService.userAuthData.uid);
    if (!user.data().emailVerfied) {
      await this.popoverService.presentPopover();
    }
  }

  async presentPaymentModal(loan: Loan) {
    await this.loadingService.presentLoading('Cargando...');
    const modal = await this.modalController.create({
      component: PaymentModalPage,
      componentProps: { loan }
    });
    await modal.present();
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
            try {
              await this.loadingService.presentLoading('Cargando...');
              await this.authService.signOut();
              this.loadingService.dismissLoading();
              this.router.navigate(['/login']);
            }
            catch (error) {
              this.loadingService.dismissLoading();
            }
          }
        }
      ]
    });

    await alert.present();
  }



}
