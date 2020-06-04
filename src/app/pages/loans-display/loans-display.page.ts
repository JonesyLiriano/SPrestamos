import { Component, OnInit, AfterContentInit, AfterViewInit, ViewChild } from '@angular/core';
import { FcmService } from 'src/app/services/fcm.service';
import { LoansService } from 'src/app/services/loans.service';
import { Loan } from 'src/app/models/loan';
import { LoanReadModalPage } from '../loan-read-modal/loan-read-modal.page';
import { ModalController, AlertController, IonInfiniteScroll } from '@ionic/angular';
import { LoadingService } from 'src/app/services/loading.service';
import { Storage } from '@ionic/storage';
import { PaymentModalPage } from '../payment-modal/payment-modal.page';
import { delay } from 'q';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-loans-display',
  templateUrl: './loans-display.page.html',
  styleUrls: ['./loans-display.page.scss'],
})
export class LoansDisplayPage implements OnInit, AfterViewInit {

  @ViewChild(IonInfiniteScroll, { static: false }) infinityScroll: IonInfiniteScroll;

  loan: Loan;
  loansActive = [];
  loansOverdue = [];
  search = '';
  loanStatus: string;
  subscriptionLoansOverdue: Subscription;
  subscriptionLoansActive: Subscription;
  completeOverdueLoad = false;
  completeActiveLoad = false;
  lastOverdueLoan;
  lastActiveLoan;


  constructor(private fmc: FcmService,
    private modalController: ModalController, private alertController: AlertController,
    private loansService: LoansService, private storage: Storage,
    private loadingService: LoadingService) { }

  async ngOnInit() {
    await this.loadingService.presentLoading('Cargando...');
    await delay(300);
    this.fmc.getToken();
    this.loanStatus = 'overdue';
  }

  ngAfterViewInit() {
    this.loadingService.dismissLoading();
  }
  async infiniteEvent($event) {
    if(this.loanStatus == 'overdue') {
      if (!this.completeOverdueLoad) {
        await this.loadLoans();
        $event.target.complete();
      }
    } else if(this.loanStatus == 'active') {
      if (!this.completeActiveLoad) {
        await this.loadLoans();
        $event.target.complete();
      }
    }    
  }
  async loadLoans() {
    if (this.loanStatus == 'active') {
        this.getLoansActive();
    } else if(this.loanStatus == 'overdue') {
        this.getLoansOverdue();
    }
  }
 
  getLoansActive() {
    this.lastActiveLoan = this.loansService.nextQueryAfter;
    this.subscriptionLoansActive = this.loansService.getLoans(this.loanStatus, this.search).subscribe(loans => {
      console.log('active');
      if (loans.length < this.loansService.limit) {
        this.completeActiveLoad = true;
      } else {
        this.completeActiveLoad = false;
      }
      if (this.loansActive.length > 0) {
        this.loansActive = this.loansActive.map(
          s => loans.find(
            t => t.idDoc == s.idDoc) || s
        ).concat( //end map of arr1
          loans.filter(
            s => !this.loansActive.find(t => t.idDoc == s.idDoc)
          ) //end filter
        ); // end concat
      } else {
        this.loansActive = loans;
      }
      this.cleanActiveLoanArray(loans);

    }, err => {
      console.log(err);
      this.loadingService.dismissLoading();
    });
  }

  getLoansOverdue() {
    this.lastOverdueLoan = this.loansService.nextQueryAfter;
    this.subscriptionLoansOverdue = this.loansService.getLoans(this.loanStatus, this.search).subscribe(loans => {
      console.log('overdue');
      this.lastOverdueLoan = this.loansService.nextQueryAfter;
      if (loans.length < this.loansService.limit) {
        this.completeOverdueLoad = true;
      } else {
        this.completeOverdueLoad = false;
      }
      if (this.loansOverdue.length > 0) {
        this.loansOverdue = this.loansOverdue.map(
          s => loans.find(
            t => t.idDoc == s.idDoc) || s
        ).concat( //end map of arr1
          loans.filter(
            s => !this.loansOverdue.find(t => t.idDoc == s.idDoc)
          ) //end filter
        ); // end concat
      } else {
        this.loansOverdue = loans;
      }
      this.cleanOverdueLoanArray(loans);
    }, err => {
      console.log(err);
      this.loadingService.dismissLoading();
    });
  }
  cleanOverdueLoanArray(loans) {
    for (var i = 0, len = loans.length; i < len; i++) { 
      for (var j = 0, len2 = this.loansActive.length; j < len2; j++) { 
          if (loans[i].idDoc === this.loansActive[j].idDoc) {
              this.loansActive.splice(j, 1);
              len2=this.loansActive.length;
          }
      }
  }
  }
  cleanActiveLoanArray(loans) {
    for (var i = 0, len = loans.length; i < len; i++) { 
      for (var j = 0, len2 = this.loansOverdue.length; j < len2; j++) { 
          if (loans[i].idDoc === this.loansOverdue[j].idDoc) {
              this.loansOverdue.splice(j, 1);
              len2=this.loansOverdue.length;
          }
      }
  }
  }
  radioBtnChange() {
    if(this.loanStatus == 'active') {
      this.loansService.nextQueryAfter = this.lastActiveLoan;
      if (this.subscriptionLoansActive == undefined && this.completeActiveLoad == false) {        
        this.loadLoans();
      } else if (this.subscriptionLoansActive != undefined && this.loansActive.length == 0) {
        this.subscriptionLoansActive.unsubscribe();
        this.loadLoans();
      }
    } else if(this.loanStatus == 'overdue') {
      this.loansService.nextQueryAfter = this.lastOverdueLoan; 
      if (this.subscriptionLoansOverdue == undefined && this.completeOverdueLoad == false) {
        this.loadLoans();
      } else if (this.subscriptionLoansOverdue != undefined && this.loansOverdue.length == 0) {
        this.subscriptionLoansOverdue.unsubscribe();
        this.loadLoans();
      }
    }
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
            if (this.loanStatus == 'active') {
              this.loansActive = this.loansActive.filter((doc) => doc.idDoc !== loan.idDoc);
            } else {
              this.loansOverdue = this.loansOverdue.filter((doc) => doc.idDoc !== loan.idDoc);
            }
            
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
    this.loansService.nextQueryAfter = null;
    if (this.loanStatus == 'active') {
      if (this.subscriptionLoansActive != undefined) {
        this.subscriptionLoansActive.unsubscribe();
      };
      this.completeActiveLoad = false;
      this.lastActiveLoan = null;
      this.loansActive = [];

    } else if (this.loanStatus == 'overdue') {
      
    if (this.subscriptionLoansOverdue != undefined) {
      this.subscriptionLoansOverdue.unsubscribe();
    };
      this.lastOverdueLoan = null;
      this.completeOverdueLoad = false;
      this.loansOverdue = [];
    }
    this.loadLoans();
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
