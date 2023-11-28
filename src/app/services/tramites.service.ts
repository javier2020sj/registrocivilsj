import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalesService } from './globales.service';

@Injectable({
  providedIn: 'root'
})
export class TramitesService {

  constructor(private svcGlobales:GlobalesService,
    private http:HttpClient) { }


  async getAll()
  {
    return this.http.post(this.svcGlobales.getServer()+"tipostramites/getAll",{"token":this.svcGlobales.getToken()});
  }
}
