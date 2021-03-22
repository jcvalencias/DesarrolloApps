
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
declare global {
  interface Date {
      getWeek (start?: Date) : [Date, Number]
  }
}
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

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
  ) {
    this.crearFormulario();
    this.cargarDatos();
  }
  
  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.cargarDatos();              
  }

  cargarDatos(){
    this.productoLista = this.auth.listaProducto;  
    this.usuarioLista = this.auth.listaUser; 
    this.mercadoLista = this.auth.listaMercados;
    this.entregaLista = this.auth.listaEntrega;    
    console.log(this.usuarioLista);
    let i = 0
    for(let user of this.usuarioLista){        
      if(this.id == user.IdUsuario){
        this.usuario = {
          ...user
        }
        this.idDocumentosUser = this.auth.listaIdUser[i];
        console.log('prueba',this.usuario);
        console.log('prueba',this.idDocumentosUser);
        localStorage.setItem('codigo', user.CodigoMostrar);
      }
      i++;
    }
    this.codigo = localStorage.getItem('codigo');
    this.ronda.Usuario = this.codigo;
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
    this.finSemana = fechas[0].toLocaleString();
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
          this.usuarioParticipa();         
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
  
  usuarioParticipa(){
    this.auth.setUserParicipa(this.usuario,this.idDocumentosUser).then(resp=>{
      console.log('cambio en participacion');  
      console.log('usuario', this.usuario);
      console.log('id', this.idDocumentosUser);    
    })
  }

}
