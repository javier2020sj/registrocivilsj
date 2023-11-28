import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaneladminRoutingModule } from './paneladmin-routing.module';
import { PaneladminComponent } from './paneladmin.component';
import { SchednewComponent } from './schednew/schednew.component';
import { AdminComponent } from '../layout/admin/admin.component';


import { MdbAccordionModule } from 'mdb-angular-ui-kit/accordion';
import { MdbCarouselModule } from 'mdb-angular-ui-kit/carousel';
import { MdbCheckboxModule } from 'mdb-angular-ui-kit/checkbox';

import { MdbDropdownModule } from 'mdb-angular-ui-kit/dropdown';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { MdbModalModule } from 'mdb-angular-ui-kit/modal';
import { MdbPopoverModule } from 'mdb-angular-ui-kit/popover';
import { MdbRadioModule } from 'mdb-angular-ui-kit/radio';
import { MdbRangeModule } from 'mdb-angular-ui-kit/range';
import { MdbRippleModule } from 'mdb-angular-ui-kit/ripple';
import { MdbScrollspyModule } from 'mdb-angular-ui-kit/scrollspy';
import { MdbTabsModule } from 'mdb-angular-ui-kit/tabs';
import { MdbTooltipModule } from 'mdb-angular-ui-kit/tooltip';
import { MdbValidationModule } from 'mdb-angular-ui-kit/validation';
import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsernewComponent } from './usernew/usernew.component';
import { UserlistComponent } from './userlist/userlist.component';
import { SchedlistComponent } from './schedlist/schedlist.component';
import { DatelistComponent } from './datelist/datelist.component';
import { DatenewComponent } from './datenew/datenew.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MdlschednewComponent } from './mdlschednew/mdlschednew.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { DeleglistComponent } from './deleglist/deleglist.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { SearchByNameComponent } from './datenew/search-by-name/search-by-name.component';




@NgModule({
  declarations: [
    PaneladminComponent,
    SchednewComponent,
    AdminComponent,
    DashboardComponent,
    UsernewComponent,
    UserlistComponent,
    SchedlistComponent,
    DatelistComponent,
    DatenewComponent,
    MdlschednewComponent,
    DeleglistComponent,
    SearchByNameComponent
  ],
  imports: [
    SelectDropDownModule,
    MatFormFieldModule,
    MatSelectModule,
    PaneladminRoutingModule,
    MdbAccordionModule,
    MdbCarouselModule,
    MdbCheckboxModule,
    MdbCollapseModule,
    MdbDropdownModule,
    MdbFormsModule,
    MdbModalModule,
    MdbPopoverModule,
    MdbRadioModule,
    MdbRangeModule,
    MdbRippleModule,
    MdbScrollspyModule,
    MdbTabsModule,
    MdbTooltipModule,
    MdbValidationModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,NgxPaginationModule
    
    
  ],
  exports: [
    PaneladminComponent,
    SchednewComponent,
    DashboardComponent,
    UsernewComponent,
    UserlistComponent,
    SchedlistComponent,
    DatelistComponent,
    DatenewComponent,
    MdlschednewComponent,
    DeleglistComponent
  ]
})
export class PaneladminModule { }
