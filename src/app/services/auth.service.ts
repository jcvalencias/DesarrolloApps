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
import { RondaModel } from '../models/ronda.model';

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
  listaUser : any = [];
  listaIdUser : any=[];
  listaMercados : any = [];
  listaProducto : any = [];
  listaEntrega : any = [];
  listaRonda: any = [];
  estadoRonda: any = [];

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
    this.getProducto();
    this.getEntrega();
    this.getUser();
    this.getLocalizacion();
    this.getRonda();
  }

  async crear(dato: UsuarioModel){  
    return await this.afauth.createUserWithEmailAndPassword(dato.Email,dato.Password).then(userCredential =>{
      let uid: any = userCredential.user?.uid;
      userCredential.user?.sendEmailVerification();
      this.crearUser(dato, uid);
    })    
  }

  async crearUser(datos: UsuarioModel, uid: string ){
    const userTemp1={
      Nombre : datos.Nombre,
      Apellido : datos.Apellido,
      Celular: datos.Celular,
      Granja: datos.Granja,
      Email: datos.Email,
      Localizacion : datos.Localizacion,
      CodigoMostrar : datos.CodigoMostrar,
      Estado: datos.Estado,
      IdCodigo: uid,
      Participa : false,
    }    
    return await this.afs.collection('Usuarios').doc().set(userTemp1).then(resp=>{
      
     })
  }

  recuperarContrasena(usuario: UsuarioModel){
    return this.afauth.sendPasswordResetEmail(usuario.Email).then(resp=>{
      Swal.fire({
        title: 'Atencion', 
        text: 'Revise la bandeja de entrada de su correo electrónico para continuar',
        icon:"success"
      });
      this.router.navigateByUrl('/acceso');
    })
  }

  async setUserParicipa(user: UsuarioModel,id: string){    
    const participa={
      Nombre : user.Nombre,
      Apellido : user.Apellido,
      Celular: user.Celular,
      Granja: user.Granja,
      Email: user.Email,
      Localizacion : user.Localizacion,
      CodigoMostrar : user.CodigoMostrar,
      Estado: user.Estado,
      IdCodigo: user.IdUsuario,
      Participa : true,
    }   
    return await this.afs.collection('Usuarios').doc(id).set(participa).then(resp=>{
      console.log('ok');
      
     })
  }

  async getUser(){        
    return await this.afs.collection('Usuarios').get().forEach((element) => {
      (element.docs).forEach((i:any)=>{
        this.listaUser.push(i.data());
        this.listaIdUser.push(i.id)
        //console.log(i.id); 
       //console.log(this.listaUser);
        return this.listaUser;
      })       
    })   
  }

  getLocalizacion(){        
    this.afs.collection('Mercados').get().forEach((element) => {
      (element.docs).forEach((i:any)=>{
        this.listaMercados.push(i.data());        
        return this.listaMercados;
      })       
    })        
  }

  getProducto(){        
    this.afs.collection('Productos').get().forEach((element) => {
      (element.docs).forEach((i:any)=>{
        this.listaProducto.push(i.data());        
        return this.listaProducto;
      })       
    })           
  }

  getEntrega(){        
    this.afs.collection('Entrega').get().forEach((element) => {
      (element.docs).forEach((i:any)=>{
        this.listaEntrega.push(i.data());        
        return this.listaEntrega;
      })       
    })           
  }

  logOut(){
    return this.afauth.signOut().then(()=>{    
      localStorage.clear(); 
      Swal.fire("Atencion", "Gracias por participar", "success");   
      this.router.navigateByUrl('/acceso');
    })
  }

  signIn(dato: UsuarioModel){    
    return this.afauth.setPersistence(firebase.default.auth.Auth.Persistence.LOCAL)
    .then(()=>{      
      this.afauth.signInWithEmailAndPassword( dato.Email, dato.Password).then((userCredential)=>{        
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
            this.router.navigateByUrl(`/ronda/${userCredential.user?.uid}`);
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

  async setRonda(ronda: RondaModel){
    return await this.afs.collection('RondaHistorica').doc().set({
            Producto : ronda.Producto,
            Cantidad : ronda.Cantidad,
            Peso: ronda.Peso,
            Precio: ronda.Precio,
            Comentario: ronda.Comentario,
            Mercado: ronda.Mercado,
            Entrega: ronda.Entrega,
            Usuario: ronda.Usuario,
            Fecha: ronda.Fecha,
            Year: ronda.Year,
            Semana: ronda.Semana,
            UltimoDia: ronda.UltimoDia,            
    }).then(resp=>{
      Swal.fire({
        title: 'Buen trabajo', 
        text: 'Registro creado exitosamente!!!',
        icon:"success"
      });
    })
  }

  getEstadoRonda(){
    return this.afs.collection('Estado').get().forEach((element) => {
      (element.docs).forEach((i:any)=>{      
        this.estadoRonda=i.data().Estado;        
        return this.estadoRonda;
      })       
    })  
  }

  setEstadoRonda(estado:string){
    this.afs.collection('Estado').doc('1').set({Estado:estado, id:'1'});
  }

  getRonda(){
    return this.afs.collection('RondaHistorica').get().forEach((element) => {
      (element.docs).forEach((i:any)=>{              
        this.listaRonda.push(i.data()); 
        return this.listaRonda;
      })       
    })  
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
