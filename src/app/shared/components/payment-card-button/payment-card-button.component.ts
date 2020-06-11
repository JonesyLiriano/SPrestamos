import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { LoadingService } from 'src/app/services/loading.service';
import { ModalController } from '@ionic/angular';
import { PaypalModalPage } from 'src/app/pages/paypal-modal/paypal-modal.page';

@Component({
  selector: 'app-payment-card-button',
  templateUrl: './payment-card-button.component.html',
  styleUrls: ['./payment-card-button.component.scss'],
})
export class PaymentCardButtonComponent implements OnInit, OnChanges {
@Input() loansLeft: number;
limitLoans: number;
  constructor(private loadingService: LoadingService, private modalController: ModalController) { }
  

  ngOnInit() {
    
  }

  ngOnChanges(changes): void { 
    if (changes.loansLeft) {
    this.limitLoans = 3 - changes.loansLeft.currentValue;
    }
  } 

  async presentPaymentModal() {
    await this.loadingService.presentLoading('Cargando...');
    const modal = await this.modalController.create({
      component: PaypalModalPage});
    await modal.present();
}
}
