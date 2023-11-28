import { Component, OnInit } from '@angular/core';
import { ScheduleService } from 'src/app/services/schedule.service';

@Component({
  selector: 'app-schedlist',
  templateUrl: './schedlist.component.html',
  styleUrls: ['./schedlist.component.scss']
})
export class SchedlistComponent implements OnInit {

  constructor(private svcSchedule:ScheduleService) { }

  agendas;
  itemCancelar;
  itemReanudar;
  itemTurno;
  
  turnos;
  ngOnInit(): void {
    this.fetchAgendas();
    this.abrirPanelListado();
  }


  // table pagination
  page: number = 1;
  count: number = 0;
  tableSize: number = 10;
  tableSizes: any = [3, 6, 9, 12];

  onTableDataChange(event: any) {
    this.page = event;
    this.fetchAgendas();
  }
  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.fetchAgendas();
  }

  async fetchAgendas() {
    (await this.svcSchedule.getAll()).subscribe(data=>{
      
      this.agendas=data["data"];
      console.log(this.agendas);
    });
  }

  // tabla turnos pagination
  tpage: number = 1;
  tcount: number = 0;
  ttableSize: number = 10;
  ttableSizes: any = [3, 6, 9, 12];

  onTableTurnosDataChange(event: any) {
    this.tpage = event;
    this.fetchTurnos();
  }
  onTableTurnosSizeChange(event: any): void {
    this.ttableSize = event.target.value;
    this.tpage = 1;
    this.fetchTurnos();
  }

  async fetchTurnos() {
    (await this.svcSchedule.getDatesById(this.itemTurno["id"])).subscribe(data=>{
      
      this.turnos=data["data"];
      console.log(this.agendas);
    });
  }
  ///PAUSAR AGENDA

  clickPausarAgenda(item){

    this.itemCancelar=item;
  }

  async clickPausarAgendaSi(item){
    console.log("Cancela turno");
    (await this.svcSchedule.changepausestatus(item.id,1)).subscribe(data=>{
      console.log(data);
      if(data["success"]=="ok")
      {
        // this.mostrarModal("Cancelar",data["message"]);
        this.fetchAgendas();
      }
    })
  }

  clickPausarAgendaNo(){
    this.itemCancelar=undefined;
  }

  ///REANUDAR AGENDA
  clickReanudarAgenda(item){
    this.itemReanudar=item;
  }

  async clickReanudarAgendaSi(item){
    console.log("Cancela turno");
    (await this.svcSchedule.changepausestatus(item.id,0)).subscribe(data=>{
      console.log(data);
      if(data["success"]=="ok")
      {
        // this.mostrarModal("Cancelar",data["message"]);
        this.fetchAgendas();
      }
    })
  }

  clickReanudarAgendaNo(){
    this.itemReanudar=undefined;
  }
  clickVerTurnos(item)
  {
    this.itemTurno=item;
    this.fetchTurnos();
    this.abrirPanelTurnos();
  }

  /// PANELES
  panelListado;
  panelTurnos;
  abrirPanelListado(){
    this.panelListado=true;
    this.panelTurnos=false;
  }
  abrirPanelTurnos(){
    this.panelListado=false;
    this.panelTurnos=true;
  }
}
