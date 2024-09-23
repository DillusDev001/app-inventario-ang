import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaVentaComponent } from './lista-venta/lista-venta.component';
import { AddVentaComponent } from './add-venta/add-venta.component';

const routes: Routes = [
  { path: '', component: ListaVentaComponent },
  //{ path: 'venta', component: AddVentaComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VentaRoutingModule { }
