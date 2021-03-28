
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EntregaModel } from 'src/app/models/entrega.model';
import { MercadoModel } from 'src/app/models/mercado.model';
import { ProductoModel } from 'src/app/models/producto.model';
import { RondaModel } from 'src/app/models/ronda.model';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { AuthService } from 'src/app/services/auth.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-ronda',
  templateUrl: './ronda.component.html',
  styleUrls: ['./ronda.component.css']
})
export class RondaComponent implements OnInit{

  ronda = new RondaModel();
  usuarioLista: UsuarioModel[]=[];
  productoLista : ProductoModel[] = [];
  mercadoLista: MercadoModel[]=[];
  entregaLista : EntregaModel[]=[];
  usuario= new UsuarioModel();
  rondaLista: any[] = [];
  idDocumentosUser: any;
  desicion : any; 
  numeroSemana: any; 
  finSemana: any;
  fecha= new Date().toLocaleString();
  codigo : any;
  controlCantidad : boolean = false;
  controlPeso : boolean= false;
  controlPrecio : boolean= false;
  id : any;
  formRonda:any=FormGroup;
  fijar:any;
  participo= false;
  year = new Date().getFullYear();

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {
    this.crearFormulario();
    this.cargarDatos();
  }
  
  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.cargarDatos();              
  }

  cargarDatos(){
    this.auth.getProducto().then(resp=>{
      this.productoLista = this.auth.listaProducto;
      //console.log(this.productoLista);      
    })
    this.auth.getLocalizacion().then(resp=>{
      this.mercadoLista = this.auth.listaMercados;
      //console.log(this.mercadoLista);      
    })
    
    this.auth.getRondaHistorica().then(()=>{
      this.rondaLista = this.auth.listaRondaHistorica;
      console.log(this.rondaLista);      
    })

    this.auth.getUser().then(resp=>{
      this.usuarioLista = this.auth.listaUser;
      let i = 0
      console.log(this.usuarioLista);
      
      for(let user of this.usuarioLista){  
        console.log('uno');
         
        if(this.id == user.IdUsuario){ 
          console.log('dos');
          this.usuario = {
            ...user
          }
          for(let ronda of this.rondaLista){
            console.log('tres');
            if(ronda.Usuario == this.usuario.CodigoMostrar && ronda.Year == this.year){
              this.participo = true;
              
            }
          }
          this.idDocumentosUser = this.auth.listaIdUser[i];
          console.log('prueba',this.usuario);
          console.log('prueba',this.idDocumentosUser);
          localStorage.setItem('codigo', user.CodigoMostrar);
        }
        i++;
      }       
    })
    this.auth.getEntrega().then(resp=>{
      this.entregaLista = this.auth.listaEntrega;
      console.log(this.entregaLista);
      this.userParticipo();      
    })    
    this.numeroSemana = this.auth.numeroSemana; 
    this.finSemana = this.auth.finSemana;    
    this.codigo = localStorage.getItem('codigo');
    this.ronda.Usuario = this.codigo;
  }

  userParticipo(){
    if(this.participo){
      this.auth.salidaForzada();
    }
  }

  crearFormulario(){
    this.formRonda = this.formBuilder.group({
      producto: ['', Validators.required],
      cantidad: ['', Validators.required],
      precio: ['', [Validators.required, Validators.minLength(2)]],
      peso: ['', [Validators.required, Validators.min(70), Validators.max(130)]],
      mercado: ['', Validators.required],
      entrega: ['', Validators.required],
      comentario: [''],
      enviar: ['', Validators.required],
    })
  }

  campoNoValido(campo: string) {
    return this.formRonda.get(campo).invalid && this.formRonda.get(campo).touched;
  }

  guardar(){ 
    this.fijar= document.getElementById('producto');   
    if(this.formRonda.invalid){
      Swal.fire({
        title: 'Atención', 
        text: "Es necesario diligenciar todos los campos obligatorios *",
        icon:"warning"
      });
      this.formRonda.markAllAsTouched();
      this.fijar?.focus();
      return;
    }
    this.enviarProducto();   
  }  

  enviarProducto(){ 
    this.fijar= document.getElementById('producto');
    let precioNo = document.getElementById('precio');
    if(this.formRonda.controls.producto.value == 'Cerdo en Pie'){
      if(this.formRonda.controls.precio.value >= 5000 && this.formRonda.controls.precio.value <= 8500){
        this.controlPrecio = false;
      }else {
        this.controlPrecio = true;
        Swal.fire({
          title: 'Atención', 
          text: "El precio que esta registrando esta por fuera del rango establecido para el producto seleccionado",
          icon:"warning"
        });
        precioNo?.focus();
        return;
      }
    } else if(this.formRonda.controls.producto.value != 'Cerdo en Pie' && this.formRonda.controls.producto.value != ''){
      if(this.formRonda.controls.precio.value >= 7000 && this.formRonda.controls.precio.value <= 12000){
        this.controlPrecio = false;
      }else{
        this.controlPrecio = true;
        Swal.fire({
          title: 'Atención', 
          text: "El precio que esta registrando esta por fuera del rango establecido para el producto selecionado",
          icon:"warning"
        });
        precioNo?.focus();
        return;
      }
    }  
    this.ronda.Fecha = this.fecha;
    this.ronda.Semana = this.numeroSemana;
    this.ronda.UltimoDia = this.finSemana;
    this.ronda.Producto = this.formRonda.controls.producto.value;
    this.ronda.Cantidad = this.formRonda.controls.cantidad.value;
    this.ronda.Precio = this.formRonda.controls.precio.value;
    this.ronda.Peso = this.formRonda.controls.peso.value;
    this.ronda.Mercado = this.formRonda.controls.mercado.value;
    this.ronda.Entrega = this.formRonda.controls.entrega.value;
    this.ronda.Comentario = this.formRonda.controls.comentario.value;
    console.log(this.ronda); 
    Swal.fire({
      title: '¿Esta seguro?',
      text: '¿Esta seguro de registrar estos datos?',
      icon: 'warning',
      showCancelButton: true,
      showConfirmButton: true,
    }).then((acepto)=>{
      if(acepto.value){
        Swal.fire({ 
          allowOutsideClick: false,
          icon: 'info',
          text: 'Espera por Favor..'
        });
        Swal.showLoading(); 
        this.auth.setRonda(this.ronda).then(resp=>{
          Swal.close();
          Swal.fire({
            title: 'Buen trabajo', 
            text: 'Registro creado exitosamente!!!',
            icon:"success"
          });       
          if(this.formRonda.controls.enviar.value == 'Si'){
            console.log("Continua...");
            this.formRonda.reset({
              producto:'',
              mercado:'',
              entrega:'',
              enviar: '',
            });
            this.fijar?.focus();                
          }else{
            console.log("Saliendo...");
            this.formRonda.reset({
              producto:'',
              mercado:'',
              entrega:'',
              enviar: '',
            });
            this.auth.logOut();
          }                  
        })    
      }else{
        return;
      }
    });       
  }

}
