import { Component, OnInit } from '@angular/core';
import { arrow } from '@popperjs/core';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.scss']
})
export class UserlistComponent implements OnInit {

  constructor(private svcUsuarios:UsersService) { }

  usuarios;
  txtNombre;
  txtApellido;
  txtUsername;
  selAdmin;
  txtPassword;
  idUsuario;
  mensajeAlerta;
  mensajeAlertaTipo;

  panelModif = false;;
  panelLista = true;
  async ngOnInit(){
    this.abrirPanelLista();
  }
  clickCerrarToast()
  {
    this.mensajeAlerta="";
  }

  async cargarUsuarios(){
    (await this.svcUsuarios.getAll()).subscribe(data=>{
      console.log(data);
      this.usuarios=data["data"];
    });
  }
  RowSelected(row)
  {
    this.idUsuario=row['id'];
    this.txtNombre=row['name'];
    this.txtApellido=row['lastname'];
    this.txtUsername=row['username'];
    this.txtPassword=row['password'];
    this.selAdmin=row['admin'];
    this.abrirPanelModif();
  }


  nuevoUsuario(){
    this.idUsuario=0;
    this.txtNombre="";
    this.txtApellido="";
    this.txtUsername="";
    this.txtPassword="";
    this.selAdmin=0;
    this.abrirPanelModif();
  }

  async guardarUsuario(){
    let bandera=true;
    let datosFaltantes=new Array();
    if(this.txtNombre==undefined || this.txtNombre==""){
      datosFaltantes.push("Nombre");
      bandera=false;
    }
    if(this.txtApellido==undefined || this.txtApellido==""){
      datosFaltantes.push("Apellido");
      bandera=false;
    }
    if(this.txtUsername==undefined || this.txtUsername==""){
      datosFaltantes.push("Username");
      bandera=false;
    }
    if(this.txtPassword==undefined || this.txtPassword==""){
      datosFaltantes.push("Password");
      bandera=false;
    }
    if(bandera)
    {
      if(this.idUsuario==0)
      {
          (await this.svcUsuarios.new(this.txtNombre,this.txtApellido,this.txtUsername,this.txtPassword,this.selAdmin)).subscribe(data=>{
            console.log(data);
            if(data['success']=='ok')
            {
              this.abrirPanelLista();
              this.mensajeAlerta="El usuario fue creado correctamente";
              this.mensajeAlertaTipo="success"
            }else{
              this.mensajeAlerta=data["message"];
              this.mensajeAlertaTipo="danger"
            }
          });
      }else{
          (await this.svcUsuarios.update(this.txtNombre,this.txtApellido,this.txtUsername,this.txtPassword,this.selAdmin,this.idUsuario)).subscribe(data=>{
            if(data['success']=='ok')
            {
              this.abrirPanelLista();
              this.mensajeAlerta="El usuario fue modificado correctamente";
              this.mensajeAlertaTipo="success"
            }else{
              this.mensajeAlerta=data["message"];
              this.mensajeAlertaTipo="danger"
            }
          });
      }
    }else{
      this.mensajeAlerta="Los datos no fueron correctamente cargados";
      this.mensajeAlertaTipo="danger"
    }

  }
  abrirPanelLista(){
    this.mensajeAlerta="";
    this.cargarUsuarios();
    this.panelModif = false;;
    this.panelLista = true;
  }
  abrirPanelModif(){
    this.mensajeAlerta="";
    this.panelModif = true;;
    this.panelLista = false;
  }
  async eliminarUsuario()
  {
    (await this.svcUsuarios.delete(this.idUsuario)).subscribe(data=>{
      if(data["success"]=="ok")
      {
        this.mensajeAlerta="El usuario fue eliminado correctamente";
        this.mensajeAlertaTipo="success"
        this.abrirPanelLista();
      }
      else{
        this.mensajeAlerta=data["message"];
        this.mensajeAlertaTipo="danger"
      }
    });
  }
}
