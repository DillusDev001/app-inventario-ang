import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { CustomInput1Component } from './components/custom-input-1/custom-input-1.component';
import { CustomInput2Component } from './components/custom-input-2/custom-input-2.component';
import { CustomTitleComponent } from './components/custom-title/custom-title.component';
import { CustomSubTitleComponent } from './components/custom-sub-title/custom-sub-title.component';
import { CustomLabel1Component } from './components/custom-label-1/custom-label-1.component';
import { CustomLabel2Component } from './components/custom-label-2/custom-label-2.component';
import { CustomAlertInput1Component } from './components/custom-alert-input-1/custom-alert-input-1.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomButton1Component } from './components/custom-button-1/custom-button-1.component';
import { IndexComponent } from './index.component';
import { CustomLabel3Component } from './components/custom-label-3/custom-label-3.component';
import { CustomLabel4Component } from './components/custom-label-4/custom-label-4.component';
import { CustomButton2Component } from './components/custom-button-2/custom-button-2.component';
import { CustomInput1DarkComponent } from './components/custom-input-1-dark/custom-input-1-dark.component';
import { CustomInput2DarkComponent } from './components/custom-input-2-dark/custom-input-2-dark.component';
import { CustomMenuButtonComponent } from './components/custom-menu-button/custom-menu-button.component';
import { CustomTabButtonComponent } from './components/custom-tab-button/custom-tab-button.component';
import { CustomMyLoadingComponent } from './components/custom-my-loading/custom-my-loading.component';
import { CustomDropDownComponent } from './components/custom-drop-down/custom-drop-down.component';
import { CustomDropDownDarkComponent } from './components/custom-drop-down-dark/custom-drop-down-dark.component';
import { CustomConnectionStatusComponent } from './components/custom-connection-status/custom-connection-status.component';
import { CustomStatusIndicatorComponent } from './components/custom-status-indicator/custom-status-indicator.component';


@NgModule({
  declarations: [
    CustomAlertInput1Component,

    CustomButton1Component,
    CustomButton2Component,

    CustomConnectionStatusComponent,

    CustomDropDownComponent,
    CustomDropDownDarkComponent,

    CustomInput1Component,
    CustomInput1DarkComponent,
    CustomInput2Component,
    CustomInput2DarkComponent,

    CustomMenuButtonComponent,

    CustomMyLoadingComponent,

    CustomStatusIndicatorComponent,

    CustomLabel1Component,
    CustomLabel2Component,
    CustomLabel3Component,
    CustomLabel4Component,

    CustomSubTitleComponent,

    CustomTabButtonComponent,

    CustomTitleComponent,



    IndexComponent,
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    CustomAlertInput1Component,

    CustomButton1Component,
    CustomButton2Component,

    CustomConnectionStatusComponent,

    CustomDropDownComponent,
    CustomDropDownDarkComponent,

    CustomInput1Component,
    CustomInput1DarkComponent,
    CustomInput2Component,
    CustomInput2DarkComponent,

    CustomMenuButtonComponent,

    CustomMyLoadingComponent,

    CustomStatusIndicatorComponent,

    CustomLabel1Component,
    CustomLabel2Component,
    CustomLabel3Component,
    CustomLabel4Component,

    CustomSubTitleComponent,

    CustomTabButtonComponent,

    CustomTitleComponent,
  ]
})
export class SharedModule { }