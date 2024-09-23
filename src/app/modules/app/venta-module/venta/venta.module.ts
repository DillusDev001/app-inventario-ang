import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VentaRoutingModule } from './venta-routing.module';
import { ListaVentaComponent } from './lista-venta/lista-venta.component';
import { AddVentaComponent } from './add-venta/add-venta.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ZXingScannerModule } from '@zxing/ngx-scanner';


@NgModule({
  declarations: [
    ListaVentaComponent,
    AddVentaComponent
  ],
  imports: [
    CommonModule,
    VentaRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,

    
    ZXingScannerModule,
  ]
})
export class VentaModule { }
