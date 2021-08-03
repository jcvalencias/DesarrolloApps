import { Component, OnInit } from '@angular/core';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { AuthService } from 'src/app/services/auth.service';
import { GeneralService } from 'src/app/services/general.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-consultar',
  templateUrl: './consultar.component.html',
  styleUrls: ['./consultar.component.css']
})
export class ConsultarComponent implements OnInit {

  usuario: any=[];
  listaUsuario: UsuarioModel[]=[];

  codigoCaptura : string = '';
  codigoBloqueo : string = '';
  nombre : string = '';
  celular : string = '';
  email : string = '';
  granja : string = '';
  localizacion : string = '';
  estado : string = '';


  constructor(
    private auth: AuthService,
    private general: GeneralService
  ) { }

  ngOnInit(): void {   
  }

  consultarUsusario(){
    this.usuario.length = 0;
    if(!this.codigoCaptura){
      Swal.fire({
        title: 'Atención', 
        text: 'Recuerde ingresar un código',
        icon:"warning"
      });      
    }else{
      this.general.getUsers().subscribe((resp:any)=>{
        this.listaUsuario = resp["users"];
        console.log(this.listaUsuario);
        for(let user of this.listaUsuario){
          if(this.codigoCaptura == user.codigoMostrar){
            this.usuario.push(user);
            this.codigoBloqueo = user._id;
          } 
        }
        if(this.usuario.length == 0){
          Swal.fire({
            title: 'Error', 
            text: 'Código no encontrado',
            icon:"error"
          });
          this.nombre = '';
          this.celular = '';
          this.email = '';
          this.granja = '';
          this.localizacion = '';
        }else{
          this.nombre = `${this.usuario[0].nombre} ${this.usuario[0].apellido}` ;
          this.celular = this.usuario[0].celular;
          this.email = this.usuario[0].email;
          this.granja = this.usuario[0].granja;
          this.localizacion = this.usuario[0].localizacion;        
        }
      })    
    }
  }

  bloquearUsuario(){
    console.log(this.usuario);
    
    /* this.auth.setUserBloqueo(this.usuario, this.codigoBloqueo, 'Inactivo') */
  }

  desbloquearUsuario(){
    /* this.auth.setUserBloqueo(this.usuario, this.codigoBloqueo, 'Activo') */
  }

}
