import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ColorComponent } from './components/color/color.component';
import { TallaComponent } from './components/talla/talla.component';
import { MantenimientoComponent } from './mantenimiento.component';

const routes: Routes = [
  { path: '', component: MantenimientoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MantenimientoRoutingModule { }
