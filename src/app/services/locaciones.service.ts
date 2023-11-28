import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalesService } from './globales.service';

@Injectable({
  providedIn: 'root'
})
export class LocacionesService {

  constructor(private globales:GlobalesService,
    private http:HttpClient) { }


  async getProvincias()
  {
    return this.http.get(this.globales.getServer()+"/locaciones/getProvincias");
  }

  async getDeptaramentos()
  {
    return this.http.get(this.globales.getServer()+"/locaciones/getDepartamentos");
  }
}
