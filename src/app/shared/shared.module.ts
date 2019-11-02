import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import {IonicModule} from '@ionic/angular';
import {FilterComponent} from './components/filter/filter.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [ToolbarComponent, FilterComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    ToolbarComponent,
    FilterComponent,
    ReactiveFormsModule
  ]
})
export class SharedModule { }
