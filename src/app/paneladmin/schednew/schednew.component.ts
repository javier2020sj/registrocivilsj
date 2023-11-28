import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { DelegationsService } from 'src/app/services/delegations.service';
import { GlobalesService } from 'src/app/services/globales.service';
import { ScheduleService } from 'src/app/services/schedule.service';
import { MdlschednewComponent } from '../mdlschednew/mdlschednew.component';

@Component({
  selector: 'app-schednew',
  templateUrl: './schednew.component.html',
  styleUrls: ['./schednew.component.scss']
})
export class SchednewComponent implements OnInit {

  constructor(private delegSvc:DelegationsService, 
    private globales:GlobalesService,
    private router:Router,
    private schedSvc:ScheduleService,
    private modalService:MdbModalService) { }
  deleg;

  //inputs
  selDelegations=0;
  fechaInicio;
  fechaFin;
  horaInicio="08:00";
  distancia=15;
  cantTurnos=2;
  cantPuestos=1;

  modalRef:MdbModalRef<MdlschednewComponent>|null=null;


  warnMessage;
    manana;
  async ngOnInit(){
    //obtengo los nombres de los medicos
    var today = (new Date());
    var tomorrow = (new Date(today.setDate(today.getDate()+1)));
    
    var dd = String(tomorrow.getDate()).padStart(2, '0');
    var mm = String(tomorrow.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = tomorrow.getFullYear();

    this.manana=yyyy + "-" + mm + "-" + dd;
    this.warnMessage="";
    (await this.delegSvc.getAll()).subscribe(data=>{
      this.deleg=data["data"];
      console.log(data["data"]);
    }
  )};

  //  pruebamodal()
  //  {
  //   this.modalRef=this.modalService.open(MdlschednewComponent,{
  //     data: { title: 'Custom title',message: 'Custom message'},
  //   });
  //  } 

  async guardarAgenda()
  {
    if(this.selDelegations!=0 && this.fechaInicio!=undefined && this.fechaFin!=undefined && this.horaInicio!="" && this.distancia>5 && this.cantPuestos>0 && this.cantTurnos>0)
    {

      await (await this.schedSvc.generate({"puestos":this.cantPuestos,
      "distancia":this.distancia,
      "fechaInicio":this.fechaInicio,
      "fechaFin":this.fechaFin,
      "cantTurnos":this.cantTurnos,
      "horaInicio":this.horaInicio,
      "delegacion_id":this.selDelegations})).subscribe(data=>{
        console.log(data);

        //abro modal con el mensaje que venga de la api
        this.modalRef=this.modalService.open(MdlschednewComponent,{
          data: { title: 'Agenda',message: data["message"]},
        });

        // si se guardo correctamente o no
        if(data["success"] == 'ok'){

        }else{

        }
  
      });

    }else{

      this.modalRef=this.modalService.open(MdlschednewComponent,{
        data: { title: 'Error',message: 'Faltan completar datos'},
      });
    }
    
  }
}
