import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductoRoutingModule } from './producto-routing.module';
import { IndexProductoComponent } from './index-producto/index-producto.component';
import { ListaProductoComponent } from './components/lista-producto/lista-producto.component';
import { AgregarProductoComponent } from './components/agregar-producto/agregar-producto.component';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgregarMultipleProductoComponent } from './components/agregar-multiple-producto/agregar-multiple-producto.component';


@NgModule({
  declarations: [
    IndexProductoComponent,
    ListaProductoComponent,
    AgregarProductoComponent,
    AgregarMultipleProductoComponent,
  ],
  imports: [
    CommonModule,
    ProductoRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [
    AgregarProductoComponent
  ]
})
export class ProductoModule { }
