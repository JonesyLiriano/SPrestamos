import { Component } from '@angular/core';
import { FcmService } from '../services/fcm.service';
import { AlertController, ModalController, PopoverController } from '@ionic/angular';
import { LoadingService } from '../services/loading.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Loan } from '../models/loan';
import { PaymentModalPage } from '../pages/payment-modal/payment-modal.page';
import { UsersService } from '../services/users.service';
import { VerifiedUserService } from '../services/verified-user.service';
import { LoansService } from '../services/loans.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(private fcmService: FcmService, private alertController: AlertController,
    private loadingService: LoadingService, private authService: AuthService,
    private router: Router, private modalController: ModalController, private usersService: UsersService,
    private verifiedUserService: VerifiedUserService, private loansService: LoansService) {

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
    this.getUserInfo();
  }
  

  async presentPaymentModal(loan: Loan) {
    await this.loadingService.presentLoading('Cargando...');
    const modal = await this.modalController.create({
      component: PaymentModalPage,
      componentProps: { loan }
    });
    await modal.present();
  }



  async getUserInfo(){
    try {
      const user = await this.usersService.getUser(this.authService.userAuthData.uid);
      if (!user.data().emailVerified) {
        this.verifiedUserService.setVerifiedUserState(false);
        this.currentLoansActive();
      } else {
        this.verifiedUserService.setVerifiedUserState(true);
      }
    }
    catch(err) {
      console.log('PaymentButton ERROR: ' + err)
    }
  }

  async currentLoansActive() {
      this.loansService.getLoans('allActive', '').subscribe(data => {
        this.verifiedUserService.setLoansLimit(data.length);
      }, err => {
        console.log(err);
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
