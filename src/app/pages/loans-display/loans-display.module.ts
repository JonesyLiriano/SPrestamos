import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { LoansDisplayPage } from './loans-display.page';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { SharedModule } from 'src/app/shared/shared.module';
import { LoanReadModalPage } from '../loan-read-modal/loan-read-modal.page';
import { LoanReadModalPageModule } from '../loan-read-modal/loan-read-modal.module';
import { PaymentModalPageModule } from '../payment-modal/payment-modal.module';
import { PaymentModalPage } from '../payment-modal/payment-modal.page';


const routes: Routes = [
  {
    path: '',
    component: LoansDisplayPage,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedModule,
    LoanReadModalPageModule,
    PaymentModalPageModule
  ],
  declarations: [LoansDisplayPage],
  entryComponents: [LoanReadModalPage, PaymentModalPage] 
})
export class LoansDisplayPageModule {}
