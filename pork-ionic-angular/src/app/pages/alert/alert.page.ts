import { Component, OnInit } from '@angular/core';
import { OSNotificationPayload } from '@ionic-native/onesignal/ngx';
import { AlertController } from '@ionic/angular';
import { PushService } from 'src/app/services/push.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.page.html',
  styleUrls: ['./alert.page.scss'],
})
export class AlertPage implements OnInit { 

  mensajes: any[]=[];
  constructor(
    public pushService: PushService,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.pushService.pushListener.subscribe(noti =>{
      this.mensajes.unshift(noti);
    })
  }

  async ionViewWillEnter(){       
    this.mensajes = await this.pushService.getMensajes();
  }

  async borrarMensaje(){
    await this.pushService.deleteMensaje();
    this.mensajes = [];
  }

  async presentAlertConfirm() {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: '¿Esta seguro?',
      message: 'Esta acción eliminará todos los mensajes',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            return;
          }
        }, {
          text: 'Ok',
          handler: () => {
            this.borrarMensaje();
          }
        }
      ]
    });
    await alert.present();
  }

}
