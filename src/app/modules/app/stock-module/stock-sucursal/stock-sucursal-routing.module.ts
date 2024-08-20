import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StockSucursalComponent } from './stock-sucursal.component';

const routes: Routes = [
  { path: '', component: StockSucursalComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockSucursalRoutingModule { }
