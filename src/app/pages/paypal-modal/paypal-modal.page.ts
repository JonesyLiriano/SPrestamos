import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { LoadingService } from 'src/app/services/loading.service';
import { ModalController, AlertController } from '@ionic/angular';
import { ToastService } from 'src/app/services/toast.service';
import { PaymentsService } from 'src/app/services/payments.service';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';
import { VerifiedUserService } from 'src/app/services/verified-user.service';
declare var paypal: any;
@Component({
  selector: 'app-paypal-modal',
  templateUrl: './paypal-modal.page.html',
  styleUrls: ['./paypal-modal.page.scss'],
})
export class PaypalModalPage implements OnInit {
  @ViewChild('paypalButton', { static: true }) paypalElement: ElementRef;
  product = {
    price: 20.00,
    description: 'SPrestamos Premiun'
  };

  constructor(private loadingService: LoadingService, private modalController: ModalController,
    private toastService: ToastService, private alertController: AlertController,
    private paymentsService: PaymentsService, private authService: AuthService, private usersService: UsersService,
    private verifiedUserService: VerifiedUserService) { }

  ngOnInit() {
    paypal
    .Buttons({
      createOrder: (data, actions) => {
        return actions.order.create({
          purchase_units: [
            {
              description: this.product.description,
              amount: {
                currency_code: 'USD',
                value: this.product.price
              }
            }
          ]
        });
      },
      onApprove: async (data, actions) => {
        const order = await actions.order.capture();
        await this.processPayment(order);
        await this.updateUserInfo();
        this.verifiedUserService.setVerifiedUserState(true);
        this.presentAlert();
      },
      onError: err => {
        this.toastService.presentErrorToast(err);
      }
    })
    .render(this.paypalElement.nativeElement);
}

  ngAfterViewInit(): void {
    this.loadingService.dismissLoading();
  }

  updateUserInfo(){
    return this.usersService.updateUser(this.authService.userAuthData.uid,{emailVerified: true});
  }
  processPayment(order){
    return this.paymentsService.createPayment({
      idDoc: order.id,
      logDate:order.update_time,
      status: order.status,
      amount: this.product.price,
      uid: this.authService.userAuthData.uid
    });
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Pago realizado correctamente',
      message: 'Gracias por realizar su pago!, Ya tiene todas las funcionalidades de SPrestamos desbloqueadas.',
      buttons: [
        {
          text: 'OK',
          handler: async (blah) => {
            await this.dismissModal();
          }
        }]  
    });

    await alert.present();
  }

  async dismissModal() {
    if (this.modalController) {
      await this.modalController.dismiss();
      this.modalController = null;
    }
  }


}
