import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { InicioComponent } from './components/inicio/inicio.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: 'inicio', component: InicioComponent },
      
      { path: 'producto', loadChildren: () => import('./../app/producto/producto.module').then(m => m.ProductoModule) },

      { path: 'almacen', loadChildren: () => import('./../app/almacen/almacen.module').then(m => m.AlmacenModule) },
      { path: 'sucursal', loadChildren: () => import('./../app/sucursal/sucursal.module').then(m => m.SucursalModule) },
      { path: 'stock/general', loadChildren: () => import('./../app/stock-module/stock-general/stock-general.module').then(m => m.StockGeneralModule) },
      { path: 'stock/sucursal', loadChildren: () => import('./../app/stock-module/stock-sucursal/stock-sucursal.module').then(m => m.StockSucursalModule) },

      { path: 'usuario', loadChildren: () => import('./../app/usuario/usuario.module').then(m => m.UsuarioModule) },
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndexRoutingModule { }
