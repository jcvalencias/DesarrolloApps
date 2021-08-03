import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';


import { IonicModule } from '@ionic/angular';

import { RegistroPageRoutingModule } from './registro-routing.module';

import { RegistroPage } from './registro.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { FinalPageModule } from '../final/final.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    RegistroPageRoutingModule,
    ComponentsModule, 
    FinalPageModule,   
  ],
  declarations: [RegistroPage],
  exports:[RegistroPage],
})
export class RegistroPageModule {}
