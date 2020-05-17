import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { CustomersService } from 'src/app/services/customers.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Customer } from 'src/app/models/customer';
import { Loan } from 'src/app/models/loan';
import { LoadingService } from 'src/app/services/loading.service';
import { ToastService } from 'src/app/services/toast.service';
import { LoansService } from 'src/app/services/loans.service';
import { AuthService } from 'src/app/services/auth.service';
import { delay } from 'q';

@Component({
  selector: 'app-loan-generator',
  templateUrl: './loan-generator.page.html',
  styleUrls: ['./loan-generator.page.scss'],
})
export class LoanGeneratorPage implements OnInit {

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

  customers: Customer[];
  payBacks: Array<string>;
  loanTerms: Array<string>;
  date: Date;
  maxDate: string;
  loan: Loan;
  constructor(private alertController: AlertController, private fb: FormBuilder, 
              private customersService: CustomersService, private loadingService: LoadingService,
              private toastService: ToastService, private loansService: LoansService,
              private authService: AuthService) { }

  ngOnInit() {
    this.payBacks = [
      'Por dia',
      'Semanal',
      'Quincenal',
      'Mensual',
      'Trimestral'
    ];
    this.date = new Date();
    this.inicializeDates();    
    this.maxDate = new Date((this.date.getTime() + 6.36e11) -
      this.date.getTimezoneOffset() * 60000).toISOString();
    this.loadCustomers();
  }
inicializeDates() {
  this.initialDate.setValue(new Date(this.date.getTime() -
      this.date.getTimezoneOffset() * 60000).toISOString());
    this.loanTerm.setValue(new Date(this.date.getTime() -
      this.date.getTimezoneOffset() * 60000).toISOString());
}

  async loadCustomers() {
    await this.loadingService.presentLoading('Cargando...');
    await delay(300); 
    this.customersService.getCustomers().subscribe(data => {
      this.customers = data;
      this.loadingService.dismissLoading();
    }, err => {
      this.loadingService.dismissLoading();
    });
  }
  async onSubmit() {
    try {
      if (this.loanForm.valid) {
        const alert = await this.alertController.create({
          header: 'Confirmacion!',
          message: 'Esta seguro que desea generar este <strong>prestamo</strong>?',
          buttons: [
            {
              text: 'Cancelar',
              role: 'cancel',
              cssClass: 'secondary'
            }, {
              text: 'Aceptar',
              handler: async () => {
                await this.loadingService.presentLoading('Cargando...');
                this.setLoan();
                await this.loansService.createLoan(this.loan);
                this.loanForm.reset();
                this.inicializeDates();
                this.toastService.presentSuccessToast('Prestamo registrado correctamente!');                
                this.loadingService.dismissLoading();  
                
              }
            }
          ]
        });
        await alert.present();
      } else {
        this.toastService.presentDefaultToast('Verifique los campos nuevamente.');
      }
    } catch (e) {
      this.toastService.presentErrorToast(e);
      this.loadingService.dismissLoading();
    }
  }
    setLoan() {
      this.loan = {
        initialDate: this.initialDate.value,
        customerId: this.customer.value['idDoc'],
        customer: this.customer.value['name'],
        interestRate: this.interestRate.value,
        loanAmount: this.loanAmount.value,
        loanTerm: this.loanTerm.value,
        payBack: this.payBack.value,
        logDate: this.date.toISOString(),
        uid: this.authService.userAuthData.uid,
        status: 'active',
        overdue: false,
      }
    }
  }
