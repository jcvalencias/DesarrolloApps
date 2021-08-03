import { Component, OnInit } from '@angular/core';
import { RondaModel } from 'src/app/models/ronda.model';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  listaRondas: RondaModel[] =[];
  constructor(
    private general: GeneralService,
  ) { }

  ngOnInit(): void {
    this.general.getRondas().subscribe((resp: any)=>{
      this.listaRondas = resp["rondas"];
      console.log(this.listaRondas);
    })
  }

}
