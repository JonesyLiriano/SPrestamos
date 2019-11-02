import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CustomersPage } from './customers.page';
import { SharedModule } from '../../shared/shared.module'
import { AuthGuard } from 'src/app/guards/auth.guard';
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
    RouterModule.forChild(routes)
  ],
  declarations: [CustomersPage]
})
export class CustomersPageModule {}
