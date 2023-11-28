import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { PersonasService } from 'src/app/services/personas.service';

@Component({
  selector: 'app-search-by-name',
  templateUrl: './search-by-name.component.html',
  styleUrls: ['./search-by-name.component.scss']
})
export class SearchByNameComponent implements OnInit {

  @Output() personaSeleccionada = new EventEmitter();
  constructor(
    private svcPersonas:PersonasService
    ) { }

  panelPersonas=false;
  txtNombre;
  personas=[];
  limite=10;
  offset=0;
  btnSiguiente=true;
  btnAnterior=false;

  ngOnInit(): void {
  }

  SelPersona(persona){
    this.panelPersonas=false;
    this.personaSeleccionada.emit(persona);

  }

  async buscarNombre()
  {
    this.offset=0;
    this.panelPersonas=true;
    (await this.svcPersonas.getByName(this.txtNombre)).subscribe(data=>{
        this.personas=data["data"];
        if(this.personas.length==this.limite){this.btnSiguiente=true;}
        else{this.btnAnterior=false; this.btnSiguiente=false;}
    })
  }


  async siguientePag(){
    if(this.personas.length==10)
    {
      this.offset++;
      (await this.svcPersonas.getByName(this.txtNombre,this.limite,this.offset)).subscribe(data=>{
        this.personas=data["data"];
        if(this.personas.length<this.limite)
        {
          this.btnSiguiente=false;
        }
        else
        {
          this.btnSiguiente=true;
        }
        if(this.offset>0)
        {
          this.btnAnterior=true;
        }
      })
    }
    
  }

  async anteriorPag(){
    if(this.offset>0)
    {
      this.offset--;
      (await this.svcPersonas.getByName(this.txtNombre,this.limite,this.offset)).subscribe(data=>{
        this.personas=data["data"];
        if(this.offset==0)
        {
          this.btnAnterior=false;
        }
        else{
          this.btnAnterior=true;
        }
      })
    }
    
  }
}
