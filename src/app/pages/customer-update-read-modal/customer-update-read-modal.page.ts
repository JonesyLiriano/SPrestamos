import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Customer } from 'src/app/models/customer';
import { CustomersService } from 'src/app/services/customers.service';
import { Validators, FormBuilder } from '@angular/forms';
import { phoneNumberValidator } from 'src/app/validators/phone-validator';
import { LoadingService } from 'src/app/services/loading.service';
import { ToastService } from 'src/app/services/toast.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-customer-update-read-modal',
  templateUrl: './customer-update-read-modal.page.html',
  styleUrls: ['./customer-update-read-modal.page.scss'],
})
export class CustomerUpdateReadModalPage implements OnInit, AfterViewInit {
  @Input() customer: Customer;

  customerForm = this.fb.group({
    noDocument: [''],
    state: ['', Validators.required],
    street: ['', Validators.required],
    phone: ['', [Validators.required, phoneNumberValidator]],
    secondPhone: [''],
    email: ['', [Validators.email]]
  });

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
              private loadingService: LoadingService, private toastService: ToastService,
              private authService: AuthService) { }

  ngOnInit() {    
    this.noDocument.setValue(this.customer.noDocument);
    this.state.setValue(this.customer.address.state);
    this.street.setValue(this.customer.address.street);
    this.phone.setValue(this.customer.phone);
    this.secondPhone.setValue(this.customer.secondPhone);
    this.email.setValue(this.customer.email);
  }

  ngAfterViewInit(): void {
    this.loadingService.dismissLoading();
  }

  async onSubmit() {
    try {
      if (this.customerForm.valid) {
        const alert = await this.alertController.create({
          header: 'Confirmacion!',
          message: 'Esta seguro que desea aplicar los <strong>cambios</strong>?',
          buttons: [
            {
              text: 'Cancelar',
              role: 'cancel',
              cssClass: 'secondary'
            }, {
              text: 'Aceptar',
              handler: async () => {
                await this.loadingService.presentLoading('Cargando...');
                await this.customersService.updateCustomer(this.customer.idDoc,this.setCustomer());
                this.loadingService.dismissLoading(); 
                this.toastService.presentSuccessToast('Cliente actualizado correctamente!');
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
      name: this.customer.name,
      noDocument: this.noDocument.value,
      address: {
        state: this.state.value,
        street: this.street.value
      },
      phone: this.phone.value,
      secondPhone: this.secondPhone.value,
      email: this.email.value,
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
