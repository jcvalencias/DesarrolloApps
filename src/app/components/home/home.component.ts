import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
  }

  enviarMensaje(){
    this.authService.enviarNoti().subscribe(resp=>{
      console.log(resp);
      
    })/* .then(resp=>{
      console.log('exito',resp);      
    },(err: HttpErrorResponse)=>{
      if (err.error instanceof Error) {
        console.log("Client-side error");
      } else {
        console.log("Server-side error");
      }
    }) */
  }

}
