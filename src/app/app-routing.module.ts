import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AccesoComponent } from './components/acceso/acceso.component';
import { AdminComponent } from './components/admin/admin.component';
import { AyudaComponent } from './components/ayuda/ayuda.component';
import { HomeComponent } from './components/home/home.component';
import { RegistroComponent } from './components/registro/registro.component';
import { RondaComponent } from './components/ronda/ronda.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'registro', component: RegistroComponent},
  {path: 'acceso', component: AccesoComponent},
  {path: 'ayuda', component: AyudaComponent},
  {path: 'ronda', component: RondaComponent},
  {path: 'admin', component: AdminComponent},
  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
