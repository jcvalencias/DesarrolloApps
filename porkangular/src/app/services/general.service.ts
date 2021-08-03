import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { EntregaModel } from '../models/entrega.model';
import { EstadoModel } from '../models/estado.model';
import { MercadoModel } from '../models/mercado.model';
import { ProductoModel } from '../models/producto.model';
import { UsuarioModel } from '../models/usuario.model';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor(private http: HttpClient) { }

  //obtener registros
  getUsers(){    
    return this.http.get(`${URL}/usuario/`);
  }

  getRondas(){    
    return this.http.get(`${URL}/ronda/`);
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
  
  getEstado(){    
    return this.http.get(`${URL}/estado/`);
  }

  //Crear nuevos registros
  setMercado(mercado: MercadoModel){    
    return this.http.post(`${URL}/mercado/create`, mercado);
  }
  setProducto(producto: ProductoModel){    
    return this.http.post(`${URL}/producto/create`,producto);
  }
  setEntrega(entrega: EntregaModel){    
    return this.http.post(`${URL}/entrega/create`, entrega);
  }
  
  setEstado(estado: EstadoModel){    
    return this.http.post(`${URL}/estado/create`, estado);
  }

  //Modificar registros
  updateMercado(mercado: MercadoModel){    
    return this.http.post(`${URL}/mercado/update`, mercado);
  }
  updateProducto(producto: ProductoModel){    
    return this.http.post(`${URL}/producto/update`,producto);
  }
  updateEntrega(entrega: EntregaModel){    
    return this.http.post(`${URL}/entrega/update`, entrega);
  }
  updateUser(usuario: UsuarioModel){        
    return this.http.post(`${URL}/usuario/update`, usuario);
  }
  updateEstado(estado: EstadoModel){    
    return this.http.post(`${URL}/estado/update`, estado);
  }

  //Eliminar registros
  deleteMercado(mercado: MercadoModel){    
    return this.http.post(`${URL}/mercado/delete`, mercado);
  };
  deleteProducto(producto: ProductoModel){    
    return this.http.post(`${URL}/producto/delete`,producto);
  };
  deleteEntrega(entrega: EntregaModel){
    console.log(entrega);        
    return this.http.post(`${URL}/entrega/delete`, entrega);    
  };
  
}
