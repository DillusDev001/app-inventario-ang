import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexStockComponent } from './index-stock.component';

const routes: Routes = [
  {
    path: '',
    component: IndexStockComponent,
    children: [
      { path: 'general', loadChildren: () => import('./stock-general/stock-general.module').then(m => m.StockGeneralModule) },
      { path: 'sucursal', loadChildren: () => import('./stock-sucursal/stock-sucursal.module').then(m => m.StockSucursalModule) },
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockRoutingModule { }
