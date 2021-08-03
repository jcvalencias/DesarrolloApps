import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RondaSemanalPage } from './ronda-semanal.page';

const routes: Routes = [
  {
    path: '',
    component: RondaSemanalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RondaSemanalPageRoutingModule {}
