
import { Component, OnInit } from '@angular/core';
import { DelegationsService } from 'src/app/services/delegations.service';
import { PersonasService } from 'src/app/services/personas.service';
import { ScheduleService } from 'src/app/services/schedule.service';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { MdlschednewComponent } from '../mdlschednew/mdlschednew.component';
import { TramitesService } from 'src/app/services/tramites.service';
import { Route, Router } from '@angular/router';
import { LocacionesService } from 'src/app/services/locaciones.service';
import { NgxDropdownConfig } from 'ngx-select-dropdown';


@Component({
  selector: 'app-datenew',
  templateUrl: './datenew.component.html',
  styleUrls: ['./datenew.component.scss']
})
export class DatenewComponent implements OnInit {

  constructor(
    private svcDelegaciones:DelegationsService, 
    private svcPersonas:PersonasService,
    private svcSchedule:ScheduleService,
    private modalService:MdbModalService,
    private svcTramites:TramitesService,
    private router:Router,
    private svcLocaciones:LocacionesService) { }
    modalRef:MdbModalRef<MdlschednewComponent>|null=null;
    

    // table pagination


page: number = 1;
count: number = 0;
tableSize: number = 5;
tableSizes: any = [3, 6, 9, 12];

onTableDataChange(event: any) {
  this.page = event;
  this.fetchPosts();
}
onTableSizeChange(event: any): void {
  this.tableSize = event.target.value;
  this.page = 1;
  this.fetchPosts();
}

cambiarDni(persona)
{
  console.log(persona);
  this.txtDni=persona["dni"];
  this.clickBuscar();
  //this.panelBuscar=false;
}

async fetchPosts() {
  (await this.svcSchedule.getDatesByDni(this.txtDni)).subscribe(data=>{
    
    this.turnosPendientes=data["data"];
    console.log(this.turnosPendientes);
  });
}

  //inputs
  searchByName=true;
  itemCancelar;  //variable donde se guarda el item que se cancelará
  idPersona;
  txtNombre;
  txtApellido;;
  txtDireccion;
  txtEmail;
  txtTel;
  txtCelular;
  txtDni;
  selLocalidades;
  localidades;
  fechaTurno;
  selDelegacion;
  selTramite;
  tipotramites;
  tramiteSeleccionado;
  delegaciones;
  selLocalidad;
  selhora;
  mensajeAlerta="";
  mensajeAlertaTipo="";
  fechaNacimiento;
  panelBuscar=true;
  panelDatos=false;
  panelTurno=false;
  panelDetalle=false;
  panelPendientes=false;
  turnosPendientes;
  botonBuscar;

  horarios;
  horaTurno;
  horaTurnoSeleccionado;
  selSexo;

  delegSeleccionado;

  
  config: NgxDropdownConfig = {
    displayKey: "nombre",
    height: "auto",
    search: true,
    placeholder: "Localidad",
    searchPlaceholder: "Buscar...",
    limitTo: 10,
    customComparator: undefined,
    noResultsFound: "Sin resultados!",
    moreText: "mas",
    searchOnKey: null,
    clearOnSelection: false,
    inputDirection: "ltr",
    selectAllLabel: "Select all",
    enableSelectAll: false,
  };
  configProv: NgxDropdownConfig = {
    displayKey: "nombre",
    height: "auto",
    search: true,
    placeholder: "Provincia",
    searchPlaceholder: "Buscar...",
    limitTo: 10,
    customComparator: undefined,
    noResultsFound: "Sin resultados!",
    moreText: "mas",
    searchOnKey: "nombre",
    clearOnSelection: false,
    inputDirection: "ltr",
    selectAllLabel: "Select all",
    enableSelectAll: false,
  };
  selectDeleg()
  {
    // al cambiar seleccionado en la delegación
    this.delegSeleccionado=this.delegaciones.filter(x=>x.id==this.selDelegacion)[0]; 
  }
  selectTramite()
  {
    // al cambiar seleccionado en la delegación
    this.tramiteSeleccionado=this.tipotramites.filter(x=>x.id==this.selTramite)[0]; 
    console.log(this.tramiteSeleccionado);
  }

