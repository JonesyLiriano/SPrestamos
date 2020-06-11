import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { LoansHistoryPage } from './loans-history.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { LoanReadModalPageModule } from '../loan-read-modal/loan-read-modal.module';
import { LoanReadModalPage } from '../loan-read-modal/loan-read-modal.page';
import { AuthGuard } from 'src/app/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: LoansHistoryPage,
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
    LoanReadModalPageModule
  ],
  declarations: [LoansHistoryPage],
  entryComponents: [LoanReadModalPage] 
})
export class LoansHistoryPageModule {}
