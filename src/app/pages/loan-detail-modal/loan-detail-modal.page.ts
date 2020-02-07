import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { LoadingService } from 'src/app/services/loading.service';
import { LoansService } from 'src/app/services/loans.service';
import { Loan } from 'src/app/models/loan';
import { ModalController } from '@ionic/angular';
import {LoanDetails} from '../../models/loanDetails';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-loan-detail-modal',
  templateUrl: './loan-detail-modal.page.html',
  styleUrls: ['./loan-detail-modal.page.scss'],
})
export class LoanDetailModalPage implements OnInit, AfterViewInit {
 
 @Input() payments: LoanDetails[];
 amountPayments: number;
 interes: number;
 capital: number;
  constructor(private loadingService: LoadingService, private loansService: LoansService,
              private modalController: ModalController) { }

  ngOnInit() {
    this.capital = 0;
    this.interes = 0;
    this.amountPayments = 0;
    this.calculatePayments();
  }

  ngAfterViewInit(): void {
    this.loadingService.dismissLoading();    
  } 

  calculatePayments() {
    this.payments.filter(x => x.paid == true).forEach(payment => {
      if (payment.type == 'Interes') {
        this.interes += payment.amount;
        this.amountPayments++;
      } else if (payment.type == 'Capital') {
        this.capital += payment.amount;
        this.amountPayments++;
      }      
    });
  }

  async dismissModal() {
    if (this.modalController) {
      await this.modalController.dismiss();
      this.modalController = null;
    }
  }
}
