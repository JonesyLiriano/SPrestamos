import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoanDetailModalPage } from './loan-detail-modal.page';
import { SharedModule } from 'src/app/shared/shared.module';

import {PaidPaymentsPipe } from '../../pipes/paid-payments.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule
  ],
  declarations: [LoanDetailModalPage, PaidPaymentsPipe]
})
export class LoanDetailModalPageModule {}
