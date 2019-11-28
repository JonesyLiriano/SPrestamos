import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CustomersPage } from './customers.page';
import { SharedModule } from '../../shared/shared.module'
import { AuthGuard } from 'src/app/guards/auth.guard';
import { CustomerUpdateReadModalPage } from '../customer-update-read-modal/customer-update-read-modal.page';
import { CustomerAddModalPage } from '../customer-add-modal/customer-add-modal.page';
import { CustomerUpdateReadModalPageModule } from '../customer-update-read-modal/customer-update-read-modal.module';
import { CustomerAddModalPageModule } from '../customer-add-modal/customer-add-modal.module';
import { SearchCustomersPipe } from 'src/app/pipes/search-customers.pipe';

const routes: Routes = [
  {
    path: '',
    component: CustomersPage,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    RouterModule.forChild(routes),    
    CustomerUpdateReadModalPageModule,
    CustomerAddModalPageModule
  ],
  declarations: [CustomersPage, SearchCustomersPipe],
  entryComponents: [CustomerUpdateReadModalPage, CustomerAddModalPage]
})
export class CustomersPageModule {}
