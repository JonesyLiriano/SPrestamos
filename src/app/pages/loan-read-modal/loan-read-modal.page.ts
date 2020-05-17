import { Component, OnInit, Input } from '@angular/core';
import { Loan } from 'src/app/models/loan';
import { Validators, FormBuilder } from '@angular/forms';
import { LoadingService } from 'src/app/services/loading.service';
import { ModalController } from '@ionic/angular';
import { LoanDetailModalPage } from '../loan-detail-modal/loan-detail-modal.page';
import { LoansService } from 'src/app/services/loans.service';
import { LoanDetails } from 'src/app/models/loanDetails';
import { VirtualTimeScheduler } from 'rxjs';

@Component({
  selector: 'app-loan-read-modal',
  templateUrl: './loan-read-modal.page.html',
  styleUrls: ['./loan-read-modal.page.scss'],
})
export class LoanReadModalPage implements OnInit {

  @Input() loan: Loan;

  loanForm = this.fb.group({
    customer: ['', Validators.required],
    initialDate: ['', Validators.required],
    interestRate: ['', Validators.required],
    loanAmount: ['', Validators.required],
    loanTerm: ['', [Validators.required]],
    payBack: ['', [Validators.required]],
    lastPaymentDate: ['', [Validators.required]],
    pendingAmountInput: ['', Validators.required],
    overdues: ['', Validators.required],
    cuote: ['', Validators.required]
  });

  get customer() {
    return this.loanForm.get('customer');
  }
  get initialDate() {
    return this.loanForm.get('initialDate');
  }
  get interestRate() {
    return this.loanForm.get('interestRate');
  }
  get loanAmount() {
    return this.loanForm.get('loanAmount');
  }
  get loanTerm() {
    return this.loanForm.get('loanTerm');
  }
  get payBack() {
    return this.loanForm.get('payBack');
  }
  get lastPaymentDate() {
    return this.loanForm.get('lastPaymentDate');
  }
  get pendingAmountInput() {
    return this.loanForm.get('pendingAmountInput');
  }
  get overdues() {
    return this.loanForm.get('overdues');
  }
  get cuote() {
    return this.loanForm.get('cuote');
  }
  payments: LoanDetails[];
  pendingAmount: number;
  lastPayment: string;
  constructor(private fb: FormBuilder, private loadingService: LoadingService,
    private modalController: ModalController, private loansService: LoansService) { }

  ngOnInit() {
    this.customer.setValue(this.loan.customer);
    this.initialDate.setValue(this.loan.initialDate);
    this.interestRate.setValue(this.loan.interestRate);
    this.loanAmount.setValue(this.loan.loanAmount);
    this.loanTerm.setValue(this.loan.loanTerm);
    this.payBack.setValue(this.loan.payBack);
    this.getDetail();
    this.pendingAmount = 0;
  }

  ngAfterViewInit(): void {
    this.loadingService.dismissLoading();
  }

  async dismissModal() {
    if (this.modalController) {
      await this.modalController.dismiss();
      this.modalController = null;
    }
  }

  getDetail() {
    this.loansService.getLoanDetail(this.loan.idDoc).subscribe(data => {
      this.payments = data;
      this.payments.filter(x => x.paid == true && x.type == 'Capital').forEach(payment => {
        this.pendingAmount += (payment['amount']);
      });
      this.pendingAmount = this.loan.loanAmount - this.pendingAmount;
      this.lastPayment = new Date(Math.max.apply(null, this.payments.filter(x => x.paid == true).map(function (o) { return new Date(o.logDate) })) !=  '-Infinity' ?
      Math.max.apply(null, this.payments.filter(x => x.paid == true).map(function (o) { return new Date(o.logDate) })) : this.loan.initialDate).toISOString();
      this.lastPaymentDate.setValue(this.lastPayment);
      this.overdues.setValue(this.payments.filter(x => x.paid == false && x.type == 'Interes').length);
      this.pendingAmountInput.setValue(this.pendingAmount);
      this.cuote.setValue(this.pendingAmount * (this.loan.interestRate/100));
    });
  }

  async showDetails() {
    await this.loadingService.presentLoading('Cargando...');
    const modal = await this.modalController.create({
      component: LoanDetailModalPage,
      componentProps: { payments: this.payments }
    });
    await modal.present();
  }
}

