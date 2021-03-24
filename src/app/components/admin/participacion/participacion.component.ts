import { Component, OnInit } from '@angular/core';
import { RondaModel } from 'src/app/models/ronda.model';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { AuthService } from 'src/app/services/auth.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-participacion',
  templateUrl: './participacion.component.html',
  styleUrls: ['./participacion.component.css']
})
export class ParticipacionComponent implements OnInit {

  rondaLista : RondaModel[]=[];
  usuarioLista: UsuarioModel[]=[];
  participantes : number = 0;
  totalUsuarios: number = 0;

  title= 'exportExcel';
  fileName = 'Usuarios Sin Registro.xlsx'

  constructor(
    private auth : AuthService,
    
  ) {}

  ngOnInit(): void {
    this.usuarioLista.length =0;
    this.consulta();    
  }

  consulta(){
    this.usuarioLista.length =0;
    this.auth.getUser().then(resp=>{
      this.rondaLista = this.auth.listaRonda;
      this.usuarioLista = this.auth.usuarioParticipa;
      this.totalUsuarios = this.auth.total;
      this.participantes = this.auth.participantes;
    });
  }

  exportToExcel(): void{
    let element = document.getElementById('excel-table');
    const ws = XLSX.utils.table_to_sheet(element);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb,ws,'Sin Registros');
    XLSX.writeFile(wb,this.fileName);
  }

  


}
