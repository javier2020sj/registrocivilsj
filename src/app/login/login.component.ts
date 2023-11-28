import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalesService } from '../services/globales.service';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private loginService:LoginService,
    private globales:GlobalesService,
    private router:Router) {}

    username:string;
    password:string;
    warnMessage:string;
    warnFlag:boolean;
    
  ngOnInit() {
    
  }

  ngOnDestroy() {
  }

  login()
  {
    this.loginService.loginTest(this.username,this.password).subscribe(data=>
      {

        if(data["success"]=="fail")
        {
          this.warnMessage="Nombre de usuario o contraseña incorrectos"
          this.warnFlag=true;
        }else{
          this.warnFlag=false;
          this.globales.setToken(data["token"],data["name"],data["id"],data["admin"])
          this.warnMessage="Login correcto"
          this.router.navigate(["/adminpanel"]);
          //Redireccionar a Pagina Principal

        }
      });
  }


}
