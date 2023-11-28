import { Injectable } from '@angular/core';

import * as XLSX from 'xlsx';  

@Injectable({
  providedIn: 'root'
})
export class GlobalesService {

  constructor() { }

  //servidor="http://172.16.110.201:5000/";
  //servidor="http://200.45.208.208:5000/";
  servidor="/api";
  token;
  usuario={
    nombre:String,
    id_usuario:Number,
    admin:Boolean
  };

  getNombreUsuario()
  {
    return this.usuario.nombre;
  }
  getServer()
  {
    return this.servidor;
  }
  getUserId()
  {
    return this.usuario.id_usuario;
  }
  getUserPriv()
  {
    return this.usuario.admin?true:false;
  }
  setToken(Token,nombre,id_usuario,admin){
    this.token=Token;
    this.usuario.nombre=nombre;
    this.usuario.id_usuario=id_usuario;
    this.usuario.admin=admin;
  }
  getToken(){
    return this.token;
  }

  ExportTOExcel(json,titulo) {  
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);  
    ws['!cols']= [{ width: 15 }, { width: 20}, { width: 20 },{ width: 20 },{ width: 20 },{ width: 20 },{ width: 20 }, { width: 30 },{ width: 20},{ width: 20}];
    const wb: XLSX.WorkBook = XLSX.utils.book_new();  
    XLSX.utils.book_append_sheet(wb, ws, titulo);  
    XLSX.writeFile(wb, 'export.xlsx');  
  }  

  
}
