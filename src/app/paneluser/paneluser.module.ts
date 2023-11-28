import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaneluserRoutingModule } from './paneluser-routing.module';
import { PaneluserComponent } from './paneluser.component';


@NgModule({
  declarations: [
    PaneluserComponent
  ],
  imports: [
    CommonModule,
    PaneluserRoutingModule
  ],
  exports: [
    PaneluserComponent
  ]
})
export class PaneluserModule { }
