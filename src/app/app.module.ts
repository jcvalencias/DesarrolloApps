import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

//firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule} from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';

//enviroment
import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { RegistroComponent } from './components/registro/registro.component';
import { AccesoComponent } from './components/acceso/acceso.component';
import { AyudaComponent } from './components/ayuda/ayuda.component';
import { RondaComponent } from './components/ronda/ronda.component';
import { AdminComponent } from './components/admin/admin.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { OlvideClaveComponent } from './components/olvide-clave/olvide-clave.component';
import { ActivarComponent } from './components/admin/activar/activar.component';
import { ParticipacionComponent } from './components/admin/participacion/participacion.component';
import { GraficosComponent } from './components/admin/graficos/graficos.component';
import { DescargasComponent } from './components/admin/descargas/descargas.component';
import { ConsultarComponent } from './components/admin/consultar/consultar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ChartsModule } from 'ng2-charts';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    RegistroComponent,
    AccesoComponent,
    AyudaComponent,
    RondaComponent,
    AdminComponent,
    HomeComponent,
    NavbarComponent,
    OlvideClaveComponent,
    ActivarComponent,
    ParticipacionComponent,
    GraficosComponent,
    DescargasComponent,
    ConsultarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    BrowserAnimationsModule,
    ChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
