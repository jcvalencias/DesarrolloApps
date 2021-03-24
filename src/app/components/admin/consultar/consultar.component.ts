import { Component, OnInit } from '@angular/core';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { AuthService } from 'src/app/services/auth.service';
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
      this.auth.getUser().then(resp=>{      
        this.listaUsuario = this.auth.listaOtra;
        this.auth.listaOtra.map((element: any) => {
          if(this.codigoCaptura == element.data().CodigoMostrar){
            this.usuario.push(element.data());
            this.codigoBloqueo = element.id;
          }          
        });      
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
          /* this.estado = ''; */
        }else{
          this.nombre = `${this.usuario[0].Nombre} ${this.usuario[0].Apellido}` ;
          this.celular = this.usuario[0].Celular;
          this.email = this.usuario[0].Email;
          this.granja = this.usuario[0].Granja;
          this.localizacion = this.usuario[0].Localizacion;
         /*  this.estado = this.usuario[0].Estado; */
        }        
      })    
    }
  }

  bloquearUsuario(){
    console.log(this.usuario);
    
    this.auth.setUserBloqueo(this.usuario, this.codigoBloqueo, 'Inactivo')
  }

  desbloquearUsuario(){
    this.auth.setUserBloqueo(this.usuario, this.codigoBloqueo, 'Activo')
  }

}
