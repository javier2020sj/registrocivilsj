import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { GlobalesService } from './globales.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient,
    private globales:GlobalesService) {}


  loginTest(user:string, password:string)
  {
    return this.http.post(this.globales.getServer()+"login",{"data":{"password":password,"username":user}});
  }

  async checkToken()
  {
    return this.http.post(this.globales.getServer()+"token",{"token":this.globales.getToken()});
  }
}
