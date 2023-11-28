import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalesService } from './globales.service';

@Injectable({
  providedIn: 'root'
})
export class DelegationsService {


  constructor(private globales:GlobalesService,
    private http:HttpClient) { }

    async getAll()
    {
      return this.http.post(this.globales.getServer()+"delegaciones/getAll",{"token":this.globales.getToken()});
    }
    async delete(id_delegacion)
    {
      return this.http.post(this.globales.getServer()+"delegaciones/delete",{"token":this.globales.getToken(),"data":{"id":id_delegacion}});
    }
    async update(id_delegacion,nombre, direccion, descripcion, telefono,mail,localidad)
    {
      return this.http.post(this.globales.getServer()+"delegaciones/update",{"token":this.globales.getToken(),
      "data":{
        "id":id_delegacion,
        "nombre":nombre,
        "direccion":direccion,
        "localidad":localidad.toUpperCase(),
        "descripcion":descripcion,
        "telefono":telefono,
        "email":mail}});
    }
    async new(nombre, direccion, descripcion, telefono,mail,localidad)
    {
      return this.http.post(this.globales.getServer()+"delegaciones/new",{"token":this.globales.getToken(),
      "data":{
        "nombre":nombre,
        "direccion":direccion,
        "localidad":localidad.toUpperCase(),
        "descripcion":descripcion,
        "telefono":telefono,
        "email":mail}});
    }
}
