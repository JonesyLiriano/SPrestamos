import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CalculatorPage } from './calculator.page';
import { AuthGuard } from 'src/app/guards/auth.guard';
<<<<<<< HEAD
=======
import { SharedModule } from 'src/app/shared/shared.module';
>>>>>>> calculator

const routes: Routes = [
  {
    path: '',
    component: CalculatorPage,
    canActivate: [AuthGuard]
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
  declarations: [CalculatorPage]
})
export class CalculatorPageModule {}
