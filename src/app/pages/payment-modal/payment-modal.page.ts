import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { FormBuilder, Validators } from '@angular/forms';
import { LoadingService } from 'src/app/services/loading.service';
import { ToastService } from 'src/app/services/toast.service';
import { AuthService } from 'src/app/services/auth.service';
import { LoansService } from 'src/app/services/loans.service';

@Component({
  selector: 'app-payment-modal',
  templateUrl: './payment-modal.page.html',
  styleUrls: ['./payment-modal.page.scss'],
})
export class PaymentModalPage implements OnInit {

  normalCuote: boolean = true
  payment: boolean = false
  paymentForm = this.fb.group({
    name: ['', Validators.required],
    noDocument: ['', Validators.required],
    state: ['', Validators.required],
    street: ['', Validators.required],
    phone: ['', [Validators.required]],
    secondPhone: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]]
  });

  get name() {
    return this.paymentForm.get('name');
  }
  get noDocument() {
    return this.paymentForm.get('noDocument');
  }
 

  constructor(private modalController: ModalController, private alertController: AlertController,
    private loanService: LoansService, private fb: FormBuilder,
    private toastService: ToastService, private loadingService: LoadingService,
    private authService: AuthService
    ) { }

  ngOnInit() {

  }
  ngAfterViewInit(): void {
    this.loadingService.dismissLoading();
  }
  async onSubmit() {
    try {
      if (this.paymentForm.valid) {
        const alert = await this.alertController.create({
          header: 'Confirmacion!',
          message: 'Esta seguro que desea realizar este pago del <strong>prestamo</strong>?',
          buttons: [
            {
              text: 'Cancelar',
              role: 'cancel',
              cssClass: 'secondary'
            }, {
              text: 'Aceptar',
              handler: async () => {
                await this.loadingService.presentLoading('Cargando...');
                await this.loanService
                this.loadingService.dismissLoading(); 
                this.toastService.presentSuccessToast('Pago realizado correctamente!');
                this.dismissModal();
              }
            }
          ]
        });
        await alert.present();
      } else {
        this.toastService.presentDefaultToast('Verifique los campos nuevamente.');
      }
    } catch (e) {
      this.toastService.presentErrorToast(e);
      this.loadingService.dismissLoading();
    }
  }

  setPayment() {
  
  }

  paymentOption(event: any) {
      this.normalCuote = !this.normalCuote;
    
  }

  async dismissModal() {
    if (this.modalController) {
      await this.modalController.dismiss();
      this.modalController = null;
    }
  }
}
