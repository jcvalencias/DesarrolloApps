import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MercadoModel } from 'src/app/models/mercado.model';
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
  usuarioLista: UsuarioModel[]=[];
  mercadoLista: MercadoModel[]=[];
  cargando= false;
  formRegistro:any= FormGroup;

  constructor(
    private auth: AuthService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.crearFormulario();
   }

  ngOnInit(){
    this.cargando=true;     
    this.usuarioLista = this.auth.listaIdUser;    
    this.mercadoLista = this.auth.listaMercados;
    this.cargando = false;     
  }

  campoNoValido(campo: string) {
    return this.formRegistro.get(campo).invalid && this.formRegistro.get(campo).touched;
  }

  crearFormulario(){
    this.formRegistro = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['',[Validators.required, Validators.minLength(2)]],
      granja: ['',[Validators.required, Validators.minLength(2)]],
      celular: ['',[Validators.required, Validators.minLength(10)]],
      password: ['',[Validators.required, Validators.minLength(6)]],
      email: ['',[Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      localizacion: ['', Validators.required],
    })
  }

  guardar(){
    if(this.formRegistro.invalid){
      this.formRegistro.markAllAsTouched();
      return;
    }
    this.formRegistro.reset({
      localizacion: '',
    })
    this.crearUsuario();
  }

  crearUsuario(){
    if(this.formRegistro.invalid){
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
    let aux: boolean = true;  
    this.usuario.nombre = this.formRegistro.controls.nombre.value;
    this.usuario.apellido = this.formRegistro.controls.apellido.value;
    this.usuario.granja = this.formRegistro.controls.granja.value;
    this.usuario.localizacion = this.formRegistro.controls.localizacion.value;
    this.usuario.celular = this.formRegistro.controls.celular.value;
    this.usuario.email = this.formRegistro.controls.email.value;
    this.usuario.password = this.formRegistro.controls.password.value;
    if(this.usuarioLista.length){      
      for (let user of this.usuarioLista) {               
        if(user.localizacion == this.formRegistro.controls.localizacion.value){                    
          listaCodigos.push(user.codigoMostrar);
          aux = false;                    
        }      
      }
    }    
    if(!aux){     
      indexCodigo = listaCodigos.length-1;
      numCodigo = parseInt(listaCodigos[indexCodigo].slice(-3))+1;            
      codigoAlmacenado = (listaCodigos[indexCodigo].slice(0,3)) + numCodigo.toString().padStart(3,'0') ;
    }else{
      codigoAlmacenado = (this.formRegistro.controls.localizacion.value).slice(0,3) + '001';
    }   
    this.usuario.codigoMostrar = codigoAlmacenado;     
    this.auth.crear(this.usuario).then(resp=>{
      Swal.close();      
      this.router.navigateByUrl('/acceso');
    })     
  }

}
