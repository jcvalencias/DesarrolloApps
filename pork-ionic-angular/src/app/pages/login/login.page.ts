import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email:string;
  password:string;

  constructor(
    private auth: AuthService,
    private toastr: ToastController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
  }

  login(){
    if(this.email && this.password){
      this.auth.signIn(this.email, this.password);
    }else{
      this.presentAlert()
    }
  }

  async presentAlert() {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      backdropDismiss: false,
      header: 'Atencion',
      //subHeader: 'Subtitle',
      message: 'Recuerde ingresar correo electrónico y contraseña',
      buttons: ['OK']
    });

    await alert.present();
  }

}
