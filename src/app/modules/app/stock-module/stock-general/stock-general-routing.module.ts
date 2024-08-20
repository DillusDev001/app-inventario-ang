import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StockGeneralComponent } from './stock-general.component';

const routes: Routes = [
  { path: '', component: StockGeneralComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockGeneralRoutingModule { }
