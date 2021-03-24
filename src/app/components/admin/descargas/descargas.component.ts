import { Component, OnInit } from '@angular/core';
import { delay } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-descargas',
  templateUrl: './descargas.component.html',
  styleUrls: ['./descargas.component.css']
})
export class DescargasComponent implements OnInit {

  listaYear: any=[];
  semanaLista: any =[];
  rondaLista: any=[];
  anio: any='';
  sem: any ='';
  flag= false;

  title= 'exportExcel';
  fileName = 'Ronda Semanal.xlsx'

  constructor(
    private auth: AuthService
  ) { }

  ngOnInit(): void {    
    this.cargaInicial();
  }

  cargaInicial(){
    this.auth.getRonda().then(resp=>{      
      this.listaYear= this.auth.years;
      this.semanaLista = this.auth.listaSemanas;
    })        
  }

  cargaExcel(){
    if(!this.sem && !this.anio){
      Swal.fire({
        title: 'Atención', 
        text: 'Recuerde seleccionar un año y una semana',
        icon:"warning"
      });
      this.flag= false
    }else{
      this.flag= true
      Swal.fire({
        title: 'Buen trabajo', 
        text: 'Ya puede descargar el archivo!!!',
        icon:"success"
      });
    }
    for(let registro of this.auth.listaRonda){            
      if(registro.Semana == this.sem && registro.Year == this.anio){
        this.rondaLista.push(registro);
      }
    }
  }

  exportToExcel(): void{
    let element = document.getElementById('excel-table1');
    const ws = XLSX.utils.table_to_sheet(element);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb,ws,'Reporte Semanal');
    XLSX.writeFile(wb,this.fileName);
  }

}
