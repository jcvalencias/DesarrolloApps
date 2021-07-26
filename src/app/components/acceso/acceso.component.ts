import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { AuthService } from 'src/app/services/auth.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-acceso',
  templateUrl: './acceso.component.html',
  styleUrls: ['./acceso.component.css']
})
export class AccesoComponent implements OnInit {

  usuario= new UsuarioModel();

  constructor(
    private auth: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  login(form: NgForm){
    if(form.invalid){
      Swal.fire({
        title: 'Atencion', 
        text: 'El email y contraseña son requeridos',
        icon:"success"
      });
      return;
    }
    Swal.fire({ 
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espera por Favor..'
    });
    Swal.showLoading();
    this.auth.signIn(this.usuario).then(resp=>{
      Swal.close();         
    })    
  }

}
