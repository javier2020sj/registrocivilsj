import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalesService } from './globales.service';

@Injectable({
  providedIn: 'root'
})
export class PersonasService {

  constructor(private globales:GlobalesService, private http:HttpClient) { }


  async getByDni(dni:string)
  {
    return this.http.post(this.globales.getServer()+"personas/getByDni",{"token":this.globales.getToken(),"data":{"dni":dni}});
  }

  async getByName(name:string,limite=10,offset=0)
  {
    console.log("Limite: " + limite);
    console.log("Offset: " + offset);
    return this.http.post(this.globales.getServer()+"personas/getByName",{"token":this.globales.getToken(),"data":{"nombre":name,"limite":limite,"offset":offset}});
  }

  async update(id,nombre, apellido,fecha_nac,sexo,direccion,localidad,telefono,celular,email)
  {

    console.log(nombre);
    return this.http.post(this.globales.getServer()+"personas/update",{"token":this.globales.getToken(),"data":{"codigo":id,"nombre":nombre,"apellido":apellido,"fechaNac":fecha_nac,"sexo":sexo,"direccion":direccion,"localidad":localidad,"telefono":telefono,"celular":celular,"email":email}});
  }


  async new(dni,nombre, apellido,fecha_nac,sexo,direccion,localidad,telefono,celular,email)
  {

    console.log(nombre);
    return this.http.post(this.globales.getServer()+"personas/new",{"token":this.globales.getToken(),"data":{"dni":dni,"nombre":nombre,"apellido":apellido,"fechaNac":fecha_nac,"sexo":sexo,"direccion":direccion,"localidad":localidad,"telefono":telefono,"celular":celular,"email":email}});
  }
}
