import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalesService } from './globales.service';




@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  constructor(private globales:GlobalesService,
    private http:HttpClient) { }

  async generate(datos)
  {
    //agrego la cantidad de puestospersonaId":idPersona,"schedId":idTurno
    //datos["puestos"]=1;

    console.log({"data":(datos),"token":this.globales.getToken()});
    //genero la agenda
    return this.http.post(this.globales.getServer()+"agenda/generate",{"data":(datos),"token":this.globales.getToken()});
  }
  async getFreeDates(delegacion, fecha)
  {
    return this.http.post(this.globales.getServer()+"agenda/getFreeSchedule",{"data":{"fecha":fecha,"delegacion_id":delegacion},"token":this.globales.getToken()});
  }

  async getAll()
  {
    return this.http.post(this.globales.getServer()+"agenda/getAll",{"data":{},"token":this.globales.getToken()});
  }

  async asignDate(idTurno, idPersona,idTipoTramite)
  {
    return this.http.post(this.globales.getServer()+"agenda/asignDate",{"data":{"personaId":idPersona,"tipoTramite":idTipoTramite,"schedId":idTurno},"token":this.globales.getToken()});
  }

  async getDates(idDelegacion, fechaInicio,fechaFin)
  {
    return this.http.post(this.globales.getServer()+"agenda/getByDeleg",{"data":{"delegacion_id":idDelegacion,"fechaInicio":fechaInicio,"fechaFin":fechaFin},"token":this.globales.getToken()});
  }

  async getDatesByDni(dni)
  {
    return this.http.post(this.globales.getServer()+"agenda/getByDni",{"data":{"dni":dni},"token":this.globales.getToken()});
  }

  async getDatesById(idAgenda)
  {
    return this.http.post(this.globales.getServer()+"agenda/getById",{"data":{"id":idAgenda},"token":this.globales.getToken()});
  }

  async cancel(idTurno)
  {
    return this.http.post(this.globales.getServer()+"agenda/cancel",{"data":{"idTurno":idTurno},"token":this.globales.getToken()});
  }
  async changepausestatus(id_agenda,status)
  {
    return this.http.post(this.globales.getServer()+"agenda/changepausestatus",{"data":{"idAgenda":id_agenda,"status":status},"token":this.globales.getToken()});
  }
}
