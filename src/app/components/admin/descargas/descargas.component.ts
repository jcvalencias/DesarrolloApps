import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import * as moment from 'moment';
import { GeneralService } from 'src/app/services/general.service';
//import 'moment/locale/pt-br';
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
    private auth: AuthService,
    private general : GeneralService
  ) { }

  ngOnInit(): void {    
    this.cargaInicial();
  }

  cargaInicial(){
    let anio:any=[];
    let sem: any=[]; 
    this.general.getRondas().subscribe((resp: any)=>{
      for(let dato of resp["rondas"]){
        anio.push(dato.year);
        sem.push(dato.semana);
      }
      this.listaYear = Array.from(new Set(anio));      
      this.listaYear.sort((a: any,b: any) =>a-b);
      this.semanaLista = Array.from(new Set(sem));
      this.semanaLista.sort((a: any,b: any) =>a-b); 
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
    this.general.getRondas().subscribe((resp: any)=>{
      for(let registro of resp["rondas"]){                
        if(registro.semana == this.sem && registro.year == this.anio){
          this.rondaLista.push(registro);        
        }
      }
    })       
  }

  exportToExcel(): void{
    let element = document.getElementById('excel-table1');
    const ws = XLSX.utils.table_to_sheet(element);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb,ws,'Reporte Semanal');
    XLSX.writeFile(wb,this.fileName);
  }

}
