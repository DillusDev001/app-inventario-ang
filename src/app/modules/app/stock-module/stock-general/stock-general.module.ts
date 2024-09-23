import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StockGeneralRoutingModule } from './stock-general-routing.module';
import { StockGeneralComponent } from './stock-general.component';
import { SharedModule } from "../../../shared/shared.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductoModule } from '../../producto/producto.module';


@NgModule({
  declarations: [
    StockGeneralComponent
  ],
  imports: [
    CommonModule,
    StockGeneralRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,

    ProductoModule
  ]
})
export class StockGeneralModule { }
