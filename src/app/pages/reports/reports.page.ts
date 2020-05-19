import { Component, OnInit } from '@angular/core';
import { LoansService } from 'src/app/services/loans.service';
import { LoadingService } from 'src/app/services/loading.service';
import { delay } from 'rxjs/operators';
import { Loan } from 'src/app/models/loan';
import { formatCurrency } from '@angular/common';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
})
export class ReportsPage implements OnInit {

  loans: Loan[];
  totalLoansAmount;
  today = new Date();
  actualMonth: number;
  actualYear: number;
  customersMonthAmount: number
  constructor(private loansService: LoansService, private loadingService: LoadingService) { }

  ngOnInit() {
    this.totalLoansAmount = 0;
    this.customersMonthAmount = 0;
    this.actualMonth = this.today.getMonth();
    this.actualYear = this.today.getFullYear();
    this.loadLoans();
    
  }

  async loadLoans() {
    await this.loadingService.presentLoading('Cargando...');
    await delay(300);
    this.loansService.getLoans('all').subscribe(data => {
      this.loans = data;
      this.calculateMonthReport();
      this.loadingService.dismissLoading();
    }, err => {
      console.log(err);
      this.loadingService.dismissLoading();
    });
  }

  calculateMonthReport(){
    this.loans.forEach(loan => {
      if(new Date(loan.initialDate).getMonth() == this.actualMonth && new Date(loan.initialDate).getFullYear() == this.actualYear) {
        this.totalLoansAmount += +loan.loanAmount;
        this.customersMonthAmount++;
      }
    });
  }

}
