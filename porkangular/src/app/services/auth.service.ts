import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UsuarioModel } from '../models/usuario.model';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';
//import { } from 'firebase';

import { map, delay, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import Swal from 'sweetalert2';
import { RondaModel } from '../models/ronda.model';

import * as moment from 'moment';
import { ProductoModel } from '../models/producto.model';
import { EntregaModel } from '../models/entrega.model';
import { MercadoModel } from '../models/mercado.model';

declare global {
  interface Date {
      getWeek (start?: Date) : [Date, Number]
  }
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  /* private urlBD= "https://aplicativoronda-default-rtdb.firebaseio.com/";
  private apiKey= "AIzaSyCiBtzoZl_YWG4s0w8XORymSylMxcnuezE";
  private url= "https://identitytoolkit.googleapis.com/v1/accounts:"; */

  userToken: any;  
  usuario$: any;
  user: any;
  listaIdUser : any=[];
  listaMercados : any = [];
  listaProducto : any = [];
  listaEntrega : any = [];
  listaRonda: any = [];
  estadoRonda: any = [];
  rangosRonda: any = [];
  usuarioParticipa: any =[];
  total= 0;
  participantes = 0;
  numeroSemana: any; 
  finSemana: any;
  
  listaSemanas: any =[];
  listaOtra: any = [];
  uid : any;
  listaRondaHistorica: any=[];

  constructor(
    private http: HttpClient,
    private afs: AngularFirestore,
    private afauth: AngularFireAuth,
    private router: Router,
  ) {
    this.usuario$ = this.afauth.authState.pipe(
      switchMap( user => {
        console.log("user", user);
        if(user){
          return this.afs.doc<UsuarioModel>(`user/ ${user.uid}`).valueChanges();         
        }else{
          return of(null);
        }
      })
    )    
    this.estaAutenticado();   
    this.generarFechas();
  }

  enviarNoti(mensaje: string){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', 
      'Authorization': 'Basic YTAxODYxZWQtYzE0Ni00ZTE2LTkzZDItZWQyNTg4ZjEzNGYx',
    });

    const body = {
      "app_id": "84ff21c0-65d3-41e2-a845-c06d3d7dbc8c",
	    "included_segments": ["Active Users", "Inactive Users"],     
	    "contents": { "en": `${mensaje}`,  "es": `${mensaje}`},
	    "headings": { "en": "Mr Porcicultor", "es": "Señor Porcicultor"}
    }
    return this.http.post('https://onesignal.com/api/v1/notifications',JSON.stringify(body), {headers: headers})
    .pipe(
      map((resp: any) =>{
        //console.log('resp', resp);        
        return resp;
      })
    )     
  }

  enviarNotiSegmentado(mensaje: string, ids: any[]){
    let body;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', 
      'Authorization': 'Basic YTAxODYxZWQtYzE0Ni00ZTE2LTkzZDItZWQyNTg4ZjEzNGYx',
    });    
         //"include_player_ids": ["75288d27-3320-48bc-9bb0-cc79604a98b9", "54acebad-2f01-4b7b-918d-c86c3efc8d9e"], 
        body = {
          "app_id": "84ff21c0-65d3-41e2-a845-c06d3d7dbc8c",
          "include_player_ids": [ids],
          "contents": { "en": `${mensaje}`,  "es": `${mensaje}`},
          "headings": { "en": "Mr Porcicultor", "es": "Señor Porcicultor"}
        }
      
    
    
    return this.http.post('https://onesignal.com/api/v1/notifications',JSON.stringify(body), {headers: headers})
    .pipe(
      map((resp: any) =>{
        //console.log('resp', resp);        
        return resp;
      })
    )     
  }

  generarFechas(){
    Date.prototype.getWeek = function(start: any){
      var d: any = new Date(+this);  //Creamos un nuevo Date con la fecha de "this".
      d.setHours(0, 0, 0, 0);   //Nos aseguramos de limpiar la hora.
      d.setDate(d.getDate() + 4 - (d.getDay() || 7)); // Recorremos los días para asegurarnos de estar "dentro de la semana"         
      start = start || 0;
      var onejan: any = new Date(this.getFullYear(), 0, 1);
      var week = Math.ceil((((d - onejan) / 86400000) + onejan.getDay() + 1) / 7);//Finalmente, calculamos redondeando y ajustando por la naturaleza de los números en JS:
      var today = new Date(this.setHours(0, 0, 0, 0));
      var day = today.getDay() - start;
      var date = today.getDate() - day;
      var StartDate = new Date(today.setDate(date));
      var EndDate = new Date(today.setDate(date + 6));
      return [EndDate, (week-1)];
    }    
    let fechas = new Date().getWeek();
    this.numeroSemana = fechas[1];    
    this.finSemana = fechas[0].toLocaleString('en-US');
  }

  async salidaForzada(){
    return await this.afauth.signOut().then(()=>{    
      localStorage.clear();
      Swal.fire("Señor porcicultor", "Usted ya participo durante la ronda de la semana en curso, solo se permite una participación por semana, gracias.", "success"); 
      this.router.navigateByUrl('/inicio');
    })
  }

  async logOut(){
    return await this.afauth.signOut().then(()=>{    
      localStorage.clear(); 
      Swal.fire("Atencion", "Gracias por participar", "success");   
      this.router.navigateByUrl('/acceso');
    })
  }

  signIn(dato: UsuarioModel){        
    return this.afauth.setPersistence(firebase.default.auth.Auth.Persistence.LOCAL)
    .then(()=>{      
      this.afauth.signInWithEmailAndPassword( dato.email, dato.password).then((userCredential)=>{        
        let abc = userCredential.user?.email;
        let idtoken:any = userCredential.user?.refreshToken;
        if(userCredential.user?.emailVerified === false){          
          Swal.fire({
            title: 'Error', 
            text: 'Este email aun no ha sido verificado! revise la bandeja de entrada de su correo electrónico',
            icon:"warning"
          });
        }else{
          this.guardarToken(idtoken);
          Swal.fire({
            title: 'Bienvenido', 
            text: `${abc}`,
            icon:"warning"
          });
          if(userCredential.user?.uid == 'GMKCSg38KnOgzcbW2aB52Tzb3bp1'){
            this.router.navigateByUrl('/admin');
          }else{
            /* this.router.navigateByUrl(`/ronda/${userCredential.user?.uid}`); */
            Swal.fire({
              title: 'Error', 
              text: 'Usuario o contraseña incorrectos',
              icon:"warning"
            });
          }          
        }
      })
      .catch(error=>{
          console.log("error", error);
      })
    })
    .catch(error=>{
      console.log("error", error);      
    })
  }

  async crear(dato: UsuarioModel){  
    return await this.afauth.createUserWithEmailAndPassword(dato.email,dato.password).then(userCredential =>{
      this.uid = userCredential.user?.uid;
      userCredential.user?.sendEmailVerification();
      return this.uid;
    })    
  }

  recuperarContrasena(usuario: UsuarioModel){
    return this.afauth.sendPasswordResetEmail(usuario.email).then(resp=>{
      Swal.fire({
        title: 'Atencion', 
        text: 'Revise la bandeja de entrada de su correo electrónico para continuar',
        icon:"success"
      });
      this.router.navigateByUrl('/acceso');
    })
  }

  private guardarToken(idToken: string){
    this.userToken = idToken;    
    localStorage.setItem('token', idToken);
    let hoy = new Date();
    hoy.setSeconds(3600);
    localStorage.setItem('expira', hoy.getTime().toString());
  }

  estaAutenticado():boolean{
    this.userToken= localStorage.getItem('token');
    if(this.userToken == ''){
      return false;      
    }
    const expira=Number(localStorage.getItem('expira'));
    const expiraDate = new Date();
    expiraDate.setTime(expira);
    if(expiraDate > new Date()){
      return true;
    }else{
      return false;
    }
  }

}
