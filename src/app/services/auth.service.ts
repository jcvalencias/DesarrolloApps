import { HttpClient } from '@angular/common/http';
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
  datos : any= [];

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
    this.getUser();
  }

  async crear(dato: UsuarioModel){
    const userTemporal ={
      email: dato.email,
      password: dato.password,
    }
    
    return await this.afauth.createUserWithEmailAndPassword(userTemporal.email,userTemporal.password).then(userCredential =>{
      console.log('user', userCredential);
      userCredential.user?.sendEmailVerification();
      this.crearUser(dato);
    })    
  }

  crearUser(datos: UsuarioModel){
    const userTemp1={
      nombre : datos.nombre,
      apellido : datos.apellido,
      telefono: datos.telefono,
      granja: datos.granja,
      email: datos.email,
      localizacion : datos.localizacion,
      codigo : datos.codigo,
      estado: datos.estado
    }
    
    return this.afs.collection('Usuarios').doc().set(userTemp1).then(resp=>{
      console.log(resp);
      
    })
  }

  getUser(){        
    this.afs.collection('Usuarios').get().forEach((element) => {
      (element.docs).forEach((i:any)=>{
        //console.log(i.data());
        this.datos.push(i.data());        
        return this.datos;
      })       
    })
    //console.log(this.datos);     
  }

  signIn(dato: UsuarioModel){
    const userTemporal1 ={
      email: dato.email,
      password: dato.password,
    }
    return this.afauth.setPersistence(firebase.default.auth.Auth.Persistence.LOCAL)
    .then(()=>{      
      this.afauth.signInWithEmailAndPassword( userTemporal1.email,  userTemporal1.password).then((userCredential)=>{
        console.log("Validando",userCredential.user);
        let abc = userCredential.user?.email;
        let idtoken:any = userCredential.user?.refreshToken;
        if(userCredential.user?.emailVerified === false){
          
          Swal.fire({
            title: 'Error', 
            text: 'Este email aun no ha sido verificado! revise la bandeja de entrada de su correo electrónico',
            icon:"warning"
          });
        }else{
          console.log(idtoken);
          this.guardarToken(idtoken);
          Swal.fire({
            title: 'Bienvenido', 
            text: `${abc}`,
            icon:"warning"
          });
          this.router.navigateByUrl('/admin');
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

  private guardarToken(idToken: string){
    this.userToken = idToken;
    console.log(this.userToken);
    
    localStorage.setItem('token', idToken);
    let hoy = new Date();
    hoy.setSeconds(3600);
    localStorage.setItem('expira', hoy.getTime().toString());
  }
  estaAutenticado():boolean{
    if(this.userToken.length<2){
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





  /* login(usuario: UsuarioModel){
    const authData={
      email: usuario.email,
      password: usuario.password,
      returnSecureToken: true,
    }
    return this.http.post(`${this.url}signInWithPassword?key=${this.apiKey}`, authData)
      .pipe(
        map((resp: any) =>{
          this.guardarToken(resp['idToken']);
          return resp;
        })
      )    
  }

  crearUsuario(usuario: UsuarioModel){   
    const authData={
      email: usuario.email,
      password: usuario.password,
      returnSecureToken: true,
    }
    return this.http.post(`${this.url}signUp?key=${this.apiKey}`, authData)
        .pipe(
          map((resp:any)=>{
            usuario.id = resp.name;            
            this.guardarToken(resp['idToken']);
            this.sendVerification(resp['idToken']);
            return usuario;
          })
        );
  }

  sendVerification(idToken: string){
    const data ={
      requestType:"VERIFY_EMAIL",
      idToken: idToken
    }    
    return this.http.post(`${this.url}sendOobCode?key=${this.apiKey}`, data)
    .pipe(
      map((resp:any)=>{
        console.log(resp);        
        return resp;
      })
    );
  }

  saveUser(usuario: UsuarioModel){ 
    const userTemp={
    nombre: usuario.nombre,
    apellido: usuario.apellido,
    email: usuario.email,
    telefono: usuario.telefono,
    granja: usuario.granja,
    localizacion: usuario.localizacion,
    codigo: usuario.codigo,
    estado : 'Activo',
    };
    return this.http.post(`${this.urlBD}/Usuarios.json`,userTemp)
            .pipe(
              map((resp: any)=>{
                usuario.id = resp.name;
                return usuario;
              })
            );
  }

  getUsuarios(){
    return this.http.get(`${this.urlBD}/Usuarios.json`)
    .pipe(
      map(resp=> this.crearArreglo(resp)),
      delay(500)
    );
  }

  private crearArreglo(usuariosObj: any){
    const usuarios: UsuarioModel[] = [];
    if(usuariosObj === null){return [];}
    Object.keys( usuariosObj ).forEach( key =>{
      const usuario : UsuarioModel = usuariosObj[key];
      usuario.id = key;
      usuarios.push(usuario);
    });
    return usuarios;
  }

  private guardarToken(idToken: string){
    this.userToken = idToken;
    localStorage.setItem('token', idToken);
    let hoy = new Date();
    hoy.setSeconds(3600);
    localStorage.setItem('expira', hoy.getTime().toString());
  }

  leerToken(){
    if(localStorage.getItem('item')){
      this.userToken = localStorage.getItem('token');
    }else{
      this.userToken='';
    }
    return this.userToken;
  }

  estaAutenticado():boolean{
    if(this.userToken.length<2){
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
  } */

}
