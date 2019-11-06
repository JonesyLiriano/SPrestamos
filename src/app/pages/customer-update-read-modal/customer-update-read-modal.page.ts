import { Component, OnInit, Input } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Customer } from 'src/app/models/customer';
import { CustomersService } from 'src/app/services/customers.service';
import { Validators, FormBuilder } from '@angular/forms';
import { phoneNumberValidator } from 'src/app/validators/phone-validator';

@Component({
  selector: 'app-customer-update-read-modal',
  templateUrl: './customer-update-read-modal.page.html',
  styleUrls: ['./customer-update-read-modal.page.scss'],
})
export class CustomerUpdateReadModalPage implements OnInit {
  @Input() customer: Customer;

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
              private customerService: CustomersService, private fb: FormBuilder) { }

  ngOnInit() {
    this.customerForm.get('name').setValue(this.customer.name);
    this.customerForm.get('noDocument').setValue(this.customer.noDocument);
    this.customerForm.get('state').setValue(this.customer.address.state);
    this.customerForm.get('street').setValue(this.customer.address.street);
    this.customerForm.get('phone').setValue(this.customer.phone);
    this.customerForm.get('secondPhone').setValue(this.customer.secondPhone);
    this.customerForm.get('email').setValue(this.customer.email);
  }

  async onClickSubmit() {
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
            handler: () => {
             this.customerService.updateCustomer(this.populateCustomer());
             this.dismissModal();
            }
          }
        ]
      });
    await alert.present();
    }

    populateCustomer() {
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
        uid: this.customerService.uid
      }
    }

  dismissModal() {
    if (this.modalController) {
      this.modalController.dismiss().then(() => { this.modalController = null; });
    }
}

}
