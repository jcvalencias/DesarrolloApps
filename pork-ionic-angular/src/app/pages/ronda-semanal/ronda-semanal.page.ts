import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { RondaInterface } from 'src/app/interfaces/ronda-interface';
import { UserInterface } from 'src/app/interfaces/user-interface';
import { AuthService } from 'src/app/services/auth.service';
import { GeneralService } from 'src/app/services/general.service';

import { Storage } from '@ionic/storage';
import { PushService } from 'src/app/services/push.service';

@Component({
  selector: 'app-ronda-semanal',
  templateUrl: './ronda-semanal.page.html',
  styleUrls: ['./ronda-semanal.page.scss'],
})
export class RondaSemanalPage implements OnInit {

  ronda= new RondaInterface();
  usuario= new UserInterface();
  usuarioLista: UserInterface[]=[];
  productoLista: any[] =[];
  mercadoLista: any[]=[];
  entregaLista: any[]=[];
  rondaLista: any[]=[];
  controlPrecio: boolean = false;
  decision: any;
  numeroSemana: any;
  finSemana: any;
  fecha = new Date().toLocaleString();
  year = new Date().getFullYear();
  codigo: any;
  id: any;
  formRonda: any = FormGroup;
  opcionesEnviar =["Si", "No"];
  participo= false;
  pushUserId: any;
  estado: any;

  get producto(){    
    return this.formRonda.get('producto');
  }
  get cantidad(){
    return this.formRonda.get('cantidad');
  }
  get peso(){
    return this.formRonda.get('peso');
  }
  get precio(){
    return this.formRonda.get('precio');
  }
  get mercado(){
    return this.formRonda.get('mercado');
  }
  get entrega(){
    return this.formRonda.get('entrega');
  }
  get envia(){
    return this.formRonda.get('envia');
  }

  public errorMensaje = {
    producto:[
      {type:'required', message: 'El producto es requerido.'}
    ],
    cantidad:[
      {type:'required', message: 'La cantidad es requerida.'},
      {type:'min', message: 'La cantidad debe ser mayor a 1.' },
      {type:'max', message: 'La cantidad debe ser menor a 10000.' }
    ],
    peso:[
      {type:'required', message: 'El peso es requerido.'},
      {type:'min', message: 'El peso debe ser superior a 69 Kilos.' },
      {type:'max', message: 'El peso debe ser inferior a 131 Kilos.' }
    ],
    precio:[
      {type:'required', message: 'El precio es requerido.'}
    ],
    mercado:[
      {type:'required', message: 'El mercado es requerido.'}
    ],
    entrega:[
      {type:'required', message: 'El lugar de entrega es requerido.'}
    ],
    envia:[
      {type:'required', message: 'Este campo es requerido.'}
    ]    
  }

  private _storage: Storage | null = null;
  constructor(
    private loadingController: LoadingController,
    private general: GeneralService,
    private auth: AuthService,
    private pushNoti: PushService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private alertCtrl: AlertController,
    private storage: Storage
  ) {    
    this.crearFormulario();
    this.init();      
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.consultaEstado();        
  } 

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  public set(key: string, value: any) {
    this._storage?.set(key, value);
  }

  async consultaEstado(){
    this.general.getEstados().subscribe((resp: any)=>{
      this.estado = resp["estado"][0].Nombre;      
      if(!this.estado){
        this.auth.presentAlert('Señor porcicultor', 'En este momento no esta permitido ingresar registros a la ronda, gracias.')
        this.auth.salidaForzada();
      }else{
        this.cargarDatos();
      }  
    });
  }

  async capturaPushId(user: UserInterface){
    this.pushUserId = await this.storage.get('userId') || user.pushUserId;
    user.pushUserId = this.pushUserId
    this.general.updateUser(user).subscribe((resp: any)=>{
      console.log(resp);      
    });
  }

