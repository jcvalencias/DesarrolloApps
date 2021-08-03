import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-password',
  templateUrl: './password.page.html',
  styleUrls: ['./password.page.scss'],
})
export class PasswordPage implements OnInit {
  email:string;

  constructor(
    private auth: AuthService,
    private toastr: ToastController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
  }
  recuperar(){
    if(this.email){
      this.auth.recuperarContrasena(this.email);
    }else{
      //this.toast('Please enter your email and password', 'warning');
      this.presentAlert()
    }
  }
  /* async toast(message, status){
    const toast = await this.toastr.create({
      message: message,
      color: status,
      position: 'top',
      duration: 2000,
    });
    toast.present();
  } */

  async presentAlert() {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      backdropDismiss: false,
      header: 'Atencion',
      //subHeader: 'Subtitle',
      message: 'Recuerde ingresar correo electrónico',
      buttons: ['OK']
    });

    await alert.present();
  }

}
