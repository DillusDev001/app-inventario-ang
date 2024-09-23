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

      { path: 'stock', loadChildren: () => import('./../app/stock-module/stock.module').then(m => m.StockModule) },

      { path: 'cliente', loadChildren: () => import('./../app/cliente/cliente.module').then(m => m.ClienteModule) },

      // Compras

      { path: 'venta', loadChildren: () => import('./../app/venta-module/venta/venta.module').then(m => m.VentaModule) },

      { path: 'usuario', loadChildren: () => import('./../app/usuario/usuario.module').then(m => m.UsuarioModule) },

      { path: 'mantenimiento', loadChildren: () => import('./../mantenimiento/mantenimiento.module').then(m => m.MantenimientoModule) },
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndexRoutingModule { }
