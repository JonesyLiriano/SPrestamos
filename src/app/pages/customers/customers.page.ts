import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { CustomerUpdateReadModalPage } from '../customer-update-read-modal/customer-update-read-modal.page';
import { Customer } from 'src/app/models/customer';
import { CustomersService } from 'src/app/services/customers.service';
import { CustomerAddModalPage } from '../customer-add-modal/customer-add-modal.page';
import { Storage } from '@ionic/storage';
import { LoadingService } from 'src/app/services/loading.service';
import { delay } from 'q';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.page.html',
  styleUrls: ['./customers.page.scss'],
})
export class CustomersPage implements OnInit {
  
  customer: Customer;
  customers: Customer[];
  search;

  constructor(private modalController: ModalController, private alertController: AlertController,
              private customersService: CustomersService, private storage: Storage,
              private loadingService: LoadingService) {}

  ngOnInit() {
    this.loadCustomers();
  }


  async loadCustomers() {
  await this.loadingService.presentLoading('Cargando...');
  await delay(300); 
  this.customersService.getCustomers().subscribe(customers => {
    this.customers = customers;
    this.loadingService.dismissLoading();
  }, err => {
    this.loadingService.dismissLoading();
  });
  }

  async deleteCustomer(customer: Customer) {
    const alert = await this.alertController.create({
      header: 'Confirmacion!',
      message: 'Esta seguro que desea <strong>eliminar</strong> este cliente?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Eliminar',
          handler: async () => {
            await this.loadingService.presentLoading('Cargando...');
            await this.customersService.deleteCustomer(customer);
            this.loadingService.dismissLoading();
          }
        }
      ]
    });

    await alert.present();
  }

  async presentUpdateModal(customer: Customer) {
    await this.loadingService.presentLoading('Cargando...');
    const modal = await this.modalController.create({
    component: CustomerUpdateReadModalPage,
    componentProps: { customer}
  });
    await modal.present();
  }

  async presentAddModal() {
    await this.loadingService.presentLoading('Cargando...');
    const modal = await this.modalController.create({
    component: CustomerAddModalPage
  });
    await modal.present();
  }

  onFilter(search: string) {
    this.search = search;
}
}
