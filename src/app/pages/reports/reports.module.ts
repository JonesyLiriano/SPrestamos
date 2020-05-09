import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ReportsPage } from './reports.page';
<<<<<<< HEAD
=======
import { SharedModule } from 'src/app/shared/shared.module';
>>>>>>> calculator

const routes: Routes = [
  {
    path: '',
    component: ReportsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
<<<<<<< HEAD
=======
    SharedModule,
>>>>>>> calculator
    RouterModule.forChild(routes)
  ],
  declarations: [ReportsPage]
})
export class ReportsPageModule {}
