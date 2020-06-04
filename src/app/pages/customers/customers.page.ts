import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { CustomerUpdateReadModalPage } from '../customer-update-read-modal/customer-update-read-modal.page';
import { Customer } from 'src/app/models/customer';
import { CustomersService } from 'src/app/services/customers.service';
import { CustomerAddModalPage } from '../customer-add-modal/customer-add-modal.page';
import { Storage } from '@ionic/storage';
import { LoadingService } from 'src/app/services/loading.service';
import { delay } from 'q';
import { Subscription } from 'rxjs';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.page.html',
  styleUrls: ['./customers.page.scss'],
})
export class CustomersPage implements OnInit, AfterViewInit {

  customer: Customer;
  customers = [];
  search = '';
  infiniteScrolldisabled;
  subscriptionCustomers: Subscription;

  constructor(private modalController: ModalController, private alertController: AlertController,
    private customersService: CustomersService, private storage: Storage,
    private loadingService: LoadingService, private toastService: ToastService) { }

  async ngOnInit() {
    await this.loadingService.presentLoading('Cargando...');
    await delay(300);
    this.loadCustomers();
  }

  ngAfterViewInit() {
    this.loadingService.dismissLoading();
  }

  loadCustomers() {
    this.subscriptionCustomers = this.customersService.getCustomers(this.search).subscribe(customers => {
      if (customers.length < this.customersService.limit) {
        this.infiniteScrolldisabled = true;
      } else {
        this.infiniteScrolldisabled = false;
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

    }, err => {
      console.log(err);
      this.loadingService.dismissLoading();
      this.toastService.presentErrorToast('Ha ocurrido un error cargando los clientes, vuelva a intenarlo mas tarde.');
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
            this.customers = this.customers.filter((doc) => doc.idDoc !== customer.idDoc);
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
      componentProps: { customer }
    });
    await modal.present();
  }
  async infiniteEvent($event) {
    if (!this.infiniteScrolldisabled) {
      await this.loadCustomers();
      $event.target.complete();
    }    
  }
  async presentAddModal() {
    await this.loadingService.presentLoading('Cargando...');
    const modal = await this.modalController.create({
      component: CustomerAddModalPage
    });
    await modal.present();
  }

  onFilter(search: string) {
    if (this.subscriptionCustomers != undefined) {
      this.subscriptionCustomers.unsubscribe();
    };
    this.customersService.nextQueryAfter = null;
    this.infiniteScrolldisabled = false;
    this.customers = [];
    this.search = search;
    this.loadCustomers();
  }
}
