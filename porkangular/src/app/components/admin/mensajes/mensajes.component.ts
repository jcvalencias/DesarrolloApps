import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mensajes',
  templateUrl: './mensajes.component.html',
  styleUrls: ['./mensajes.component.css']
})
export class MensajesComponent implements OnInit {

  mensaje: string='';
  numero: string='';
  constructor(
    private auth: AuthService
  ) { }

  ngOnInit(): void {
  }

  sendMensaje(){
    console.log('mensaje', this.mensaje);
    if(!this.mensaje){
      Swal.fire({
        title: 'Atención', 
        text: 'Recuerde ingresar un mensaje',
        icon:"warning"
      });      
    }else{
      this.auth.enviarNoti(this.mensaje).subscribe(resp=>{
        console.log(resp);    
        this.numero = resp.recipients;    
      })
    }
  }

}
