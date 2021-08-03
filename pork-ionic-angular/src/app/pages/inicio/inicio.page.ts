import { Component, OnInit } from '@angular/core';
import { IonicSafeString } from '@ionic/core';
import { PushService } from 'src/app/services/push.service';
import { Platform } from '@ionic/angular';

interface Componente{
  icon: string;
  name: string;
  redirectTo: string;
}

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  componentes: Componente[]=[    
    {
      icon: 'person-add-outline',
      name: 'Registrarme',
      redirectTo: '/registro'
    },
    {
      icon: 'log-in-outline',
      name: 'Ingresar',
      redirectTo: '/login'
    },
    {
      icon: 'help-circle-outline',
      name: 'Instrucciones',
      redirectTo: '/ayuda'
    },
    {
      icon: 'mail-unread-outline',
      name: 'Mensajes',
      redirectTo: '/alert'
    }
  ]

  constructor(
    public pushService: PushService,
    public platform: Platform,
  ) {}

  ngOnInit() {
  }

  salir(){
    navigator["app"].exitApp();
  }
}
