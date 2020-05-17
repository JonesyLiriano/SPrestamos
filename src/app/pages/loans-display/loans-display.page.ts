import { Component, OnInit } from '@angular/core';
import { FcmService } from 'src/app/services/fcm.service';
import { LoansService } from 'src/app/services/loans.service';
import { Loan } from 'src/app/models/loan';
import { LoanReadModalPage } from '../loan-read-modal/loan-read-modal.page';
import { ModalController, AlertController } from '@ionic/angular';
import { LoadingService } from 'src/app/services/loading.service';
import { Storage } from '@ionic/storage';
import { PaymentModalPage } from '../payment-modal/payment-modal.page';
import { delay } from 'q';

@Component({
  selector: 'app-loans-display',
  templateUrl: './loans-display.page.html',
  styleUrls: ['./loans-display.page.scss'],
})
export class LoansDisplayPage implements OnInit {


  loan: Loan;
  loans: Loan[];
  search;
  loanStatus: string;
  inicialize: boolean;

  constructor(private fmc: FcmService,
    private modalController: ModalController, private alertController: AlertController,
    private loansService: LoansService, private storage: Storage,
    private loadingService: LoadingService) { }

  ngOnInit() {
    this.fmc.getToken();
    this.loanStatus = 'overdue';
    this.loadLoans();
    
  }
  ionViewDidEnter() {
    if(this.inicialize) {   
    this.loadLoans();
    }
    this.inicialize = true;    
  }
  

  async loadLoans() {
    await this.loadingService.presentLoading('Cargando...');
    await delay(300);
    this.loansService.getLoans(this.loanStatus).subscribe(data => {
      this.loans = data;
      this.loadingService.dismissLoading();
    }, err => {
      console.log(err);
      this.loadingService.dismissLoading();
    });
  }

  async cancelLoan(loan: Loan) {
    const alert = await this.alertController.create({
      header: 'Confirmacion!',
      message: 'Esta seguro que desea <strong>cancelar</strong> este prestamo?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Cancelar Prestamo',
          handler: async () => {
            await this.loadingService.presentLoading('Cargando...');
            loan.status = 'cancelled';
            await this.loansService.updateLoan(loan);
            this.loadingService.dismissLoading();
          }
        }
      ]
    });

    await alert.present();
  }

  async presentReadModal(loan: Loan) {
    await this.loadingService.presentLoading('Cargando...');
    const modal = await this.modalController.create({
      component: LoanReadModalPage,
      componentProps: { loan }
    });
    await modal.present();
  }

  onFilter(search: string) {
    this.search = search;
  }

  async presentPaymentModal(loan: Loan) {
    await this.loadingService.presentLoading('Cargando...');
    const modal = await this.modalController.create({
      component: PaymentModalPage,
      componentProps: { loan }
    });
    await modal.present();
  }

}
