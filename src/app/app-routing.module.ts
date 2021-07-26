import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AccesoComponent } from './components/acceso/acceso.component';
import { AdminComponent } from './components/admin/admin.component';
import { AyudaComponent } from './components/ayuda/ayuda.component';
import { HomeComponent } from './components/home/home.component';
import { OlvideClaveComponent } from './components/olvide-clave/olvide-clave.component';
import { RegistroComponent } from './components/registro/registro.component';
import { MensajesComponent} from './components/admin/mensajes/mensajes.component';
import { ParticipacionComponent} from './components/admin/participacion/participacion.component';
import { DescargasComponent} from './components/admin/descargas/descargas.component';
import { ConsultarComponent} from './components/admin/consultar/consultar.component';
import { GraficosComponent} from './components/admin/graficos/graficos.component';
import { ParametrosComponent} from './components/admin/parametros/parametros.component';
import { UsuariosComponent} from './components/admin/usuarios/usuarios.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  //{path: 'home', component: HomeComponent},
  {path: 'admin/mensajes', component: MensajesComponent, canActivate:[AuthGuard]},
  {path: 'admin/participacion', component: ParticipacionComponent, canActivate:[AuthGuard]},
  {path: 'admin/consultar', component: ConsultarComponent, canActivate:[AuthGuard]},
  {path: 'admin/descargas', component: DescargasComponent, canActivate:[AuthGuard]},
  {path: 'admin/graficos', component: GraficosComponent, canActivate:[AuthGuard]},
  {path: 'admin/parametros', component: ParametrosComponent, canActivate:[AuthGuard]},
  {path: 'admin/usuarios', component: UsuariosComponent, canActivate:[AuthGuard]},
  //{path: 'registro', component: RegistroComponent},
  {path: 'acceso', component: AccesoComponent},
  {path: 'ayuda', component: AyudaComponent},
  {path: 'admin', component: AdminComponent,  canActivate:[AuthGuard]},
  {path: 'olvideClave', component: OlvideClaveComponent},
  { path: '**', redirectTo: 'acceso', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
