import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexUsuarioComponent } from './index-usuario/index-usuario.component';
import { ListaUsuarioComponent } from './components/lista-usuario/lista-usuario.component';
import { AgregarUsuarioComponent } from './components/agregar-usuario/agregar-usuario.component';

const routes: Routes = [
  { path: '', component: ListaUsuarioComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuarioRoutingModule { }
