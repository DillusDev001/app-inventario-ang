import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StockSucursalRoutingModule } from './stock-sucursal-routing.module';
import { StockSucursalComponent } from './stock-sucursal.component';


@NgModule({
  declarations: [
    StockSucursalComponent
  ],
  imports: [
    CommonModule,
    StockSucursalRoutingModule
  ]
})
export class StockSucursalModule { }