  async clickdetalleFinaliza()
  {
    (await this.svcSchedule.asignDate(this.selhora,this.idPersona,this.selTramite)).subscribe(data=>{
      console.log(data);
      if(data["success"]=="ok"){
        this.txtDni="";
        this.abrirPanelBuscar();
        this.blanquearTodo();
        // this.mensajeAlerta=data["message"];
        // this.mensajeAlertaTipo="success";
        this.txtDni="";
        this.modalRef=this.modalService.open(MdlschednewComponent,{
          data: { title: 'Turno',message: data["message"]},
        });
        this.router.navigate(["/adminpanel"]);
        
      }
    });
  }

  mostrarModal(titulo,mensaje){
    this.modalRef=this.modalService.open(MdlschednewComponent,{
      data: { title: titulo,message: mensaje},
    });
  }
  clickTurnoSiguiente()
  {

    //Debo verificar los datos correctamente
    let DatosFaltantes="";
    let ban=true;
    if(this.selTramite==0) {
      DatosFaltantes+="Tipo de trámite ";
      ban=false;
    };
    if(this.selDelegacion==0) {
      DatosFaltantes+="Delegacion ";
      ban=false;
    };
    if(this.fechaTurno==undefined) 
    {
      console.log(this.fechaTurno);
      DatosFaltantes+="Fecha ";
      ban=false;
    }
    if(this.selhora==0 || this.selhora==undefined) {
      DatosFaltantes+="Hora ";
      ban=false;
    }

    if(ban)
    {
      this.abrirPanelDetalles();
      this.mensajeAlerta="";
    }
    else
    {
      this.mensajeAlerta="Falta completar los siguientes campos: " +DatosFaltantes;
      this.mensajeAlertaTipo="danger";
    }
    
  }

  horaChange()
  { 
    
    this.horaTurnoSeleccionado=this.horarios.filter(x=>x.sch_id==this.selhora)[0]["turno"];
  }

  async fechaChange(){
    (await this.svcSchedule.getFreeDates(this.selDelegacion,this.fechaTurno)).subscribe(data=>{
    
      this.horarios=data["data"];
      this.selhora=0;
    })
  }

  clickCerrarToast()
  {
    this.mensajeAlerta="";
  }


  clickCancelarTurno(item){
    this.itemCancelar=item;
  }
  async clickCancelarTurnoSi(item){
    console.log("Cancela turno");
    (await this.svcSchedule.cancel(item.id)).subscribe(data=>{
      console.log(data);
      if(data["success"]=="ok")
      {
        this.mostrarModal("Cancelar",data["message"]);
        this.fetchPosts();
      }
    })
  }
  clickCancelarTurnoNo(){
    this.itemCancelar=undefined;
  }
  onChange(){
    if(Number(this.txtDni)&&this.txtDni!="")
    {
      this.botonBuscar=false;
    }
    else
    {
      this.mensajeAlerta="El DNI debe ser solo numérico"
      this.mensajeAlertaTipo="danger"
      this.botonBuscar=true;
    }
  
  }
  numberOnly(event): boolean {
    
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }

