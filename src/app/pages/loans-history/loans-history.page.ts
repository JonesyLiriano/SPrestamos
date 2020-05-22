import { Component, OnInit } from '@angular/core';
import { Loan } from 'src/app/models/loan';
import { FcmService } from 'src/app/services/fcm.service';
import { ModalController, AlertController } from '@ionic/angular';
import { LoansService } from 'src/app/services/loans.service';
import { LoadingService } from 'src/app/services/loading.service';
import { LoanReadModalPage } from '../loan-read-modal/loan-read-modal.page';
import { delay } from 'q';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-loans-history',
  templateUrl: './loans-history.page.html',
  styleUrls: ['./loans-history.page.scss'],
})
export class LoansHistoryPage implements OnInit {


  loan: Loan;
  loans: Loan[];
  search;
  loanStatus: string;
  subscription: Subscription;

  constructor(private fmc: FcmService,
    private modalController: ModalController, private alertController: AlertController,
    private loansService: LoansService,
    private loadingService: LoadingService) { }

  ngOnInit() {
    this.fmc.getToken();
    this.loanStatus = 'settled';  
    this.loadLoans()  
  }

  async loadLoans() {
    await this.loadingService.presentLoading('Cargando...');
    await delay(300);
    if (this.subscription != undefined) {
      this.subscription.unsubscribe();
    }
    this.subscription = this.loansService.getLoans(this.loanStatus).subscribe(data => {
      this.loans = data;
      this.loadingService.dismissLoading();
    }, err => {
      this.loadingService.dismissLoading();
    });
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

}