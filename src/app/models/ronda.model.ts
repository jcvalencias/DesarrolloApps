export class RondaModel{
    Year= new Date().getFullYear();
    //Fecha = (new Date().getMonth()+1) + "/" + (new Date().getDate()) + "/" + (new Date().getFullYear()) + " " + (new Date().getHours()) +":" + (new Date().getMinutes()) ;
    Fecha : string = '';
    UltimoDia: string ='';
    Semana: string = '';
    Producto: string ='';
    Cantidad: number= 0;
    Peso: number =0;
    Precio : number = 0;     
    Mercado: string = '';    
    Comentario: string ='';
    Entrega: string= '';
    Usuario: string='';
}
