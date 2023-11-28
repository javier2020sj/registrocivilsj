import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { GlobalesService } from 'src/app/services/globales.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  constructor(private svcGlobales:GlobalesService,
    private router:Router) { }

  administrador;
  nombre_usuario;
  ngOnInit(): void {
    this.administrador=this.svcGlobales.getUserPriv();
    this.nombre_usuario=this.svcGlobales.getNombreUsuario();
  }
  logout(){
    this.router.navigate(["/"]);
  }

}
