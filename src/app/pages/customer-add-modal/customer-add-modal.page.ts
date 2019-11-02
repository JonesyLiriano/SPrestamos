import { Component, OnInit } from '@angular/core';
import { Customer } from 'src/app/models/customer';
import { ModalController, AlertController } from '@ionic/angular';
import { CustomersService } from 'src/app/services/customers.service';

@Component({
  selector: 'app-customer-add-modal',
  templateUrl: './customer-add-modal.page.html',
  styleUrls: ['./customer-add-modal.page.scss'],
})
export class CustomerAddModalPage implements OnInit {
  customer: Customer;
  refreshView = false;
  constructor(private modalController: ModalController, private alertController: AlertController,
              private customerService: CustomersService) { }

  ngOnInit() {
    
  }

  async onClickSubmit() {
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
             this.customerService.createCustomer(this.customer);
             this.refreshView = true;
             this.dismissModal();
            }
          }
        ]
      });
    await alert.present();
    }

  dismissModal() {
    if (this.modalController) {
      this.modalController.dismiss({
        refreshView: this.refreshView
      }).then(() => { this.modalController = null; });
    }
}
}
