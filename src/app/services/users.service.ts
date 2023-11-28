import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalesService } from './globales.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private globales:GlobalesService,
    private http:HttpClient  ) { }

  async getAll()
  {

    return this.http.post(this.globales.getServer()+"usuarios/getAll",{"token":this.globales.getToken()});
  }

  async new(nombre, apellido, username,password,admin)
  {
    return this.http.post(this.globales.getServer()+"usuarios/new",{"token":this.globales.getToken(),"data":{
    "username":username,
    "password":password,
    "nombre":nombre,
    "apellido":apellido,
    "admin":admin}});
  }
  async update(nombre, apellido, username,password,admin,userid)
  {
    return this.http.post(this.globales.getServer()+"usuarios/update",{"token":this.globales.getToken(),"data":{
    "username":username,
    "password":password,
    "nombre":nombre,
    "apellido":apellido,
    "admin":admin,
    "id":userid}});
  }

  async delete(userid)
  {
    return this.http.post(this.globales.getServer()+"usuarios/delete",{"token":this.globales.getToken(),"data":{
    "id":userid}});
  }
}
