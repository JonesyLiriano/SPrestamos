import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CustomerUpdateReadModalPage } from './customer-update-read-modal.page';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule
  ],
  declarations: [CustomerUpdateReadModalPage],
  exports: [CustomerUpdateReadModalPage]
})
export class CustomerUpdateReadModalPageModule {}
