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
  listaUser : any = [];
  listaIdUser : any=[];
  listaMercados : any = [];
  listaProducto : any = [];
  listaEntrega : any = [];
  listaRonda: any = [];
  estadoRonda: any = [];
  usuarioParticipa: any =[];
  total= 0;
  participantes = 0;
  numeroSemana: any; 
  finSemana: any;
  years:any= [];
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
      'Authorization': 'Basic ZjhmMjE2MzgtYjMxOC00MmFhLThhOWItMmNkOTVkYWM1OTFl',
    });
    const body = {
      "app_id": "333eabbc-5a73-4e56-9375-7fb8f9461a86",
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
    console.log(this.finSemana);
  }

  async crear(dato: UsuarioModel){  
    return await this.afauth.createUserWithEmailAndPassword(dato.Email,dato.Password).then(userCredential =>{
      this.uid = userCredential.user?.uid;
      userCredential.user?.sendEmailVerification();
      return this.uid;
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
      IdCodigo: uid
    }    
    return await this.afs.collection('Usuarios').doc().set(userTemp1).then(resp=>{ })
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

  async setUserBloqueo(user: UsuarioModel,id: string, estado: string){        
    const bloqueo={
      Nombre : user.Nombre,
      Apellido : user.Apellido,
      Celular: user.Celular,
      Granja: user.Granja,
      Email: user.Email,
      Localizacion : user.Localizacion,
      CodigoMostrar : user.CodigoMostrar,
      Estado: estado,
      IdCodigo: user.IdUsuario
    }   
    return await this.afs.collection('Usuarios').doc(id).set(bloqueo).then(resp=>{
      console.log('ok');      
     })
  }

  getUser(){        
    return this.afs.collection('Usuarios').get().forEach((element) => {
      this.listaUser.length=0;
      this.listaOtra=(element.docs);
      (element.docs).forEach((i:any)=>{        
        this.listaUser.push(i.data());
        this.listaIdUser.push(i.id)                   
        return this.listaUser;
      })       
    })   
  }

  getRondaHistorica(){  
    this.listaRondaHistorica = [];      
    return this.afs.collection('RondaHistorica').get().forEach((element) => {
      (element.docs).forEach((i:any)=>{        
          this.listaRondaHistorica.push(i.data());                
        return this.listaRondaHistorica;
      })       
    })        
  }

  getLocalizacion(){ 
    this.listaMercados =[];       
    return this.afs.collection('Mercados').get().forEach((element) => {
      (element.docs).forEach((i:any)=>{
        this.listaMercados.push(i.data().Nombre);
        return this.listaMercados;
      })       
    })        
  }

  getProducto(){ 
    this.listaProducto =[];     
    return this.afs.collection('Productos').get().forEach((element) => {
      (element.docs).forEach((i:any)=>{
        this.listaProducto.push(i.data());        
        return this.listaProducto;
      })       
    })           
  }

  getEntrega(){
    this.listaEntrega =[];        
    return this.afs.collection('Entrega').get().forEach((element) => {
      (element.docs).forEach((i:any)=>{
        this.listaEntrega.push(i.data());        
        return this.listaEntrega;
      })       
    })           
  }

  async salidaForzada(){
    return await this.afauth.signOut().then(()=>{    
      localStorage.clear();
      Swal.fire("Señor porcicultor", "Usted ya participo durante la ronda de la semana en curso, solo se permite una participación por semana, gracias.", "success"); 
      this.router.navigateByUrl('/inicio');
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
    this.estadoRonda =[];
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
    let anio:any=[];
    let sem: any=[];  
    this.listaRonda = [];      
    return this.afs.collection('RondaHistorica').get().forEach((element:any)=>{
      this.listaRonda.length =0;
      (element.docs).map((i:any)=>{
        this.listaRonda.push(i.data());
        anio.push(i.data().Year);
        sem.push(i.data().Semana);
        this.years = Array.from(new Set(anio));
        this.years.sort((a: any,b: any) =>a-b);
        this.listaSemanas = Array.from(new Set(sem));
        this.listaSemanas.sort((a: any,b: any) =>a-b);  
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
