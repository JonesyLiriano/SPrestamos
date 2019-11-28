import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Customer } from 'src/app/models/customer';
import { ModalController, AlertController } from '@ionic/angular';
import { CustomersService } from 'src/app/services/customers.service';
import { FormBuilder, Validators } from '@angular/forms';
import { phoneNumberValidator } from 'src/app/validators/phone-validator';
import { ToastService } from 'src/app/services/toast.service';
import { LoadingService } from 'src/app/services/loading.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-customer-add-modal',
  templateUrl: './customer-add-modal.page.html',
  styleUrls: ['./customer-add-modal.page.scss'],
})
export class CustomerAddModalPage implements OnInit, AfterViewInit {
 
  customer: Customer;

  customerForm = this.fb.group({
    name: ['', Validators.required],
    noDocument: [''],
    state: ['', Validators.required],
    street: ['', Validators.required],
    phone: ['', [Validators.required, phoneNumberValidator]],
    secondPhone: [''],
    email: ['', [Validators.email]]
  });

  get name() {
    return this.customerForm.get('name');
  }
  get noDocument() {
    return this.customerForm.get('noDocument');
  }
  get state() {
    return this.customerForm.get('state');
  }
  get street() {
    return this.customerForm.get('street');
  }
  get phone() {
    return this.customerForm.get('phone');
  }
  get secondPhone() {
    return this.customerForm.get('secondPhone');
  }
  get email() {
    return this.customerForm.get('email');
  }

  constructor(private modalController: ModalController, private alertController: AlertController,
    private customersService: CustomersService, private fb: FormBuilder,
    private toastService: ToastService, private loadingService: LoadingService,
    private authService: AuthService
    ) { }

  ngOnInit() {

  }
  ngAfterViewInit(): void {
    this.loadingService.dismissLoading();
  }
  async onSubmit() {
    try {
      if (this.customerForm.valid) {
        const alert = await this.alertController.create({
          header: 'Confirmacion!',
          message: 'Esta seguro que desea agregar a este <strong>cliente</strong>?',
          buttons: [
            {
              text: 'Cancelar',
              role: 'cancel',
              cssClass: 'secondary'
            }, {
              text: 'Aceptar',
              handler: async () => {
                await this.loadingService.presentLoading('Cargando...');
                await this.customersService.createCustomer(this.setCustomer());
                this.loadingService.dismissLoading(); 
                this.toastService.presentSuccessToast('Cliente registrado correctamente!');
                this.dismissModal();
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

  setCustomer() {
    return this.customer = {
      name: this.customerForm.value['name'],
      noDocument: this.customerForm.value['noDocument'],
      address: {
        state: this.customerForm.value['state'],
        street: this.customerForm.value['street']
      },
      phone: this.customerForm.value['phone'],
      secondPhone: this.customerForm.value['secondPhone'],
      email: this.customerForm.value['name'],
      uid: this.authService.userAuthData.uid
    }
  }

  async dismissModal() {
    if (this.modalController) {
      await this.modalController.dismiss();
      this.modalController = null;
    }
  }
}
