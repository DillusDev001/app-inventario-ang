import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StockSucursalRoutingModule } from './stock-sucursal-routing.module';
import { StockSucursalComponent } from './stock-sucursal.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductoModule } from '../../producto/producto.module';


@NgModule({
  declarations: [
    StockSucursalComponent
  ],
  imports: [
    CommonModule,
    StockSucursalRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,

    ProductoModule
  ]
})
export class StockSucursalModule { }
