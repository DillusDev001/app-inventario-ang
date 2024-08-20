import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexProductoComponent } from './index-producto/index-producto.component';
import { ListaProductoComponent } from './components/lista-producto/lista-producto.component';
import { AgregarProductoComponent } from './components/agregar-producto/agregar-producto.component';

const routes: Routes = [
  //{ path: '', redirectTo: '', pathMatch: 'full' },
  { path: '', component: ListaProductoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductoRoutingModule { }
