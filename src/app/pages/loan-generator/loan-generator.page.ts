import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
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
import { VerifiedUserService } from 'src/app/services/verified-user.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { IonicSelectableComponent } from 'ionic-selectable';

@Component({
  selector: 'app-loan-generator',
  templateUrl: './loan-generator.page.html',
  styleUrls: ['./loan-generator.page.scss'],
})
export class LoanGeneratorPage implements OnInit {
  verifiedUser = true;
  limitLoans = 0;

  loanForm = this.fb.group({
    customer: ['', Validators.required],
    initialDate: ['', Validators.required],
    interestRate: ['', Validators.required],
    loanAmount: ['', Validators.required],
    loanTerm: ['', [Validators.required]],
    payBack: ['', [Validators.required]]
  });

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

  customers: Customer[] = [];
  customerModel: Customer;
  payBacks: Array<string>;
  loanTerms: Array<string>;
  date: Date;
  maxDate: string;
  loan: Loan;
  subscriptionCustomers: Subscription;
  search = '';
  inicializeCustomers = false;

  constructor(private alertController: AlertController, private fb: FormBuilder,
    private customersService: CustomersService, private loadingService: LoadingService,
    private toastService: ToastService, private loansService: LoansService,
    private authService: AuthService, private verifiedUserService: VerifiedUserService,
    private router: Router) { }

  async ngOnInit() {
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
    this.firstCustomersLoad();
    await delay(300);
  }
  ionViewDidEnter() {
    this.customersService.nextQueryAfter = null;
    this.verifiedUserService.verifiedUser$.subscribe(show => {
      this.verifiedUser = show;
      if (!this.verifiedUser) {
        this.verifiedUserService.loansLimit$.subscribe(show => {
          this.limitLoans = show;
          if (this.limitLoans >= 3 && this.verifiedUser == false) {
            this.showPaymentAlert();
          }
        });
      }
    });
  }
  ionViewWillLeave() {
    console.log('leavue');
    this.customersService.nextQueryAfter = null;
    if (this.subscriptionCustomers) {
      this.subscriptionCustomers.unsubscribe();
    };
  }
  inicializeDates() {
    this.initialDate.setValue(new Date(this.date.getTime() -
      this.date.getTimezoneOffset() * 60000).toISOString());
    this.loanTerm.setValue(new Date(this.date.getTime() -
      this.date.getTimezoneOffset() * 60000).toISOString());
  }

  firstCustomersLoad() {
    this.subscriptionCustomers = this.customersService.getCustomers(this.search).subscribe(customers => {
      this.customers = customers;
    }, err => {
      console.log(err);
      this.loadingService.dismissLoading();
      this.toastService.presentErrorToast('Ha ocurrido un error cargando los clientes, vuelva a intenarlo mas tarde.');
    });
  }

  loadCustomers(event: {
    component: IonicSelectableComponent,
    text: string
  }) {
      if(!this.customersService.allCustomerLoaded) {     
      this.subscriptionCustomers = this.customersService.getCustomers(this.search).subscribe(customers => {
        if (customers.length < this.customersService.limit && this.search == '') {
          //event.component.disableInfiniteScroll();
          event.component.endInfiniteScroll();
          event.component.hideLoading();
          this.customersService.allCustomerLoaded = true;
        }
        if (this.customers.length > 0) {
          this.customers = this.customers.map(
            s => customers.find(
              t => t.idDoc == s.idDoc) || s
          ).concat( //end map of arr1
            customers.filter(
              s => !this.customers.find(t => t.idDoc == s.idDoc)
            ) //end filter
          ); // end concat
        } else {
          this.customers = customers;
        }
        event.component.items = this.customers;       
        event.component.endInfiniteScroll();    

      }, err => {
        console.log(err);
        this.loadingService.dismissLoading();
        this.toastService.presentErrorToast('Ha ocurrido un error cargando los clientes, vuelva a intenarlo mas tarde.');
      });
    } else {
      event.component.endInfiniteScroll();
      event.component.hideLoading();
    }
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
      customerId: this.customerModel.idDoc,
      customer: this.customerModel.name,
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

  async showPaymentAlert() {
    const alert = await this.alertController.create({
      header: 'No puede realizar mas prestamos!',
      message: `Solo se permiten <strong>3</strong> prestamos activos.
    si quiere desbloquear todas las funcionalidades favor de realizar el pago correspondiente.
    Disculpe los inconvenientes.`,
      buttons: [
        {
          text: 'OK',
          handler: async () => {
            this.router.navigate(['/tabs/loans-display']);
          }
        }]
    });
    await alert.present();
  }
  filterCustomers(customers: Customer[], text: string) {
    return customers.filter(customer => {
      return customer.name.indexOf(text) !== -1;
    });
  }

  onFilter(event: {
    component: IonicSelectableComponent,
    text: string
  }) {

    let text = event.text;
    if (this.inicializeCustomers) {
      event.component.startSearch();
      if (this.customersService.allCustomerLoaded) {
        event.component.items = this.filterCustomers(this.customers, text);

      } else {
        if (this.subscriptionCustomers != undefined) {
          this.subscriptionCustomers.unsubscribe();
        };
        this.customersService.nextQueryAfter = null;
        this.customers = [];
        this.search = text;
        this.loadCustomers(event);
      }
      event.component.endSearch();
    } else {
      
      this.inicializeCustomers = true;
    }

  }

}
