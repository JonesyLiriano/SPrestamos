import { Component, OnInit, Input } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { FormBuilder, Validators } from '@angular/forms';
import { LoadingService } from 'src/app/services/loading.service';
import { ToastService } from 'src/app/services/toast.service';
import { AuthService } from 'src/app/services/auth.service';
import { LoansService } from 'src/app/services/loans.service';
import { Loan } from 'src/app/models/loan';
import { LoanDetails } from 'src/app/models/loanDetails';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-payment-modal',
  templateUrl: './payment-modal.page.html',
  styleUrls: ['./payment-modal.page.scss'],
})
export class PaymentModalPage implements OnInit {
  @Input() loan: Loan;
  payment: boolean = false;
  paymentForm = this.fb.group({
    loanAmount: [0, Validators.required],
    loanInteres: [0, Validators.required],
    paymentOptions: ['', Validators.required]
  });
  loanDetails: LoanDetails;

  get loanAmount() {
    return this.paymentForm.get('loanAmount');
  }

  get loanInteres() {
    return this.paymentForm.get('loanInteres');
  }

  get paymentOptions() {
    return this.paymentForm.get('paymentOptions');
  }
  payments: LoanDetails[];
  interesPayments: LoanDetails[];
  pendingAmount: number;
  lastPayment: string;
  overdues: number;
  cuotesToPay: number;
  cuotesPendingAmount: number;

  constructor(private modalController: ModalController, private alertController: AlertController,
    private loansService: LoansService, private fb: FormBuilder,
    private toastService: ToastService, private loadingService: LoadingService
  ) { }

  ngOnInit() {
    this.pendingAmount = 0;
    this.overdues = 0;
    this.cuotesToPay = 0;
    this.paymentOptions.setValue('Interes');
  }
  async ngAfterViewInit(): Promise<void> {
    await delay(300);
    this.getDetail();
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
                if (this.validatePayment()) {
                  this.doPayment();
                } else {
                  this.toastService.presentErrorToast('Pago no pudo ser realizado, verifique el monto del pago nuevamente...')
                }
                this.loadingService.dismissLoading();
                this.dismissModal();
              }
            }
          ]
        });
        alert.present();
      } else {
        this.toastService.presentDefaultToast('Verifique los campos nuevamente.');
      }
    } catch (e) {
      this.toastService.presentErrorToast(e);
      this.loadingService.dismissLoading();
    }
  }

  setPaymentCapital() {
    return this.loanDetails = {
      logDate: new Date().toISOString(),
      amount: this.loanAmount.value,
      type: this.paymentOptions.value,
      paid: true
    };
  }
  setPaymentInteres() {
    this.interesPayments.forEach(async element => {
      element.paid = true;
      element.logDate = new Date().toISOString();
      await this.loansService.updateLoanDetails(this.loan.idDoc, element);
    });
  }

  validatePayment(): boolean {
    if (this.paymentOptions.value == 'Capital' && this.loanAmount.value <= 0) {
      this.toastService.presentErrorToast('Debe de ingresar un monto valido para realizar el abono al capital.');
      this.loanAmount.setValue(0);
      return false;
    }
    return true;
  }

  async changeLoanStatus() {
    if (this.overdues == this.cuotesToPay) {
      this.loan.overdue = false;
      await this.loansService.updateLoan(this.loan);
    }
  }

  async doPayment() {    
    if (this.paymentOptions.value == 'Capital') {
      await this.loansService.addLoanDetails(this.loan.idDoc, this.setPaymentCapital());
      this.toastService.presentSuccessToast('El abono al capital se ha realizado correctamente.');
    } else if (this.paymentOptions.value == 'Interes') {
      this.setPaymentInteres();
      this.changeLoanStatus();
      this.toastService.presentSuccessToast('Se ha realizado el pago de la cuota correctamente.');
    } else {
      this.toastService.presentErrorToast('El pago no pudo ser realizado, intente de nuevo por favor.');
    }
  }

  paymentOption() {
    if (this.paymentOptions.value == 'Interes') {
      this.payCuote();
    } else {
      this.payCustomAmount();
    }
  }

  payCuote() {
    if (this.overdues == 0) {
      this.toastService.presentDefaultToast('Este prestamos no tiene cuotas pendientes.');
      this.paymentOptions.setValue('Capital');
      this.paymentOptions.updateValueAndValidity();
    } else {
      this.cuotesPendingAmount = 0;
      this.interesPayments = this.payments.filter(x => x.paid == false && x.type == 'Interes').slice(0, this.cuotesToPay);
      this.interesPayments.forEach(payment => {
        this.cuotesPendingAmount += payment.amount;
      });
      this.loanInteres.setValue(this.cuotesPendingAmount.toFixed(2));
    }
  }

  payCustomAmount() {
    this.loanAmount.setValue(0);
  }

  getDetail() {
    return this.loansService.getLoanDetail(this.loan.idDoc).subscribe(data => {
      this.pendingAmount = 0;
      this.payments = data;
      this.payments.filter(x => x.type == 'Capital' && x.paid == true).forEach(payment => {
        this.pendingAmount += (payment['amount']);
      });
      this.pendingAmount = this.loan.loanAmount - this.pendingAmount;
      this.overdues = this.payments.filter(x => x.type == 'Interes' && x.paid == false).length;
      this.cuotesToPay = this.overdues;
      this.paymentOption();
    });
  }

  async dismissModal() {
    if (this.modalController) {
      await this.modalController.dismiss();
      this.modalController = null;
    }
  }

  addCuotes() {
    if (this.cuotesToPay == this.overdues) {
      this.toastService.presentDefaultToast('No quedan mas cuotas pendientes...');
    } else {
      this.cuotesToPay++;
      this.payCuote();
    }
  }
  substractCuotes() {
    if (this.cuotesToPay == 1) {
      this.toastService.presentDefaultToast('Debe de elegir al menos una cuota pendiente...');
    } else {
      this.cuotesToPay--;
      this.payCuote();
    }
  }
}
