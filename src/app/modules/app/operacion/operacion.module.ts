import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OperacionRoutingModule } from './operacion-routing.module';
import { AgregarOperacionComponent } from './components/agregar-operacion/agregar-operacion.component';
import { ListaOperacionComponent } from './components/lista-operacion/lista-operacion.component';


@NgModule({
  declarations: [
    AgregarOperacionComponent,
    ListaOperacionComponent
  ],
  imports: [
    CommonModule,
    OperacionRoutingModule
  ]
})
export class OperacionModule { }