  async cargarDatos(){
    this.numeroSemana = this.auth.numeroSemana;
    
    this.general.getProductos().subscribe((resp:any)=>{
      this.productoLista = resp["producto"];
    });

    this.general.getMercados().subscribe((resp: any)=>{
      this.mercadoLista = resp["mercados"];      
    });           
        
    this.general.getRondas().subscribe(resp=>{
      this.rondaLista = resp["rondas"];
    })
                  
    this.general.getUsers().subscribe(resp=>{
      this.usuarioLista = resp["users"];
      let i = 0     
      for(let user of this.usuarioLista){         
        if(this.id == user.idUsuario){ 
          this.capturaPushId(user);          
          this.usuario = {
            ...user
          }

          for(let ronda of this.rondaLista){
            if(ronda.usuario == this.usuario.codigoMostrar && ronda.year == this.year && ronda.semana == this.numeroSemana){
              this.participo = true;              
            }
          }
          this.storage.set('codigo', user.codigoMostrar);
        }
        i++;
      }       
    })
    this.general.getEntregas().subscribe((resp: any)=>{
      this.entregaLista = resp["entrega"];            
      this.userParticipo(); 
    });         
    this.finSemana = this.auth.finSemana;    
    this.codigo = await this.storage.get('codigo') || '';
    this.ronda.usuario = this.codigo;   
  }

  userParticipo(){
    if(this.participo){
      this.auth.presentAlert('Señor porcicultor', 'Usted ya participo durante la ronda de la semana en curso, solo se permite una participación por semana, gracias.')
      this.pushNoti.deleteCodigo();
      this.auth.salidaForzada();
    }
  }

  crearFormulario(){
    this.formRonda = this.fb.group({
      producto: ['', Validators.required],
      cantidad: ['', [Validators.required, Validators.min(2), Validators.max(10000)]],
      precio: ['', [Validators.required, Validators.minLength(2)]],
      peso: ['', [Validators.required, Validators.min(70), Validators.max(130)]],
      mercado: ['', Validators.required],
      entrega: ['', Validators.required],
      comentario: [''],
      envia: ['', Validators.required]
    });    
  }

  guardar(){   
    if(this.formRonda.invalid){
      this.auth.presentAlert('Atención', 'Es necesario diligenciar todos los campos obligatorios *.');
      this.formRonda.markAllAsTouched();
      return;
    }   
    this.enviarProducto();  
  }

  enviarProducto(){ 
    let precioNo = document.getElementById('precio');
    for(let prod of this.productoLista){
      if(this.formRonda.controls.producto.value == prod.Nombre){
        if(this.formRonda.controls.precio.value >= prod.Minimo && this.formRonda.controls.precio.value <= prod.Maximo){
          this.controlPrecio = false;
        }else {
          this.controlPrecio = true;
          this.auth.presentAlert('Atención', 'El precio que esta registrando esta por fuera del rango establecido para el producto seleccionado.');
          precioNo?.focus();
          return;
        }
      }
    }
    this.ronda.fecha = this.fecha;
    this.ronda.semana = this.numeroSemana;
    this.ronda.ultimoDia = this.finSemana;
    this.ronda.producto = this.formRonda.controls.producto.value;
    this.ronda.cantidad = parseInt(this.formRonda.controls.cantidad.value);
    this.ronda.precio = parseInt(this.formRonda.controls.precio.value);
    this.ronda.peso = this.formRonda.controls.peso.value;
    this.ronda.mercado = this.formRonda.controls.mercado.value;
    this.ronda.entrega = this.formRonda.controls.entrega.value;
    this.ronda.comentario = this.formRonda.controls.comentario.value;
    this.presentAlertConfirm();          
  }

  async continuarRegistro(){ 
    this.finSemana = this.auth.finSemana;    
    this.codigo = await this.storage.get('codigo') || [];
    this.ronda.usuario = this.codigo;
    const loading = await this.loadingController.create({
      message: `Registro en proceso....`,
      spinner: `crescent`,
      showBackdrop: true,
    });
    loading.present();        
    this.general.setRonda(this.ronda).subscribe((resp: any)=>{  
      loading.dismiss();
      if(this.formRonda.controls.envia.value == 'Si'){
        this.formRonda.reset({
          producto:'',
          mercado:'',
          entrega:'',
          envia: '',
        });                      
      }else{
        this.formRonda.reset({
          producto:'',
          mercado:'',
          entrega:'',
          envia: '',
        });
        this.pushNoti.deleteCodigo();
        this.auth.logOut();
      }   
    }) 
  }

  async presentAlertConfirm() {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: '¿Esta seguro?',
      message: '¿Esta seguro de registrar estos datos?',
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
            this.continuarRegistro()
          }
        }
      ]
    });
    await alert.present();
  }
}
