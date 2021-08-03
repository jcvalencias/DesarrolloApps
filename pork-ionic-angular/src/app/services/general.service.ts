import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { RondaInterface } from '../interfaces/ronda-interface';
import { UserInterface } from '../interfaces/user-interface';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor( private http: HttpClient) { }
  
  getUsers(){        
    return this.http.get(`${URL}/usuario/`);
  }

  setUser(usuario: UserInterface){
    return this.http.post(`${URL}/usuario/create`,usuario);
  }

  updateUser(usuario: UserInterface){        
    return this.http.post(`${URL}/usuario/update`, usuario);
  }

  getRondas(){    
    return this.http.get(`${URL}/ronda/`);
  }
  setRonda(ronda: RondaInterface){    
    return this.http.post(`${URL}/ronda/create`, ronda);
  }

  getMercados(){
    return this.http.get(`${URL}/mercado/`);
  }

  getProductos(){
    return this.http.get(`${URL}/producto/`);
  }

  getEntregas(){
    return this.http.get(`${URL}/entrega/`);
  }

  getEstados(){
    return this.http.get(`${URL}/estado/`);
  }
}
