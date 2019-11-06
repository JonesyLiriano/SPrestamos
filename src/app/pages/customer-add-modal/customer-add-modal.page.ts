import { Component, OnInit } from '@angular/core';
import { Customer } from 'src/app/models/customer';
import { ModalController, AlertController } from '@ionic/angular';
import { CustomersService } from 'src/app/services/customers.service';
import { FormBuilder, Validators } from '@angular/forms';
import { phoneNumberValidator } from 'src/app/validators/phone-validator';

@Component({
  selector: 'app-customer-add-modal',
  templateUrl: './customer-add-modal.page.html',
  styleUrls: ['./customer-add-modal.page.scss'],
})
export class CustomerAddModalPage implements OnInit {
  customer: Customer;

  customerForm = this.fb.group({
    name: ['', Validators.required],
    noDocument: ['', Validators.required],
    state: ['', Validators.required],
    street: ['', Validators.required],    
    phone: ['', [Validators.required, phoneNumberValidator]],
    secondPhone: ['', [Validators.required, phoneNumberValidator]],
    email: ['', [Validators.required, Validators.email]]
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
              private customerService: CustomersService, private fb: FormBuilder,
              ) { }

  ngOnInit() {
    
  }

  async onSubmit() {
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
            handler: () => {
              this.customerService.createCustomer(this.populateCustomer());
              this.dismissModal();
            }
          }
        ]
      });
    await alert.present();
    }

  populateCustomer() {
    return this.customer = {
      id: '',
      name: this.customerForm.value['name'],
      noDocument: this.customerForm.value['noDocument'],
      address: {
        state: this.customerForm.value['state'],
        street: this.customerForm.value['street']
      },
      phone: this.customerForm.value['phone'],
      secondPhone: this.customerForm.value['secondPhone'],
      email: this.customerForm.value['name'],
      uid: this.customerService.uid
    }
  }

  dismissModal() {
    if (this.modalController) {
      this.modalController.dismiss().then(() => { this.modalController = null; });
    }
}
}
