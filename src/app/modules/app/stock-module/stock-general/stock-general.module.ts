import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StockGeneralRoutingModule } from './stock-general-routing.module';
import { StockGeneralComponent } from './stock-general.component';


@NgModule({
  declarations: [
    StockGeneralComponent
  ],
  imports: [
    CommonModule,
    StockGeneralRoutingModule
  ]
})
export class StockGeneralModule { }
