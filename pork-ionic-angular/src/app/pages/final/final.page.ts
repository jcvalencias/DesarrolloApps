import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UserInterface } from 'src/app/interfaces/user-interface';
import { AuthService } from 'src/app/services/auth.service';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-final',
  templateUrl: './final.page.html',
  styleUrls: ['./final.page.scss'],
})
export class FinalPage implements OnInit {
    
  usuario= new UserInterface();
  usuarioLista:UserInterface[]=[];
  mercadoLista: any[]=[];
  formRegistro:any= FormGroup;
  usercreado: any;
  acepto: any;

  email: any;
  uid: any;
  pass: any;

  get nombre(){
    return this.formRegistro.get('nombre');
  }
  get celular(){
    return this.formRegistro.get('celular');
  }
  get apellido(){
    return this.formRegistro.get('apellido');
  }
  get granja(){
    return this.formRegistro.get('granja');
  }
  get localizacion(){
    return this.formRegistro.get('localizacion');
  }

  public errorMensaje = {
    nombre:[
      {type:'required', message: 'El nombre es requerido.'},
      {type:'minlength', message: 'El nombre debe tener mas de 2 caracteres.' }
    ],
    apellido:[
      {type:'required', message: 'El apellido es requerido.'},
      {type:'minlength', message: 'El apellido debe tener mas de 2 caracteres.' }
    ],
    celular:[
      {type:'required', message: 'El celular es requerido.'},
      {type:'minlength', message: 'El celular debe tener mas de 10 números.' },
      {type:'maxlength', message: 'El celular debe tener mas de 10 números.' }
    ],
    granja:[
      {type:'required', message: 'La granja es requerida.'},
      {type:'minlength', message: 'La granja debe tener mas de 2 caracteres.' }
    ],
    localizacion:[
      {type:'required', message: 'La localizacion es requerida.'}
    ],    
  }

  constructor(
    private auth: AuthService,
    private general : GeneralService,
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private alertCtrl: AlertController,
  ) {
    this.crearFormulario();
    this.general.getMercados().subscribe((resp: any)=>{
      this.mercadoLista = resp["mercados"];         
    },error => {
      this.auth.eliminarUser(this.email, this.pass).then(resp=>{
        this.auth.presentAlert('Error', 'No se ha podido conectar con el servidor.');     
      });
    });
    
    this.general.getUsers().subscribe(resp=>{
      this.usuarioLista = resp["users"];        
    },error => {
      this.auth.eliminarUser(this.email, this.pass).then(resp=>{
        this.auth.presentAlert('Error', 'No se ha podido conectar con el servidor.');     
      });
    });       
  }

  ngOnInit() {
    this.pass = this.route.snapshot.paramMap.get('id');
    this.uid = this.route.snapshot.paramMap.get('num');
    this.email =  this.route.snapshot.paramMap.get('str');    
  }

  crearFormulario(){  
    this.formRegistro = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['',[Validators.required, Validators.minLength(2)]],
      granja: ['',[Validators.required, Validators.minLength(2)]],
      celular: ['',[Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      localizacion: ['', Validators.required],     
    });    
  }

  guardar(){ 
    this.acepto = document.getElementById('acepto'); 
    if(!this.formRegistro.valid){
      this.formRegistro.markAllAsTouched();
      return;
    }else{
      if(this.acepto.checked){
        this.usuario.nombre = this.formRegistro.controls.nombre.value;
        this.usuario.apellido = this.formRegistro.controls.apellido.value;
        this.usuario.granja = this.formRegistro.controls.granja.value;
        this.usuario.localizacion = this.formRegistro.controls.localizacion.value;
        this.usuario.celular = this.formRegistro.controls.celular.value;
        this.usuario.email = this.email;
        this.usuario.idUsuario = this.uid;
        this.usuario.password= this.pass;
        this.crearUsuario();      
      } else{
        this.auth.presentAlert('Atención', 'Para continuar debe aceptar las politicas de privacidad y proteccion de datos.');
        return;
      }
    }    
  }

  crearUsuario(){       
    let codigoAlmacenado : any;
    let listaCodigos=[];
    let indexCodigo;
    let numCodigo;
    let aux: boolean = true;    
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
    this.general.setUser(this.usuario).subscribe(resp=>{
      this.formRegistro.reset({
        localizacion: '',
      })      
      this.auth.presentAlert('Atención', 'Podrá acceder a la Ronda en 24 horas, una vez Porkcolombia FNP valide los datos registrados.');     
      this.router.navigateByUrl('/inicio');
    })                 
  }

  async eliminar(){    
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Atención',
      message: '¿Esta seguro de cancelar el proceso de registro?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            return;
          }
        }, {
          text: 'Ok',
          handler: () => {
            this.auth.eliminarUser(this.email, this.pass).then(resp=>{
              this.auth.presentAlert('Atención','No se ha completado el registro');      
            }) 
          }
        }
      ]
    });
    await alert.present();
  }  

}
