import { Component, OnInit } from '@angular/core';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { AuthService } from 'src/app/services/auth.service';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  usuarioLista: UsuarioModel[]=[];
  listaUser: any[]=[];

  constructor(
    private auth : AuthService,
    private general: GeneralService, 
      
  ) {
    this.listarUser();
   }

  ngOnInit(): void {    
    this.listarUser();
  }

  async listarUser(){
    this.general.getUsers().subscribe((resp:any)=>{
      this.usuarioLista = resp["users"];
      this.listaUser.length= 0;
      for(let user of this.usuarioLista){        
        if(user.estado == false){
          this.listaUser.push(user);                            
        }
      } 
      console.log(this.listaUser);      
    });      
  }
  

  activarU(usuario = new UsuarioModel() ){
    usuario.estado = true;
    Swal.fire({
      title: '¿Esta seguro?',
      text: '¿Esta seguro de activar este usuario?',
      icon: 'warning',
      showCancelButton: true,
      showConfirmButton: true,
    }).then((acepto)=>{
      if(acepto.value){
        console.log(usuario);        
        this.general.updateUser(usuario).subscribe(resp=>{
          console.log(resp);
            
        });  
              
      }else{
        return;
      }
      this.listarUser();
    }) 
  }
}
