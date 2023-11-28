import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalesService } from '../services/globales.service';

@Component({
  selector: 'app-paneluser',
  templateUrl: './paneluser.component.html',
  styleUrls: ['./paneluser.component.scss']
})
export class PaneluserComponent implements OnInit {

  constructor(
    private globales:GlobalesService,
    private router:Router
  ) { }

  ngOnInit(): void {
        
    if(this.globales.getToken()==undefined)
    {
      this.router.navigate(["/"]);
    }else{
      if(this.globales.getUserPriv() == true)
      {
        this.router.navigate(["adminpanel"]);
      }
    }
  }
}
