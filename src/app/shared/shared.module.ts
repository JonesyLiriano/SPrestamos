import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import {IonicModule} from '@ionic/angular';
import {FilterComponent} from './components/filter/filter.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SearchLoansPipe } from '../pipes/search-loans.pipe';


@NgModule({
  declarations: [ToolbarComponent, FilterComponent, SearchLoansPipe],
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
    SearchLoansPipe
  ]
})
export class SharedModule { }
