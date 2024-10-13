import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClienteRoutingModule } from './cliente-routing.module';
import { ListaClienteComponent } from './components/lista-cliente/lista-cliente.component';
import { AgregarClienteComponent } from './components/agregar-cliente/agregar-cliente.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { CuentaClienteComponent } from './components/cuenta-cliente/cuenta-cliente.component';


@NgModule({
  declarations: [
    ListaClienteComponent,
    AgregarClienteComponent,
    CuentaClienteComponent
  ],
  imports: [
    CommonModule,
    ClienteRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class ClienteModule { }
