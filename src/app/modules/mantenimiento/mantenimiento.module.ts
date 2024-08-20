import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MantenimientoRoutingModule } from './mantenimiento-routing.module';
import { ColorComponent } from './components/color/color.component';
import { TallaComponent } from './components/talla/talla.component';
import { MantenimientoComponent } from './mantenimiento.component';
import { SharedModule } from '../shared/shared.module';
import { CategoriaComponent } from './components/categoria/categoria.component';
import { MaterialComponent } from './components/material/material.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ColorComponent,
    TallaComponent,
    MantenimientoComponent,
    CategoriaComponent,
    MaterialComponent,
  ],
  imports: [
    CommonModule,
    MantenimientoRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class MantenimientoModule { }
