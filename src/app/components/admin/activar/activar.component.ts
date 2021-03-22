import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { EstadoModel } from 'src/app/models/estado.model';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-activar',
  templateUrl: './activar.component.html',
  styleUrls: ['./activar.component.css']
})
export class ActivarComponent implements OnInit {

  estado = new EstadoModel();
  estadoActual: any;
  constructor(
    private auth: AuthService,
  ) {}

  ngOnInit(): void {
    this.cargaEstado();
  }

  cargaEstado(){
    this.auth.getEstadoRonda().then((a)=>{
      this.estadoActual = this.auth.estadoRonda;
    });
  }

  activaRonda(){
    Swal.fire({
      title: '¿Esta seguro?',
      text: 'Este cambio afecta el acceso a la ronda',
      icon: 'warning',
      showCancelButton: true,
      showConfirmButton: true,
    }).then((acepto)=>{
      if(acepto.value){ 
        if(this.estadoActual =='Activo'){
          this.auth.setEstadoRonda('Inactivo');     
        }else{
          this.auth.setEstadoRonda('Activo'); 
        }   
        this.cargaEstado(); 
      }else{
        return;
      }
    })    
  }

}
