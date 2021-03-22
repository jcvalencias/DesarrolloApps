import { Component, OnInit } from '@angular/core';
import { RondaModel } from 'src/app/models/ronda.model';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-participacion',
  templateUrl: './participacion.component.html',
  styleUrls: ['./participacion.component.css']
})
export class ParticipacionComponent implements OnInit {

  rondaLista : RondaModel[]=[];
  usuarioLista: UsuarioModel[]=[];
  numeroSemana: any; 
  year =new Date().getFullYear();
  participantes : number = 0;
  totalUsuarios: number = 0;

  constructor(
    private auth : AuthService,
    
  ) { }

  ngOnInit(): void {
    this.cargarDatos();
    this.rondaLista = this.auth.listaRonda;
    this.usuarioLista = this.auth.listaUser;
    console.log('user', this.usuarioLista);
    console.log('ronda', this.rondaLista);
    let i = 0;
    for(let user of this.usuarioLista){
      this.totalUsuarios = i;
      if(user.Participa &&  user.Estado == 'Activo'){
        this.participantes ++;
      }
      i++;
    }
    console.log(i);
    
  }

  cargarDatos(){    
    Date.prototype.getWeek = function(start: any){
      var d: any = new Date(+this);  //Creamos un nuevo Date con la fecha de "this".
      d.setHours(0, 0, 0, 0);   //Nos aseguramos de limpiar la hora.
      d.setDate(d.getDate() + 4 - (d.getDay() || 7)); // Recorremos los días para asegurarnos de estar "dentro de la semana"         
      start = start || 0;
      var onejan: any = new Date(this.getFullYear(), 0, 1);
      var week = Math.ceil((((d - onejan) / 86400000) + onejan.getDay() + 1) / 7);//Finalmente, calculamos redondeando y ajustando por la naturaleza de los números en JS:
      var today = new Date(this.setHours(0, 0, 0, 0));
      var day = today.getDay() - start;
      var date = today.getDate() - day;
      var StartDate = new Date(today.setDate(date));
      var EndDate = new Date(today.setDate(date + 5));
      return [EndDate, (week-1)];
    }    
    let fechas = new Date().getWeek();
    this.numeroSemana = fechas[1];
    console.log(this.numeroSemana);    
  }

}
