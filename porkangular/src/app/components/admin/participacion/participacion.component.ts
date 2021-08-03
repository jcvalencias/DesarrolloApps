import { Component, OnInit } from '@angular/core';
import { RondaModel } from 'src/app/models/ronda.model';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { AuthService } from 'src/app/services/auth.service';
import { GeneralService } from 'src/app/services/general.service';
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
  totalUsuarios: number = 1;
  siParticipa: any[]=[];
  participa: any[]=[];
  idUsuariosLista: any[]=[];
  noParticipa: any[]=[];
  listaUser: any[]=[];
  year = new Date().getFullYear();

  pushIds: any[] =[];
  numero: any;
  mensaje: any;

  title= 'exportExcel';
  fileName = 'Usuarios Sin Registro.xlsx'

  constructor(
    private auth : AuthService,
    private general: GeneralService,   
  ) {}

  ngOnInit(): void {
    this.usuarioLista.length =0;
    this.consulta();        
  }

  diferenciaDeArreglos(arr1: any[], arr2: any[]){
    return arr1.filter(elemento => arr2.indexOf(elemento) == -1);
  }

  consulta(){
    this.usuarioLista.length = 0;
    this.general.getUsers().subscribe((resp:any)=>{
      this.usuarioLista = resp["users"];     
    })
    this.general.getRondas().subscribe((resp:any)=>{
      this.rondaLista = resp["rondas"];
      for(let user of this.usuarioLista){
        if(user.estado == true){
          this.idUsuariosLista.push(user.codigoMostrar);
          this.totalUsuarios ++;
          for(let ronda of this.rondaLista){        
            if(ronda.semana == this.auth.numeroSemana && ronda.year == this.year){           
              if(user.codigoMostrar == ronda.usuario){
                this.participa.push(user.codigoMostrar);
              }
            }
          }
        } 
      }      
      this.datos();
    })
  }

  datos(){    
    this.siParticipa = Array.from(new Set(this.participa));
    this.participantes= this.siParticipa.length; 
    this.noParticipa = this.diferenciaDeArreglos(this.idUsuariosLista, this.siParticipa);    
    for(let user of this.usuarioLista){
      for(let p of this.noParticipa){
        if(user.codigoMostrar != 'Bog010' && p == user.codigoMostrar){          
          this.listaUser.push(user);
          if(user.pushUserId != undefined){
            this.pushIds.push(user.pushUserId);
          }                
        }
      }      
    }            
  }

  async mensajeSegmentado(){
    for(let pushId of this.pushIds){     
      await this.auth.enviarNotiSegmentado(this.mensaje,pushId).subscribe(resp=>{   
        this.numero = resp.recipients;   
      });
    }    
  }

  exportToExcel(): void{
    let element = document.getElementById('excel-table');
    const ws = XLSX.utils.table_to_sheet(element);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb,ws,'Sin Registros');
    XLSX.writeFile(wb,this.fileName);
  }

}
