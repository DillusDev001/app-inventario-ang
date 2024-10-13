import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuarioRoutingModule } from './usuario-routing.module';
import { IndexUsuarioComponent } from './index-usuario/index-usuario.component';
import { ListaUsuarioComponent } from './components/lista-usuario/lista-usuario.component';
import { AgregarUsuarioComponent } from './components/agregar-usuario/agregar-usuario.component';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    IndexUsuarioComponent,
    ListaUsuarioComponent,
    AgregarUsuarioComponent,
  ],
  imports: [
    CommonModule,
    UsuarioRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  exports:[
    AgregarUsuarioComponent
  ]
})
export class UsuarioModule { }
