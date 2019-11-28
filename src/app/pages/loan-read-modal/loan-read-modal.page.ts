import { Component, OnInit, Input } from '@angular/core';
import { Loan } from 'src/app/models/loan';
import { Validators, FormBuilder } from '@angular/forms';
import { LoadingService } from 'src/app/services/loading.service';
import { ModalController } from '@ionic/angular';
import { LoanDetailModalPage } from '../loan-detail-modal/loan-detail-modal.page';

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
    payBack: ['', [Validators.required]]
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


  constructor(private fb: FormBuilder, private loadingService: LoadingService,
              private modalController: ModalController) { }

  ngOnInit() {
    this.customer.setValue(this.loan.customerId);
    this.initialDate.setValue(this.loan.initialDate);
    this.interestRate.setValue(this.loan.interestRate);
    this.loanAmount.setValue(this.loan.loanAmount);
    this.loanTerm.setValue(this.loan.loanTerm);
    this.payBack.setValue(this.loan.payBack);
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

  async showDetails(loan: Loan) {
      await this.loadingService.presentLoading('Cargando...');
      const modal = await this.modalController.create({
      component: LoanDetailModalPage,
      componentProps: {loan}
    });
      await modal.present();
    }
  }

