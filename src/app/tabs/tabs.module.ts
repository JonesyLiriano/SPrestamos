import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs-routing.module';
<<<<<<< HEAD

import { TabsPage } from './tabs.page';
=======
import { PaymentModalPage } from '../pages/payment-modal/payment-modal.page';
import { TabsPage } from './tabs.page';
import { PaymentModalPageModule } from '../pages/payment-modal/payment-modal.module';
>>>>>>> calculator

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
<<<<<<< HEAD
    TabsPageRoutingModule
  ],
  declarations: [TabsPage]
=======
    TabsPageRoutingModule,
    PaymentModalPageModule
  ],
  declarations: [TabsPage],
  entryComponents: [PaymentModalPage]
>>>>>>> calculator
})
export class TabsPageModule {}
