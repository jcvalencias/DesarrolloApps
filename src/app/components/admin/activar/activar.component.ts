import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { EstadoModel } from 'src/app/models/estado.model';

import Swal from 'sweetalert2';
import { GeneralService } from 'src/app/services/general.service';

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
    private general: GeneralService
  ) {}

  ngOnInit(): void {
    this.cargaEstado();
  }

  async cargaEstado(){
    await this.general.getEstado().subscribe((resp:any)=>{
      this.estadoActual = resp["estado"][0];
      console.log(this.estadoActual);      
    })
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
        if(this.estadoActual.Nombre){
          this.estadoActual.Nombre = false;
          this.general.updateEstado(this.estadoActual).subscribe((resp: any)=>{
            console.log(resp);
            this.cargaEstado();            
          });     
        }else{
          this.estadoActual.Nombre = true; 
          this.general.updateEstado(this.estadoActual).subscribe((resp: any)=>{
            console.log(resp); 
            this.cargaEstado();           
          });
        }           
         
      }else{
        return;
      }
    })    
  }

}
