import { Component, OnInit } from '@angular/core';
import { MdbModalContainerComponent, MdbModalRef } from 'mdb-angular-ui-kit/modal';

@Component({
  selector: 'app-mdlschednew',
  templateUrl: './mdlschednew.component.html',
  styleUrls: ['./mdlschednew.component.scss']
})
export class MdlschednewComponent implements OnInit {


  constructor(public modalRef:MdbModalRef<MdlschednewComponent>) { }

  title: string | null = null;
  message: string | null = null;
  ngOnInit(): void {
  }

}
