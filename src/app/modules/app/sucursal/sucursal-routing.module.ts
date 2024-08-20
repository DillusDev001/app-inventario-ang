import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexSucursalComponent } from './index-sucursal.component';

const routes: Routes = [
  { path: '', component: IndexSucursalComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SucursalRoutingModule { }
