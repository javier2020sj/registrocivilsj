import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PaneladminComponent } from './paneladmin/paneladmin.component';
import { PaneluserComponent } from './paneluser/paneluser.component';

const routes: Routes = [
  { path: '',component:LoginComponent},
  { path: 'adminpanel',component: PaneladminComponent,children: [
    { path: '', loadChildren: () => import('src/app/paneladmin/paneladmin.module').then(m => m.PaneladminModule)}]}, 
  { path: 'userpanel',component: PaneluserComponent,children: [
    { path: '', loadChildren: () => import('src/app/paneluser/paneluser.module').then(m => m.PaneluserModule)}]}, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
