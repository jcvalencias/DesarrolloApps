import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FinalPageRoutingModule } from './final-routing.module';

import { FinalPage } from './final.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { RegistroPageModule } from '../registro/registro.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    FinalPageRoutingModule,
    ComponentsModule,
  ],
  declarations: [FinalPage],
  exports:[FinalPage],
})
export class FinalPageModule {}
