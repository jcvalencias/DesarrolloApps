export class RondaModel{
    year= new Date().getFullYear();
    //Fecha = (new Date().getMonth()+1) + "/" + (new Date().getDate()) + "/" + (new Date().getFullYear()) + " " + (new Date().getHours()) +":" + (new Date().getMinutes()) ;
    fecha : string = '';
    ultimoDia: string ='';
    semana: string = '';
    producto: string ='';
    cantidad: number= 0;
    peso: number =0;
    precio : number = 0;     
    mercado: string = '';    
    comentario: string ='';
    entrega: string= '';
    usuario: string='';
}