    return true;
  }

  async clickBuscar()
  {

    this.searchByName=false;
    
    this.mensajeAlerta="";
    if(this.txtDni == undefined || this.txtDni == "")
    {
      this.mensajeAlerta="No se a escrito ningun DNI";
      this.mensajeAlertaTipo="danger";
    }else{


      (await this.svcPersonas.getByDni(this.txtDni)).subscribe(async data=>{

        console.log(data);
        if(data["data"].length > 0){
          this.idPersona=data["data"][0]["id"];
          this.txtNombre=data["data"][0]["nombre"];
          this.selSexo=data["data"][0]["sexo"];
          this.txtDireccion=data["data"][0]["domicilio"];
          let telefono=data["data"][0]["tel"];
          let celular=data["data"][0]["tel2"];
          if (isNaN(telefono))
          {
            telefono ="";
          }
          if (isNaN(celular))
          {
            celular ="";
          }
          this.txtTel=telefono;;
          this.txtCelular=celular;;;
          this.txtEmail=data["data"][0]["email"];
          this.txtApellido=data["data"][0]["apellido"];
          try {
            let dia=data["data"][0]["fecha_nac"].split("/",3)[0].length==1?"0"+data["data"][0]["fecha_nac"].split("/",3)[0]:data["data"][0]["fecha_nac"].split("/",3)[0];
            let mes=data["data"][0]["fecha_nac"].split("/",3)[1].length==1?"0"+data["data"][0]["fecha_nac"].split("/",3)[1]:data["data"][0]["fecha_nac"].split("/",3)[1];;
            let anio=data["data"][0]["fecha_nac"].split("/",3)[2];
            let fechaNac=anio + "-" +mes+ "-" +dia;
      
            this.fechaNacimiento= fechaNac ;
          } catch (error) {
            
            let fechaNac=Date.now();
      
            this.fechaNacimiento= fechaNac ;
            
          }

          //busco en el array de localidades la que tengo por base de datos
          try {
            this.selLocalidad=this.localidades.filter(dep=>dep.id==data["data"][0]["departamento"])[0];
            this.selProv=this.provincias.filter(prov=>prov.id==this.selLocalidad["provincia"]["id"]);  
          } catch (error) {
            console.log(error);
            this.selProv=this.provincias.filter(prov=>prov.id==70); 
          }
          
        }else{

          this.blanquearTodo();
          this.mensajeAlerta="Persona inexistente, cargar los datos personales";
          this.mensajeAlertaTipo="success";
          this.idPersona=0;
          //this.selProv.id="70";
          (await this.svcLocaciones.getDeptaramentos()).subscribe(data=>{
            this.localidades=data["departamentos"].filter(dep=>dep.provincia.id==this.selProv.id);
            console.log(this.localidades);
            this.selLocalidad=0;
          })
        }

        
      })
      
      this.panelDatos=true;
    }
    
  }

  async clickDatosGuardar()
  {

    //corrobora la correcta carga de datos

    let banDatos=true;
    let incomp=new Array();
    if(this.txtNombre==""){
      incomp.push("nombre");
      banDatos=false;
    }
    if(this.txtApellido==""){
      incomp.push("apellido");
      banDatos=false;
    }
    if(this.fechaNacimiento==undefined || this.fechaNacimiento==""){  

      incomp.push("fecha de nacimiento");
      banDatos=false;
    }
    if(this.txtDireccion==""){
      incomp.push("direccion");
      banDatos=false;
    }
    
    if((this.txtTel==""||this.txtTel==undefined) && (this.txtCelular==""||this.txtCelular==undefined)){
      incomp.push("Télefono o celular");
      banDatos=false;
    }
    if(this.selSexo==0){
      incomp.push("sexo");
      banDatos=false;
    }
    if(this.selLocalidad==0){
      incomp.push("localidad");
      banDatos=false;
    }
    if(this.txtEmail==""){
      incomp.push("email");
      banDatos=false;
    }
    if(banDatos){


      this.mensajeAlerta="";
      let fn=this.fechaNacimiento.split("-")[2]+"/"+this.fechaNacimiento.split("-")[1]+"/"+this.fechaNacimiento.split("-")[0];
      // Si la personas fue traida desde la base de datos
      if(this.idPersona!=0)
      {
        (await this.svcPersonas.update(this.idPersona,this.txtNombre,this.txtApellido,fn,this.selSexo,this.txtDireccion,this.selLocalidad["id"],this.txtTel,this.txtCelular,this.txtEmail)).subscribe(data=>{
      
          if(data["success"]=="ok"){
            this.mensajeAlerta="Los datos fueron guardados correctamente";
            this.mensajeAlertaTipo="success";
            this.abrirPanelPendientes();

          }else{
            this.mensajeAlerta="Los datos no fueron cargados correctamente";
            this.mensajeAlertaTipo="danger";
          }
        });
      } else
      {
        // si la persona es nueva
        (await this.svcPersonas.new(this.txtDni,this.txtNombre,this.txtApellido,fn,this.selSexo,this.txtDireccion,this.selLocalidad,this.txtTel,this.txtCelular,this.txtEmail)).subscribe(data=>{
      
          if(data["success"]=="ok"){
            this.mensajeAlerta="Los datos fueron guardados correctamente";
            this.mensajeAlertaTipo="success";
            this.abrirPanelPendientes();

          }else{
            this.mensajeAlerta="Se produjo un error al guardar los datos en la base de datos";
            this.mensajeAlertaTipo="danger";
          }
        });

      }
    }else{
      let campos="";
      incomp.forEach(element => {
        if(campos=="") campos=element;
        else campos=campos+"\n"+ element;
      });
      console.log(campos);
      this.mensajeAlerta="Los siguientes campos no fueron correctamente cargados " + campos;
      this.mensajeAlertaTipo="danger";
      
    }
    
  }

  provincias;
  departamentos;
  async ngOnInit() {
    //rellena el select de delegaciones
    this.botonBuscar=true;
    (await this.svcDelegaciones.getAll()).subscribe(data=>{
      this.delegaciones=data["data"];
    });

    //relleno el select de tipo de tramites
    (await this.svcTramites.getAll()).subscribe(data=>{
      this.tipotramites=data["data"];
    })

    this.selDelegacion=0;
    this.selSexo=0;
    this.selLocalidad=0;
    this.selTramite=0;    

    //relleno provincias

    (await this.svcLocaciones.getProvincias()).subscribe(data=>{
      this.provincias=data["provincias"];
      console.log(this.provincias);
    
    });

    (await this.svcLocaciones.getDeptaramentos()).subscribe(data=>{
      this.localidades=data["departamentos"];
       
      this.selLocalidad=0;
    })
    
    

  }
  selProv;
  async provChange()
  {
    console.log(this.selProv.id);
     (await this.svcLocaciones.getDeptaramentos()).subscribe(data=>{
       this.localidades=data["departamentos"].filter(dep=>dep.provincia.id==this.selProv.id);
       console.log(this.localidades);
       this.selLocalidad=0;
     })
  }

  localChange()
  {
      console.log(this.selLocalidad);
      let localidad=this.localidades.filter(dep=>dep.id==this.selLocalidad)[0];
      //console.log(localidad['provincia']['id']);
      //this.selProv=localidad['provincia']['id'];
  }
  abrirPanelBuscar(){

    this.searchByName=true;
    this.mensajeAlerta="";
    this.panelBuscar=true;;
    this.panelDatos=false;
    this.panelTurno=false;
    this.panelDetalle=false;
    this.panelPendientes=false;
    
  }
  abrirPanelDatos(){

    this.mensajeAlerta="";
    this.panelBuscar=true;;
    this.panelDatos=true;
    this.panelTurno=false;
    this.panelDetalle=false;
    this.panelPendientes=false;

  }
  manana;
  abrirPanelTurno(){

    var today = (new Date());
    var tomorrow = (new Date(today.setDate(today.getDate()+1)));
    
    var dd = String(tomorrow.getDate()).padStart(2, '0');
    var mm = String(tomorrow.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = tomorrow.getFullYear();

    this.manana=yyyy + "-" + mm + "-" + dd;
    this.panelBuscar=false;;
    this.panelDatos=false;
    this.panelTurno=true;;
    this.panelDetalle=false;
    this.panelPendientes=false;
    
  }
  abrirPanelDetalles(){

    this.mensajeAlerta="";
    this.panelBuscar=false;;
    this.panelDatos=false;
    this.panelTurno=false;
    this.panelDetalle=true;;
    this.panelPendientes=false;
    
  }

  async abrirPanelPendientes(){
    (await this.svcSchedule.getDatesByDni(this.txtDni)).subscribe(data=>{
      
      this.turnosPendientes=data["data"];

    });
    this.mensajeAlerta="";
    this.panelBuscar=false;;
    this.panelDatos=false;
    this.panelTurno=false;
    this.panelDetalle=false;;
    this.panelPendientes=true;
    
  }
  blanquearTodo()
  {
    this.turnosPendientes=undefined;
    this.idPersona=0;
    this.txtNombre="";
    this.txtApellido="";;
    this.txtDireccion="";
    this.txtEmail=undefined;
    this.txtTel=undefined;
    this.txtCelular=undefined;
    this.selLocalidades=0;
    this.fechaTurno=undefined;
    this.selDelegacion=0;
    this.selLocalidad=0;
    this.selhora=undefined;
    this.mensajeAlerta="";
    this.mensajeAlertaTipo="";
    this.fechaNacimiento=undefined;
    this.horaTurno=undefined;
    this.horaTurnoSeleccionado=undefined;
    this.selSexo=0;
  }

}