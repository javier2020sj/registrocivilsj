import { Component, OnInit } from '@angular/core';

import { DelegationsService } from 'src/app/services/delegations.service';
@Component({
  selector: 'app-deleglist',
  templateUrl: './deleglist.component.html',
  styleUrls: ['./deleglist.component.scss']
})
export class DeleglistComponent implements OnInit {

  constructor(private svcDeleg:DelegationsService) { }
  ngOnInit(): void {
    this.cargarDelegaciones();
    this.mensajeAlerta='';
  }
  idDelegacion;
  txtNombre;
  txtDescripcion;
  txtDireccion;
  selLocalidad;
  txtEmail;
  txtTelefono;
  mensajeAlerta;
  mensajeAlertaTipo;
  idDeleg;
  panelModif = false;;
  panelLista = true;
  delegaciones;
  clickCerrarToast()
  {
    this.mensajeAlerta="";
  }

  RowSelected(row)
  {
    this.idDelegacion=row['id'];
    this.txtNombre=row['nombre'];
    this.txtDescripcion=row['descripcion'];
    this.txtDireccion=row['direccion'];
    this.txtEmail=row['email'];
    this.txtTelefono=row['telefono'];
    this.selLocalidad=row['localidad'].toLowerCase();
    this.abrirPanelModif();
  }
  nuevaDeleg(){
    this.idDelegacion=0;

    this.txtNombre="";
    this.txtDescripcion="";
    this.txtDireccion="";
    this.txtEmail="";
    this.txtTelefono="";
    this.selLocalidad=0;
    this.abrirPanelModif();
  }

  async guardarDeleg(){
    if(this.idDelegacion==0)
    {
      (await this.svcDeleg.new(this.txtNombre,this.txtDireccion,this.txtDescripcion,this.txtTelefono,this.txtEmail,this.selLocalidad)).subscribe(data=>{
        if (data["success"]=='ok') {
          this.abrirPanelLista();
          this.mensajeAlerta=data["message"];
          this.mensajeAlertaTipo="success";
        }
      })
    }
    else{
      (await this.svcDeleg.update(this.idDelegacion,this.txtNombre,this.txtDireccion,this.txtDescripcion,this.txtTelefono,this.txtEmail,this.selLocalidad)).subscribe(data=>{
        if (data["success"]=='ok') {
          this.abrirPanelLista();
          this.mensajeAlerta=data["message"];
          this.mensajeAlertaTipo="success";
        }
      })
    }
  }
  async eliminarDeleg(){
    (await this.svcDeleg.delete(this.idDelegacion)).subscribe(data=>{
      if (data["success"]=='ok') {
        this.abrirPanelLista();
        this.mensajeAlerta=data["message"];
        this.mensajeAlertaTipo="success";
      }
    })
  }
  abrirPanelLista(){
    this.mensajeAlerta="";
    this.cargarDelegaciones();
    this.panelModif = false;;
    this.panelLista = true;
  }
  abrirPanelModif(){
    this.mensajeAlerta="";
    this.panelModif = true;;
    this.panelLista = false;
  }
  async cargarDelegaciones(){
    (await this.svcDeleg.getAll()).subscribe(data=>{
      this.delegaciones=data["data"];
    })
  }
}
