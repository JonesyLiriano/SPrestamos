import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoanReadModalPage } from './loan-read-modal.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { LoanDetailModalPageModule } from '../loan-detail-modal/loan-detail-modal.module';
import { LoanDetailModalPage } from '../loan-detail-modal/loan-detail-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    LoanDetailModalPageModule
  ],
  declarations: [LoanReadModalPage],
  entryComponents: [LoanDetailModalPage]
})
export class LoanReadModalPageModule {}
