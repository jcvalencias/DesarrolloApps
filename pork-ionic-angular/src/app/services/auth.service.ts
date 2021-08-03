import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import {Router } from '@angular/router';
import { AlertController, LoadingController, ToastController} from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { switchMap} from 'rxjs/operators';
import { UserInterface } from '../interfaces/user-interface';
import { Storage } from '@ionic/storage';
import { GeneralService } from './general.service';

declare global {
  interface Date {
      getWeek (start?: Date) : [Date, Number]
  }
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: Observable<UserInterface>;
  user: UserInterface;
  userToken: any; 
  listaIdUser : any=[];
  numeroSemana: any; 
  finSemana: any;
  years:any= [];
  uid: any;
  usuario;
  credenciales: any;

  private _storage: Storage | null = null;

  constructor(
    private afs: AngularFirestore,
    private general: GeneralService,
    private afauth: AngularFireAuth,
    private router: Router,
    private loadingController: LoadingController,
    private toastcr: ToastController,
    private alertCtrl: AlertController,
    private storage: Storage,
  ) {
    this.user$ = this.afauth.authState.pipe(
      switchMap( user => {       
        if(user){
          return this.afs.doc<UserInterface>(`user/ ${user.uid}`).valueChanges();         
        }else{
          return of(null);
        }
      })
    )
    this.init();
    this.estaAutenticado(); 
    this.generarFechas();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  public set(key: string, value: any) {
    this._storage?.set(key, value);
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

  async seguridad(data, userActivo){
    const loading = await this.loadingController.create({
      message: `Autenticando....`,
      spinner: `crescent`,
      showBackdrop: true,
    });
    loading.present();
    let idtoken:any = data.user?.refreshToken;

    this.general.getUsers().subscribe((resp: any)=>{
      this.listaIdUser = resp["users"];              
    },err=>{
      this.router.navigateByUrl('/inicio');
      this.presentAlert('Error', 'No se ha podido conectar con el servidor.'); 
    });

    if(!data.user.emailVerified){
      loading.dismiss();
      this.presentAlert('Atención', 'Este correo electrónico aun no ha sido verificado o no esta registrado! Revise la bandeja de entrada de su correo electrónico.')
      this.afauth.signOut();
    }else if(userActivo==true){
      this.guardarToken(idtoken);
      this.estaAutenticado();
      loading.dismiss();
      this.router.navigateByUrl(`/ronda-semanal/${data.user?.uid}`);
    }else{
      loading.dismiss();
      this.presentAlert('Atención', 'Estamos en proceso de verificación de los datos suministrados, pronto podrá acceder.')
    }
  }

  async signIn(email, password){
    let userActivo:boolean = false;
    this.afauth.setPersistence(firebase.default.auth.Auth.Persistence.LOCAL)
    .then(()=>{
      this.afauth.signInWithEmailAndPassword(email, password).then((data)=>{
        
          //Valida el estado de los usuarios para permitirles participar en la ronda
          this.general.getUsers().subscribe((resp: any)=>{
            this.listaIdUser = resp["users"];
            for(let user of this.listaIdUser){
              if(user.idUsuario == data.user?.uid){
                if(user.estado == true){                 
                  userActivo = true;
                }else{
                  userActivo = false;
                }
              }
            }
            this.seguridad(data,userActivo);
          },err=>{
            this.router.navigateByUrl('/inicio');
            this.presentAlert('Error', 'No se ha podido conectar con el servidor.');
            return; 
          });                        
      })
      .catch(error=>{
        this.presentAlert('Error', 'Correo o contraseña incorrectos.')
      })
    })
    .catch(error=>{
      this.presentAlert('Error', 'Algo anda mal, verifica los datos y vuelve a intentarlo.')
    })
  }// fin sign In

  async crear(dato: UserInterface){  
    return await this.afauth.createUserWithEmailAndPassword(dato.email,dato.password).then(userCredential =>{
      this.uid = userCredential.user.uid;
      this.credenciales = userCredential.user;
      return this.uid;
    }).catch(error=>{  
      this.presentAlert('Atención','El correo electrónico ingresado ya esta registrado, utilice otro correo y vuelva a intentarlo.');         
      this.router.navigateByUrl('/inicio');
    })   
  }

  async eliminarUser(mail, pass){
    this.afauth.setPersistence(firebase.default.auth.Auth.Persistence.LOCAL)
    .then(()=>{
      this.afauth.signInWithEmailAndPassword(mail, pass).then((data)=>{
        data.user.delete().then(ar=>{
          this.router.navigateByUrl('/registro');
          return;
        })          
      })
      .catch(error=>{        
        this.presentAlert('Error', 'Ha ocurrido un error.');
      })
    })
    .catch(error=>{      
      this.presentAlert('Error', 'Ha ocurrido un error.');
    })
  }

  recuperarContrasena(usuario: string){
    return this.afauth.sendPasswordResetEmail(usuario).then(resp=>{
      this.presentAlert('Atencion', 'Revise la bandeja de entrada de su correo electrónico para continuar.')
      this.router.navigateByUrl('/login');
    })
  } 
  
  async signOut(){
    const loading = await this.loadingController.create({
      spinner:`crescent`,
      showBackdrop: true,
    })
    loading.present();
    this.afauth.signOut()
    .then(()=>{
      loading.dismiss();
      this.router.navigate(['/login']);
    })
  }

  async salidaForzada(){
    return await this.afauth.signOut().then(()=>{    
      localStorage.clear(); 
      this.router.navigateByUrl('/inicio');
    })
  }

  async logOut(){
    return await this.afauth.signOut().then(()=>{    
      localStorage.clear();
      this.presentAlert('Señor Porcicultor', 'Gracias por participar y compartir su información.') 
      this.router.navigateByUrl('/inicio');
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

  async presentAlert(a: string, b: string) {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      backdropDismiss: false,
      header: a,
      message: b,
      buttons: ['OK']
    });
    await alert.present();
  }
  
  async toast(message, status){
    const toast = await this.toastcr.create({
      message: message,
      color: status,
      position: 'top',
      duration: 2000
    });
    toast.present();
  }
}
