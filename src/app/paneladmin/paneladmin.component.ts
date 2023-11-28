import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { bottom } from '@popperjs/core';
import { GlobalesService } from '../services/globales.service';

@Component({
  selector: 'app-paneladmin',
  templateUrl: './paneladmin.component.html',
  styleUrls: ['./paneladmin.component.scss']
})
export class PaneladminComponent implements OnInit{

  constructor(private globales:GlobalesService,
    private router:Router) { }


  ngOnInit(): void {

    if(this.globales.getToken()==undefined)
    {
      this.router.navigate(["/"]);
    }
    // else{
    //   if(this.globales.getUserPriv() == false)
    //   {
    //     this.router.navigate(["userpanel"]);
    //   }
    // }
  }


}
