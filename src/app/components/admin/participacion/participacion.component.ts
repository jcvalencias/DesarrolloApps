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
  siParticipa: any[]=[];
  participa: any[]=[];
  idUsuariosLista: any[]=[];
  noParticipa: any[]=[];
  listaUser: any[]=[];

  title= 'exportExcel';
  fileName = 'Usuarios Sin Registro.xlsx'

  constructor(
    private auth : AuthService    
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
    this.auth.getUser().then(resp=>{      
      this.usuarioLista = this.auth.listaUser;
    });
    this.auth.getRonda().then(()=>{    
      for(let user of this.usuarioLista){
        this.idUsuariosLista.push(user.CodigoMostrar);
        this.totalUsuarios ++;        
        for(let ronda of this.auth.listaRonda){        
          if(ronda.Semana==12 && ronda.Year == 2021){           
            if(user.CodigoMostrar == ronda.Usuario && user.Estado == "Activo"){
              console.log('User', user);
              this.participa.push(user.CodigoMostrar);
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
    if(this.siParticipa.length == 0){
      this.noParticipa = this.diferenciaDeArreglos(this.siParticipa, this.idUsuariosLista);
    }else{
      this.noParticipa = this.diferenciaDeArreglos(this.idUsuariosLista, this.siParticipa);
    }
    for(let user of this.usuarioLista){
      for(let p of this.noParticipa){
        if(user.CodigoMostrar != 'Bog001' && p == user.CodigoMostrar){
          this.listaUser.push(user);          
        }
      }      
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
