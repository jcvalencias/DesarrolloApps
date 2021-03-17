import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { AuthService } from 'src/app/services/auth.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  usuario= new UsuarioModel();
  usuarioConsulta: UsuarioModel[]=[];
  resp: any;

  cargando= false;

  constructor(
    private auth: AuthService,
    private router: Router,
  ) { }

  ngOnInit(){
    this.usuario = new UsuarioModel();
    this.cargando=true;
    this.auth.datos;    
    console.log(this.auth.datos);    
    this.usuarioConsulta = this.auth.datos;
    this.cargando = false;    
    
  }

  crearUsuario(form: NgForm){
    if(form.invalid){
      return;
    }
    Swal.fire({ 
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espera por Favor..'
    });
    Swal.showLoading();
    let codigoAlmacenado : any;
    let listaCodigos=[];
    let indexCodigo;
    let numCodigo;
    let aux = true;
    if(this.usuarioConsulta.length){      
      for (let user of this.usuarioConsulta) {        
        if(user.localizacion == form.controls.localizacion.value){
          listaCodigos.push(user.codigo);
          aux = false;          
        } else{
          aux = true;
        }         
      }
    }else{
      aux= true;
    }
    if(!aux){     
      indexCodigo = listaCodigos.length-1;
      numCodigo = parseInt(listaCodigos[indexCodigo].slice(-3))+1;      
      codigoAlmacenado = (listaCodigos[indexCodigo].slice(0,3)) + numCodigo.toString().padStart(3,'0') ;
    }else{
      codigoAlmacenado = (form.controls.localizacion.value).slice(0,3) + '001';
    }   
    this.usuario.codigo = codigoAlmacenado; 
    this.auth.crear(this.usuario).then(resp=>{
      console.log('respuesta', resp);
      Swal.close();
      
      this.router.navigateByUrl('/acceso');
    })    
 

    /* Swal.fire({ 
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espera por Favor..'
    });
    Swal.showLoading(); 
    
       
    this.auth.crearUsuario(this.usuario).subscribe(resp=>{
      Swal.close(); 
      this.auth.saveUser(this.usuario).subscribe(resp=>{
        console.log('nuevo',resp);
        this.router.navigateByUrl('/acceso');
      })    
    }, (err)=>{
      Swal.fire({
        title:'Error al autenticar',
        text: err.error.error.message,
        icon: 'error',
      });      
    });   */
  }

}
