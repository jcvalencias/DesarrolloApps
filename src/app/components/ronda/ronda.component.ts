
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EntregaModel } from 'src/app/models/entrega.model';
import { MercadoModel } from 'src/app/models/mercado.model';
import { ProductoModel } from 'src/app/models/producto.model';
import { RondaModel } from 'src/app/models/ronda.model';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { AuthService } from 'src/app/services/auth.service';
//import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  desicion : any; 
  numeroSemana: any; 
  finSemana: any;
  fecha= new Date().toLocaleString();
  codigo : any;
  controlCantidad : boolean = false;
  controlPeso : boolean= false;
  controlPrecio : boolean= false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    //private formBuilder: FormBuilder,
  ) { }
  //public formulario : any = FormGroup;
  ngOnInit(): void {

    /* this.formulario = this.formBuilder.group({
      usu_nombre: ['', Validators.required],
      usu_correo: ['', Validators.required],
      usu_login: ['', Validators.required],
      usu_documento: ['', Validators.required],
      usu_clave: ['', Validators.required],
      confir_clave: ['', Validators.required],
      gen_id: [''],
      esu_id: [''],
      sed_id: [''],
      pai_id: [''],
    }); */

    const id = this.route.snapshot.paramMap.get('id');
    this.productoLista = this.auth.listaProducto;    
    this.usuarioLista = this.auth.listaUser; 
    this.mercadoLista = this.auth.listaMercados;
    this.entregaLista = this.auth.listaEntrega;
    for(let user of this.usuarioLista){  
      if(id == user.IdUsuario){
        localStorage.setItem('codigo', user.CodigoMostrar);
      }
    }
    this.codigo = localStorage.getItem('codigo');
    this.ronda.Usuario = this.codigo;
    Date.prototype.getWeek = function(start: any)
      {
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
    console.log(this.fecha);
    console.log(this.numeroSemana);
    console.log(this.finSemana);          
  }

  enviarProducto(form: NgForm){ 
    const productoSel = document.getElementById('producto');
    if(form.controls.Cantidad.value == 0){
      this.controlCantidad = true;
      Swal.fire({
        title: 'Atención', 
        text: 'Recuerde que es obligatorio ingresar la cantidad!!!',
        icon:"warning"
      });
      return
    }else{
      this.controlCantidad = false
    } 

    if(form.controls.Peso.value == 0 || form.controls.Peso.value <= 69 || form.controls.Peso.value >= 130){
      this.controlPeso = true;
      Swal.fire({
        title: 'Atención', 
        text: 'Recuerde que es obligatorio ingresar el peso dentro de los rangos establecidos!!!(70Kg -130 Kg)',
        icon:"warning"
      });
      return
    }else{
      this.controlPeso = false
    }

    if(form.controls.Producto.value == 'Cerdo en Pie'){
      if(form.controls.Precio.value >= 5000 && form.controls.Precio.value <= 8500){
        this.controlPrecio = false;
      }else {
        this.controlPrecio = true;
        Swal.fire({
          title: 'Atención', 
          text: "El precio que esta registrando esta por fuera del rango establecido para el producto seleccionado",
          icon:"warning"
        });
        return;
      }
    } else if(form.controls.Producto.value != 'Cerdo en Pie' && form.controls.Producto.value != ''){
      if(form.controls.Precio.value >= 7000 && form.controls.Precio.value <= 12000){
        this.controlPrecio = false;
      }else{
        this.controlPrecio = true;
        Swal.fire({
          title: 'Atención', 
          text: "El precio que esta registrando esta por fuera del rango establecido para el producto selecionado",
          icon:"warning"
        });
        return;
      }
    }    

    if(form.invalid){
     Swal.fire({
          title: 'Atención', 
          text: "Es necesario diligenciar todos los campos obligatorios *",
          icon:"warning"
        });
      return;
    }
    console.log(form); 
    this.ronda.Fecha = this.fecha;
    this.ronda.Semana = this.numeroSemana;
    this.ronda.UltimoDia = this.finSemana;
    console.log(this.ronda); 

    Swal.fire({
      title: '¿Esta seguro?',
      text: '¿Esta seguro de registrar estos datos?',
      icon: 'warning',
      showCancelButton: true,
      showConfirmButton: true,
    }).then((acepto)=>{
      if(acepto){
        Swal.fire({ 
          allowOutsideClick: false,
          icon: 'info',
          text: 'Espera por Favor..'
        });
        Swal.showLoading(); 
        this.auth.setRonda(this.ronda).then(resp=>{
          Swal.close();
          if(form.controls.enviar.value == 'Si'){
                console.log("Hola Si");   
                //form.onReset();
                //form.reset();
                form.resetForm();
                productoSel?.focus();
                return;
              }else{
                console.log("Hola No");
                //this.auth.logOut();
              }
                  
        })    
      }else{
          return;
      }
  });    


    
    
      
  }  

}
