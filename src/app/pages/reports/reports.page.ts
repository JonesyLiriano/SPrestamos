import { Component, OnInit } from '@angular/core';
import { LoansService } from 'src/app/services/loans.service';
import { LoadingService } from 'src/app/services/loading.service';
import { delay } from 'rxjs/operators';
import { Loan } from 'src/app/models/loan';
import { formatCurrency } from '@angular/common';
import { LoanDetails } from 'src/app/models/loanDetails';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
})
export class ReportsPage implements OnInit {

  monthLoansAmount: number;
  totalLoansAmount: number;
  today = new Date();
  actualMonth: number;
  actualYear: number;
  customersMonthAmount: number;
  cuotesMonthAmount: number;
  pendingCuotesMonthAmount: number;
  cuotesPaidMonthAmount: number;
  customersTotalAmount: number;
  cuotesTotalAmount: number;
  pendingCuotesTotalAmount: number;
  cuotesPaidTotalAmount: number;
  constructor(private loansService: LoansService, private loadingService: LoadingService) { }

  ngOnInit() {
    this.monthLoansAmount = 0;
    this.customersMonthAmount = 0;
    this.cuotesMonthAmount = 0;
    this.pendingCuotesMonthAmount = 0;
    this.cuotesPaidMonthAmount = 0;

    this.totalLoansAmount = 0;
    this.customersTotalAmount = 0;
    this.cuotesTotalAmount = 0;
    this.pendingCuotesTotalAmount = 0;
    this.cuotesPaidTotalAmount = 0;

    this.actualMonth = this.today.getMonth();
    this.actualYear = this.today.getFullYear();
    this.loadLoans();

  }

  async loadLoans() {
    await this.loadingService.presentLoading('Cargando...');
    await delay(300);
    this.loansService.getLoans('all').subscribe(data => {
      this.calculateReports(data);
      this.loadingService.dismissLoading();
    }, err => {
      console.log(err);
      this.loadingService.dismissLoading();
    });
  }

  calculateReports(loans: Loan[]) {
    loans.forEach(loan => {
      this.loansService.getLoanDetail(loan.idDoc).subscribe(data => {
        if (new Date(loan.initialDate).getMonth() == this.actualMonth
          && new Date(loan.initialDate).getFullYear() == this.actualYear) {
          this.monthReport(loan);
        }
        this.totalReport(loan, data);
      });
    });
  }

  monthReport(loan: Loan) {
    this.monthLoansAmount += +loan.loanAmount;
    this.customersMonthAmount++;
  }
  totalReport(loan: Loan, payments: LoanDetails[]) {
    this.totalLoansAmount += +loan.loanAmount;
    this.customersTotalAmount++;
    payments.filter(x => x.type == 'Interes').forEach(payment => {
      if (new Date(payment['logDate']).getMonth() == this.actualMonth
          && new Date(payment['logDate']).getFullYear() == this.actualYear) {
            this.cuotesMonthAmount += (payment['amount']);
            if (payment['paid'] == true) {
              this.cuotesPaidMonthAmount += (payment['amount']);
            } else {
              this.pendingCuotesMonthAmount += (payment['amount']);
            }
      }      
      this.cuotesTotalAmount += (payment['amount']);
      if (payment['paid'] == true) {
        this.cuotesPaidTotalAmount += (payment['amount']);
      } else {
        this.pendingCuotesTotalAmount += (payment['amount']);
      }
    });
  }
}
