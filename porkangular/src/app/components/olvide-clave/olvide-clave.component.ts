import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-olvide-clave',
  templateUrl: './olvide-clave.component.html',
  styleUrls: ['./olvide-clave.component.css']
})
export class OlvideClaveComponent implements OnInit {

  usuario= new UsuarioModel();
  
  constructor(
    private auth: AuthService
  ) { }

  ngOnInit(): void {
  }

  recuperar(form: NgForm){
    if(form.invalid){
      Swal.fire({
        title: 'Atencion', 
        text: 'El email es requerido',
        icon:"success"
      });
      return;
    }
    this.auth.recuperarContrasena(this.usuario).then(resp=>{
      Swal.close();         
    });   
  }

}
