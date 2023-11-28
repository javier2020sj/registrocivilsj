import { Component, OnInit } from '@angular/core';
import { GlobalesService } from 'src/app/services/globales.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private svcGlobales:GlobalesService) { }

  administrador;
  ngOnInit(): void {
    this.administrador=this.svcGlobales.getUserPriv();
  }

}
