import { Component, OnInit } from '@angular/core';
import { DelegationsService } from 'src/app/services/delegations.service';
import { GlobalesService } from 'src/app/services/globales.service';
import { ScheduleService } from 'src/app/services/schedule.service';

@Component({
  selector: 'app-datelist',
  templateUrl: './datelist.component.html',
  styleUrls: ['./datelist.component.scss']
})
export class DatelistComponent implements OnInit {

  constructor(private svcSched:ScheduleService,
    private svcDelegaciones:DelegationsService,
    private svcGlobales:GlobalesService) { }

  lblMensajes;

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

  async fetchPosts() {
    let FechaInicio=this.fechaInicio + " 00:00:00";
    let FechaFin=this.fechaFin +' 23:59:59';
    let Delegacion=this.selDelegacion;

    //console.log("Inicio:" +FechaInicio + " Fecha Fin: " + FechaFin + " Delegacion: " + Delegacion);
    (await this.svcSched.getDates(Delegacion,FechaInicio,FechaFin)).subscribe(data=>{
      console.log(data["qty"]);
      if(data["qty"]>0){
        this.turnos=data["data"];
      }else{
        this.lblMensajes="No hay datos para mostrar";
      }

      
    }) 
  }
  turnos;
  fechaInicio;
  fechaFin;
  selDelegacion;
  delegaciones;
  delegSeleccionado;
  admin;
  manana;


  selectDeleg(){
    
    this.delegSeleccionado=this.delegaciones.filter(x=>x.id==this.selDelegacion)[0]; 
    this.turnos=null;


  }
  async ngOnInit(){

    this.admin=this.svcGlobales.getUserPriv();
    (await this.svcDelegaciones.getAll()).subscribe(data=>{
      this.delegaciones=data["data"];
      this.selDelegacion=0;
    })
  }

  async clickBuscar(){
      this.fetchPosts();
  }
  clickExportar(){

    //Reordeno columnas
    let listadoOrdenado=[];
    this.turnos.forEach(item => {
      listadoOrdenado.push({DELEGACION:item["delegacion"],FECHA:item["fechaHora"],DNI:item["dni"],APELLIDO: item["apellido"].toUpperCase(),NOMBRE:item["nombre"].toUpperCase(),TELEFONO:item["tel"],CELULAR:item["cel"],TRAMITE:item["tipo_tramite"],USUARIO:item["username"],CREADO:item["fechaCreacion"],ELIMINADO:item["cancelFecha"],USUARIO_ELIMINA:item["cancelUsuario"]})  
    });
    
    console.log(listadoOrdenado);
    this.svcGlobales.ExportTOExcel(listadoOrdenado,"Turnos");

  }
}
