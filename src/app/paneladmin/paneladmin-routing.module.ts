import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DatelistComponent } from './datelist/datelist.component';
import { DatenewComponent } from './datenew/datenew.component';
import { DeleglistComponent } from './deleglist/deleglist.component';
import { PaneladminComponent } from './paneladmin.component';
import { SchedlistComponent } from './schedlist/schedlist.component';
import { SchednewComponent } from './schednew/schednew.component';
import { UserlistComponent } from './userlist/userlist.component';
import { UsernewComponent } from './usernew/usernew.component';

const routes: Routes = [
  { path: '',component:DashboardComponent},
  { path: 'dashboard',component:DashboardComponent},
  { path: 'usernew',component:UsernewComponent},
  { path: 'deleglist',component:DeleglistComponent},
  { path: 'userlist',component:UserlistComponent},
  { path: 'schednew',component:SchednewComponent},
  { path: 'schedlist',component:SchedlistComponent},
  { path: 'datelist',component:DatelistComponent},
  { path: 'datenew',component:DatenewComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaneladminRoutingModule { }
