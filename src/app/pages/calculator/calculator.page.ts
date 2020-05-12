import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { ToastService } from 'src/app/services/toast.service';
import { formatCurrency } from '@angular/common';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.page.html',
  styleUrls: ['./calculator.page.scss'],
})
export class CalculatorPage implements OnInit {

  totalInteres: number;
  totalAmount: number;
  loanDuration: number;
  showResult: boolean;
  payBacks: Array<string>;
  calculatorForm = this.fb.group({
    interestRate: ['', Validators.required],
    loanAmount: ['', Validators.required],
    duration: ['', [Validators.required]],
    totalLoanAmount: [''],
    totalInteresAmount: [''],
    payBack: ['', [Validators.required]]
  });

  get interestRate() {
    return this.calculatorForm.get('interestRate');
  }
  get loanAmount() {
    return this.calculatorForm.get('loanAmount');
  }
  get duration() {
    return this.calculatorForm.get('duration');
  }
  get payBack() {
    return this.calculatorForm.get('payBack');
  }
  get totalLoanAmount() {
    return this.calculatorForm.get('totalLoanAmount');
  }
  get totalInteresAmount() {
    return this.calculatorForm.get('totalInteresAmount');
  }


  constructor(private fb: FormBuilder, private toastService: ToastService) {

  }

  ngOnInit(): void {
    this.payBacks = [
      'Por dia',
      'Semanal',
      'Quincenal',
      'Mensual',
      'Trimestral'
    ];
  }

  onSubmit() {
    try {
      if (this.calculatorForm.valid) {
        this.calculateLoan();
      }
    }
    catch (e) {
      this.toastService.presentErrorToast(e);
    }
  }

  clearForm() {
    this.calculatorForm.reset();
    this.showResult = false;
    this.loanDuration = 0;
    this.totalInteres = 0;
    this.totalAmount = 0;
  }

  calculateLoan() {
    switch (this.payBack.value) {
      case 'Por dia':
      this.loanDuration = this.duration.value * 30;
        break;
      case 'Semanal':
      this.loanDuration = this.duration.value * (30/7);
        break;
      case 'Quincenal':
        this.loanDuration = this.duration.value * 2;
        break;
      case 'Mensual':
        this.loanDuration = this.duration.value;
        break;
      case 'Trimestral':
        this.loanDuration = this.duration.value * (1/3);
        break;

      default:
        break;
    }
    this.totalInteres = this.loanDuration * (this.interestRate.value * this.loanAmount.value);
    this.totalAmount = this.totalInteres + this.loanAmount.value;
    this.totalInteresAmount.setValue(formatCurrency(this.totalInteres, 'en', '$'));
    this.totalLoanAmount.setValue(formatCurrency(this.totalAmount, 'en', '$'));
    this.showResult = true;
  }
}
