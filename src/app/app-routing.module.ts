import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AccesoComponent } from './components/acceso/acceso.component';
import { AdminComponent } from './components/admin/admin.component';
import { AyudaComponent } from './components/ayuda/ayuda.component';
import { HomeComponent } from './components/home/home.component';
import { OlvideClaveComponent } from './components/olvide-clave/olvide-clave.component';
import { RegistroComponent } from './components/registro/registro.component';
import { RondaComponent } from './components/ronda/ronda.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  //{path: 'home', component: HomeComponent},
  {path: 'registro', component: RegistroComponent},
  {path: 'acceso', component: AccesoComponent},
  {path: 'ayuda', component: AyudaComponent},
  {path: 'ronda/:id', component: RondaComponent, canActivate:[AuthGuard]},
  {path: 'admin', component: AdminComponent,  canActivate:[AuthGuard]},
  {path: 'olvideClave', component: OlvideClaveComponent},
  { path: '**', redirectTo: 'acceso', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
