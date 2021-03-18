import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { AuthService } from 'src/app/services/auth.service';

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
    console.log(form.controls.email.value);   
    this.auth.recuperarContrasena(this.usuario); 
  }

}
