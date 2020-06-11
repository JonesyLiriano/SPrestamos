import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Loan } from 'src/app/models/loan';
import { ModalController } from '@ionic/angular';
import { LoansService } from 'src/app/services/loans.service';
import { LoadingService } from 'src/app/services/loading.service';
import { LoanReadModalPage } from '../loan-read-modal/loan-read-modal.page';
import { delay } from 'q';
import { Subscription } from 'rxjs';
import { VerifiedUserService } from 'src/app/services/verified-user.service';

@Component({
  selector: 'app-loans-history',
  templateUrl: './loans-history.page.html',
  styleUrls: ['./loans-history.page.scss'],
})
export class LoansHistoryPage implements OnInit, AfterViewInit {


  loan: Loan;
  loansCancelled = [];
  loansSettled = [];
  search = '';
  loanStatus: string;
  subscriptionLoansSettled: Subscription;
  subscriptionLoansCancelled: Subscription;
  completeSettledLoad = false;
  completeCancelledLoad = false;
  lastSettledLoan;
  lastCancelledLoan;
  verifiedUser = true;
  limitLoans = 0;

  constructor(private modalController: ModalController,
    private loansService: LoansService,
    private loadingService: LoadingService, private verifiedUserService: VerifiedUserService) { }

  async ngOnInit() {
    await this.loadingService.presentLoading('Cargando...');
    await delay(300);
    this.loanStatus = 'settled';
    this.verifiedUserService.verifiedUser$.subscribe(show => {
      this.verifiedUser = show;
    });
    this.verifiedUserService.loansLimit$.subscribe(show => {      
      this.limitLoans = show;
    });
  }
  
  ngAfterViewInit() {
    this.loadingService.dismissLoading();
  }

  async infiniteEvent($event) {
    if(this.loanStatus == 'settled') {
      if (!this.completeSettledLoad) {
        await this.loadLoans();
        $event.target.complete();
      }
    } else if(this.loanStatus == 'cancelled') {
      if (!this.completeCancelledLoad) {
        await this.loadLoans();
        $event.target.complete();
      }
    }    
  }
  async loadLoans() {
    if (this.loanStatus == 'cancelled') {
        this.getLoansCancelled();
    } else if(this.loanStatus == 'settled') {
        this.getLoansSettled();
    }
  }
 
  getLoansCancelled() {
    this.lastCancelledLoan = this.loansService.nextQueryAfter;
    this.subscriptionLoansCancelled= this.loansService.getLoans(this.loanStatus, this.search).subscribe(loans => {
      if (loans.length < this.loansService.limit) {
        this.completeCancelledLoad = true;
      } else {
        this.completeCancelledLoad = false;
      }
      if (this.loansCancelled.length > 0) {
        this.loansCancelled = this.loansCancelled.map(
          s => loans.find(
            t => t.idDoc == s.idDoc) || s
        ).concat( //end map of arr1
          loans.filter(
            s => !this.loansCancelled.find(t => t.idDoc == s.idDoc)
          ) //end filter
        ); // end concat
      } else {
        this.loansCancelled = loans;
      }
      this.cleanCancelledLoanArray(loans);

    }, err => {
      console.log(err);
      this.loadingService.dismissLoading();
    });
  }

  getLoansSettled() {
    this.lastSettledLoan = this.loansService.nextQueryAfter;
    this.subscriptionLoansSettled = this.loansService.getLoans(this.loanStatus, this.search).subscribe(loans => {
      this.lastSettledLoan = this.loansService.nextQueryAfter;
      if (loans.length < this.loansService.limit) {
        this.completeSettledLoad = true;
      } else {
        this.completeSettledLoad = false;
      }
      if (this.loansSettled.length > 0) {
        this.loansSettled = this.loansSettled.map(
          s => loans.find(
            t => t.idDoc == s.idDoc) || s
        ).concat( //end map of arr1
          loans.filter(
            s => !this.loansSettled.find(t => t.idDoc == s.idDoc)
          ) //end filter
        ); // end concat
      } else {
        this.loansSettled = loans;
      }
      this.cleanSettledLoanArray(loans);
    }, err => {
      console.log(err);
      this.loadingService.dismissLoading();
    });
  }
  cleanSettledLoanArray(loans) {
    for (var i = 0, len = loans.length; i < len; i++) { 
      for (var j = 0, len2 = this.loansCancelled.length; j < len2; j++) { 
          if (loans[i].idDoc === this.loansCancelled[j].idDoc) {
              this.loansCancelled.splice(j, 1);
              len2=this.loansCancelled.length;
          }
      }
  }
  }
  cleanCancelledLoanArray(loans) {
    for (var i = 0, len = loans.length; i < len; i++) { 
      for (var j = 0, len2 = this.loansSettled.length; j < len2; j++) { 
          if (loans[i].idDoc === this.loansSettled[j].idDoc) {
              this.loansSettled.splice(j, 1);
              len2=this.loansSettled.length;
          }
      }
  }
  }
  radioBtnChange() {
    if(this.loanStatus == 'cancelled') {
      this.loansService.nextQueryAfter = this.lastCancelledLoan;
      if (this.subscriptionLoansCancelled == undefined && this.completeCancelledLoad == false) {        
        this.loadLoans();
      } else if (this.subscriptionLoansCancelled != undefined && this.loansCancelled.length == 0) {
        this.subscriptionLoansCancelled.unsubscribe();
        this.loadLoans();
      }
    } else if(this.loanStatus == 'settled') {
      this.loansService.nextQueryAfter = this.lastSettledLoan; 
      if (this.subscriptionLoansSettled == undefined && this.completeSettledLoad == false) {
        this.loadLoans();
      } else if (this.subscriptionLoansSettled != undefined && this.loansSettled.length == 0) {
        this.subscriptionLoansSettled.unsubscribe();
        this.loadLoans();
      }
    }
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
    if (this.loanStatus == 'cancelled') {
      if (this.subscriptionLoansCancelled != undefined) {
        this.subscriptionLoansCancelled.unsubscribe();
      };
      this.completeCancelledLoad = false;
      this.lastCancelledLoan = null;
      this.loansCancelled = [];

    } else if (this.loanStatus == 'settled') {
      
    if (this.subscriptionLoansSettled != undefined) {
      this.subscriptionLoansSettled.unsubscribe();
    };
      this.lastSettledLoan = null;
      this.completeSettledLoad = false;
      this.loansSettled = [];
    }
    this.loadLoans();
  }

}