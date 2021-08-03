import { Component, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserInterface } from 'src/app/interfaces/user-interface';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  usuario= new UserInterface();
  usuarioLista: UserInterface[]=[];
  mercadoLista: any[]=[];
  formRegistro:any= FormGroup;
  usercreado: any;
  acepto: any;

  get email(){
    return this.formRegistro.get('email');
  }
  get password(){
    return this.formRegistro.get('password');
  }
  
  public errorMensaje = {  
    email:[
      {type:'required', message: 'El correo electrónico es requerido.'},
      {type:'pattern', message: 'Por favor ingrese un correo electrónico valido.' }
    ],
    password:[
      {type:'required', message: 'El password es requerido.'},
      {type:'minlength', message: 'El password debe tener mas de 6 caracteres.' }
    ],    
  }

  constructor(
    private auth: AuthService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.crearFormulario();    
   }

  ngOnInit() {}

  crearFormulario(){
    this.formRegistro = this.fb.group({
      password: ['',[Validators.required, Validators.minLength(6)]],
      email: ['',[Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],    
    });    
  }

  guardar(){  
    if(!this.formRegistro.valid){
      this.formRegistro.markAllAsTouched();
      return;
    }else{
        this.usuario.email = this.formRegistro.controls.email.value;
        this.usuario.password = this.formRegistro.controls.password.value;        
        this.crearUser();      
      }
    }     

  crearUser(){   
    this.auth.crear(this.usuario).then((resp: any)=>{               
      if(resp.message === "The email address is already in use by another account."){    
        this.formRegistro.reset();
        this.auth.presentAlert('Atención', 'El correo electrónico ingresado ya esta registrado o tiene un formato incorrecto, utilice un correo valido y vuelva a intentarlo.');
        return this.router.navigateByUrl('/inicio');
      } else {
        let name = {
          'uid' : resp,
          'mail': this.usuario.email,
          'pass': this.usuario.password
        } 
        this.formRegistro.reset();
        return this.router.navigateByUrl(`/final/${name.pass}/${name.uid}/${name.mail}`); 
      }
    }).catch(error=>{
      this.formRegistro.reset();
    })
  }
  
}
