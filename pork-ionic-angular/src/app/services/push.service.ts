import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { OneSignal, OSNotification, OSNotificationPayload } from '@ionic-native/onesignal/ngx';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PushService {

  mensajes: any[] =[];
  payload: any[] = [];
  pushListener = new EventEmitter<any>();
  userId : string;

  private _storage: Storage | null = null;
  constructor(
    private oneSignal: OneSignal,
    private storage: Storage,
    private http: HttpClient,
    private router: Router,
  ) {
    this.init();
    this.cargarMensajes();
   }
   async init() {
     //this.getNewReleases();
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    const storage = await this.storage.create();
    this._storage = storage;
  }

  // Create and expose methods that users of this service can
  // call, for example:
  public set(key: string, value: any) {
    this._storage?.set(key, value);
  }

  async getMensajes(){
    await this.cargarMensajes();
    return [...this.mensajes];
  }

  async deleteMensaje(){
    await this.storage.remove('mensajes');
    this.mensajes = [];
    this.guardarMensajes();
  }

  async deleteCodigo(){
    await this.storage.remove('codigo');
  }

  configuracionInicial(){
    this.oneSignal.startInit('84ff21c0-65d3-41e2-a845-c06d3d7dbc8c', '531521260136');
    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);

    this.oneSignal.handleNotificationReceived().subscribe((noti) => {
    // do something when notification is received
    console.log('notificación recibida', noti);
    this.notificacionRecibida(noti);
    });

    this.oneSignal.handleNotificationOpened().subscribe(async (noti) => {
      // do something when a notification is opened
      console.log('notificación abierta', noti);
      await this.notificacionRecibida(noti.notification);       
    });

    //codigo del suscriptor
    this.oneSignal.getIds().then(info=>{
      this.userId= info.userId     
    })
    this.oneSignal.endInit();
  }

  async notificacionRecibida(noti: OSNotification){
    this.router.navigateByUrl('/alert');// navegar
    await this.cargarMensajes();
    this.payload = [{
      id: noti.payload.notificationID,
      title: noti.payload.title,
      body: noti.payload.body,
      date: new Date().toLocaleString()
    }]
    //const payload = noti.payload;
    const existePush = this.mensajes.find( mensaje=> mensaje[0].id === noti.payload.notificationID)
    if(existePush){
      return;
    }    
    this.mensajes.unshift(this.payload);
    this.pushListener.emit(this.payload);
    await this.guardarMensajes();
  }

  guardarMensajes(){
    this.storage.set('mensajes', this.mensajes); 
    this.storage.set('userId', this.userId); 
  }

  async cargarMensajes(){
    this.mensajes = await this.storage.get('mensajes') || [];
    return this.mensajes;
  }
}
