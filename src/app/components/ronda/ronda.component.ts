import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EntregaModel } from 'src/app/models/entrega.model';
import { MercadoModel } from 'src/app/models/mercado.model';
import { ProductoModel } from 'src/app/models/producto.model';
import { RondaModel } from 'src/app/models/ronda.model';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-ronda',
  templateUrl: './ronda.component.html',
  styleUrls: ['./ronda.component.css']
})
export class RondaComponent implements OnInit {

  ronda= new RondaModel();
  usuarioLista: UsuarioModel[]=[];
  productoLista : ProductoModel[] = [];
  mercadoLista: MercadoModel[]=[];
  entregaLista : EntregaModel[]=[];
  codigo : any = '';
  desicion : string='';

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.productoLista = this.auth.listaProducto;    
    this.usuarioLista = this.auth.listaUser; 
    this.mercadoLista = this.auth.listaMercados;
    this.entregaLista = this.auth.listaEntrega;
    for(let user of this.usuarioLista){  
      if(id == user.IdUsuario){
        this.codigo = user.CodigoMostrar;
        console.log(this.codigo);
      }
    }       
  }

  enviarProducto(form: NgForm){     
    if(form.invalid){
      return;
    }

    
  }

}
