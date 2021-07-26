import { Component, OnInit } from '@angular/core';

import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { ProductoModel } from 'src/app/models/producto.model';
import { EntregaModel } from 'src/app/models/entrega.model';
import { MercadoModel } from 'src/app/models/mercado.model';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-parametros',
  templateUrl: './parametros.component.html',
  styleUrls: ['./parametros.component.css']
})
export class ParametrosComponent implements OnInit {

  listaProductos: ProductoModel[]=[];
  productos: ProductoModel[]=[];
  parametroP = new ProductoModel();
  modificarP: boolean= true;
  modalP: number = 0;
  tituloModalP = '';

  listaEntrega: EntregaModel[]=[];
  entrega: EntregaModel[]=[];
  parametroE = new EntregaModel();
  modificarE: boolean= true;
  modalE: number = 0;
  tituloModalE = '';

  listaMercados: MercadoModel[]=[];
  mercados: MercadoModel[]=[];
  parametroM = new MercadoModel();
  modificarM: boolean= true;
  modalM: number = 0;
  tituloModalM = '';

  constructor(
    private auth: AuthService,
    private general: GeneralService,
  ) { }

  ngOnInit(): void {    
    this.cargarDatos();
  }

  async cargarDatos(){
    await this.general.getProductos().subscribe((resp:any)=>{
      this.listaProductos = resp["producto"];    
    })

    await this.general.getEntregas().subscribe((resp:any)=>{
      this.listaEntrega = resp["entrega"];
    })

    await this.general.getMercados().subscribe((resp:any)=>{
      this.listaMercados = resp["mercado"];
    })

  }

  eliminarP(producto = new ProductoModel() ){
    Swal.fire({
      title: '¿Esta seguro?',
      text: '¿Esta seguro de eliminar este producto?',
      icon: 'warning',
      showCancelButton: true,
      showConfirmButton: true,
    }).then((acepto)=>{
      if(acepto.value){
        this.general.deleteProducto(producto).subscribe(resp=>{
          console.log(resp);          
        });;  
        this.cargarDatos();          
      }else{
        return;
      }
    }) 
  }
  
  abrirModalP(producto= new ProductoModel()){   
    
    if(!this.modificarP){
        this.tituloModalP = "Editar producto"; 
        this.parametroP.Nombre = producto.Nombre;
        this.parametroP.Minimo = producto.Minimo;
        this.parametroP.Maximo = producto.Maximo;
        this.parametroP._id = producto._id        
    }else{
        this.tituloModalP = "Crear producto";
        this.parametroP.Nombre = '';
        this.parametroP.Minimo = 0;
        this.parametroP.Maximo = 0;
    }
  }

  guardarP(producto = new ProductoModel()){    
    if(!this.modificarP){
      this.general.updateProducto(producto).subscribe(resp=>{
        console.log(resp);        
      });;
    }else{
      this.general.setProducto(producto).subscribe(resp=>{
        console.log(resp);        
      });; 
    }
    this.cargarDatos();
  }

  eliminarE(entrega = new EntregaModel()){
    console.log(entrega);
    
    Swal.fire({
      title: '¿Esta seguro?',
      text: '¿Esta seguro de eliminar este registro?',
      icon: 'warning',
      showCancelButton: true,
      showConfirmButton: true,
    }).then((acepto)=>{
      if(acepto.value){
        this.general.deleteEntrega(entrega).subscribe(resp=>{
          console.log(resp);        
        });  
        this.cargarDatos();          
      }else{
        return;
      }
    }) 
  }
  
  abrirModalE(entrega = new EntregaModel()){
    if(!this.modificarE){
        this.tituloModalE = "Editar lugar entrega"; 
        this.parametroE.Nombre = entrega.Nombre; 
        this.parametroE._id = entrega._id;    
    }else{
        this.tituloModalP = "Crear lugar entrega";
        this.parametroE.Nombre = '';
    }
  }

  guardarE(entrega = new EntregaModel()){    
    if(!this.modificarE){
      this.general.updateEntrega(entrega).subscribe(resp=>{
        console.log(resp);        
      });
    }else{
      this.general.setEntrega(entrega).subscribe(resp=>{
        console.log(resp);        
      });; 
    }
    this.cargarDatos();
  }

  eliminarM(mercado = new MercadoModel()){
    Swal.fire({
      title: '¿Esta seguro?',
      text: '¿Esta seguro de eliminar este registro?',
      icon: 'warning',
      showCancelButton: true,
      showConfirmButton: true,
    }).then((acepto)=>{
      if(acepto.value){
        this.general.deleteMercado(mercado).subscribe(resp=>{
          console.log(resp);          
        });;  
        this.cargarDatos();          
      }else{
        return;
      }
    }) 
  }
  
  abrirModalM(mercado = new MercadoModel()){
    console.log(mercado);     
    if(!this.modificarM){
        this.tituloModalM = "Editar mercado"; 
        this.parametroM.Nombre = mercado.Nombre; 
        this.parametroM._id = mercado._id ;   
    }else{
        this.tituloModalM = "Crear mercado";
        this.parametroM.Nombre = '';
    }
  }

  guardarM(mercado = new MercadoModel()){
    if(!this.modificarM){
      this.general.updateMercado(mercado).subscribe(resp=>{
        console.log(resp);        
      });;
    }else{
      this.general.setMercado(mercado).subscribe(resp=>{
        console.log(resp);        
      });; 
    }
    this.cargarDatos();
  }

}
