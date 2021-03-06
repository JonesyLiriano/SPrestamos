import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { LoanGeneratorPage } from './loan-generator.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { IonicSelectableModule } from 'ionic-selectable';
import { AuthGuard } from 'src/app/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: LoanGeneratorPage,
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
    IonicSelectableModule 
  ],
  declarations: [LoanGeneratorPage]
})
export class LoanGeneratorPageModule {}
