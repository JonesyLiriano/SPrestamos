import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import {IonicModule} from '@ionic/angular';
import {FilterComponent} from './components/filter/filter.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PaymentCardButtonComponent } from './components/payment-card-button/payment-card-button.component';


@NgModule({
  declarations: [ToolbarComponent, FilterComponent, PaymentCardButtonComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule
  ],
  exports: [
    ToolbarComponent,
    FilterComponent,
    ReactiveFormsModule,
    PaymentCardButtonComponent
  ]
})
export class SharedModule { }
