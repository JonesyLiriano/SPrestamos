import { Component, OnInit, Input } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Customer } from 'src/app/models/customer';
import { CustomersService } from 'src/app/services/customers.service';

@Component({
  selector: 'app-customer-update-read-modal',
  templateUrl: './customer-update-read-modal.page.html',
  styleUrls: ['./customer-update-read-modal.page.scss'],
})
export class CustomerUpdateReadModalPage implements OnInit {
  @Input() customer: Customer;
  @Input() userLevel: string;


  constructor(private modalController: ModalController, private alertController: AlertController,
              private customerService: CustomersService) { }

  ngOnInit() {
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
             this.customerService.updateCustomer(this.customer);
             this.dismissModal();
            }
          }
        ]
      });
    await alert.present();
    }

  dismissModal() {
    if (this.modalController) {
      this.modalController.dismiss().then(() => { this.modalController = null; });
    }
}

}
