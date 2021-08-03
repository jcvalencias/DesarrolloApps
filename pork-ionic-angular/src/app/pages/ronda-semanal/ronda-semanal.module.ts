import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RondaSemanalPageRoutingModule } from './ronda-semanal-routing.module';

import { RondaSemanalPage } from './ronda-semanal.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    RondaSemanalPageRoutingModule,
    ComponentsModule
  ],
  declarations: [RondaSemanalPage]
})
export class RondaSemanalPageModule {}
