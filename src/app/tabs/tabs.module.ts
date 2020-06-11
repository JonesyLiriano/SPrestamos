import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabsPageRoutingModule } from './tabs-routing.module';
import { PaymentModalPage } from '../pages/payment-modal/payment-modal.page';
import { TabsPage } from './tabs.page';
import { PaymentModalPageModule } from '../pages/payment-modal/payment-modal.module';
import { PaypalModalPage } from '../pages/paypal-modal/paypal-modal.page';
import { PaypalModalPageModule } from '../pages/paypal-modal/paypal-modal.module';


@NgModule({
  imports: [
    IonicModule,
    CommonModule, 
    FormsModule,
    TabsPageRoutingModule,
    PaymentModalPageModule,
    PaypalModalPageModule
  ],
  declarations: [TabsPage],
  entryComponents: [PaymentModalPage, PaypalModalPage]
})
export class TabsPageModule {}
