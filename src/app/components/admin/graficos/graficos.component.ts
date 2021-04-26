import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.component.html',
  styleUrls: ['./graficos.component.css']
})
export class GraficosComponent implements OnInit {

  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };
  
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartData: ChartDataSets[] = [];
  public barChartDataP: ChartDataSets[] = [];  

  numeroSemana: any; 
  year =new Date().getFullYear();
  listaMercados:any=[];
  rondaSemanal: any =[];
  conteoPieBog= 0;
  conteoCalienteBog = 0;
  conteoFriaBog = 0;
  conteoPieAnt= 0;
  conteoCalienteAnt = 0;
  conteoFriaAnt = 0;
  conteoPieVal= 0;
  conteoCalienteVal = 0;
  conteoFriaVal = 0;
  conteoPieEje= 0;
  conteoCalienteEje = 0;
  conteoFriaEje = 0;
  conteoPieCos= 0;
  conteoCalienteCos = 0;
  conteoFriaCos = 0;
  conteoPieBogP= 0;
  conteoCalienteBogP = 0;
  conteoFriaBogP = 0;
  conteoPieAntP= 0;
  conteoCalienteAntP = 0;
  conteoFriaAntP = 0;
  conteoPieValP= 0;
  conteoCalienteValP = 0;
  conteoFriaValP = 0;
  conteoPieEjeP= 0;
  conteoCalienteEjeP = 0;
  conteoFriaEjeP = 0;
  conteoPieCosP= 0;
  conteoCalienteCosP = 0;
  conteoFriaCosP = 0;

  constructor(
    private auth : AuthService,
    private router: Router,
  ) { }
  
  ngOnInit(): void {
    this.cargarLocalizacion();
    this.consultarRondaActual();
    this.consultarRondaAnterior();
    this.numeroSemana = this.auth.numeroSemana;
  }

  cargarLocalizacion(){
    this.auth.getLocalizacion().then(resp=>{
      this.listaMercados= this.auth.listaMercados;
      this.barChartLabels= this.listaMercados
    });
  }

  consultarRondaActual(){
    //this.router.navigateByUrl('/admin');
    this.conteoPieBog=0;
    this.conteoCalienteBog=0;
    this.conteoFriaBog=0;
    this.conteoPieVal=0;
    this.conteoCalienteVal=0;
    this.conteoFriaVal=0;
    this.conteoPieAnt=0;
    this.conteoCalienteAnt=0;
    this.conteoFriaAnt=0;
    this.conteoPieEje=0;
    this.conteoCalienteEje=0;
    this.conteoFriaEje=0;
    this.conteoPieCos=0;
    this.conteoCalienteCos=0;
    this.conteoFriaCos=0;
    this.auth.getRondaHistorica().then(resp=>{
      for(let registro of this.auth.listaRondaHistorica){
        if(registro.Semana== this.numeroSemana && registro.Year == this.year){
          if(registro.Producto == 'Cerdo en Pie' && registro.Mercado == 'Bogotá'){
            this.conteoPieBog ++;
          }
          if(registro.Producto == 'Canal Caliente' && registro.Mercado == 'Bogotá'){
            this.conteoCalienteBog ++;
          }
          if(registro.Producto == 'Canal Fría' && registro.Mercado == 'Bogotá'){
            this.conteoFriaBog ++;
          }
          if(registro.Producto == 'Cerdo en Pie' && registro.Mercado == 'Antioquia'){
            this.conteoPieAnt ++;
          }
          if(registro.Producto == 'Canal Caliente' && registro.Mercado == 'Antioquia'){
            this.conteoCalienteAnt ++;
          }
          if(registro.Producto == 'Canal Fría' && registro.Mercado == 'Antioquia'){
            this.conteoFriaAnt ++;
          }
          if(registro.Producto == 'Cerdo en Pie' && registro.Mercado == 'Valle del Cauca'){
            this.conteoPieVal ++;
          }
          if(registro.Producto == 'Canal Caliente' && registro.Mercado == 'Valle del Cauca'){
            this.conteoCalienteVal ++;
          }
          if(registro.Producto == 'Canal Fría' && registro.Mercado == 'Valle del Cauca'){
            this.conteoFriaVal ++;
          }
          if(registro.Producto == 'Cerdo en Pie' && registro.Mercado == 'Eje Cafetero'){
            this.conteoPieEje ++;
          }
          if(registro.Producto == 'Canal Caliente' && registro.Mercado == 'Eje Cafetero'){
            this.conteoCalienteEje ++;
          }
          if(registro.Producto == 'Canal Fría' && registro.Mercado == 'Eje Cafetero'){
            this.conteoFriaEje ++;
          }
          if(registro.Producto == 'Cerdo en Pie' && registro.Mercado == 'Costa Atlántica'){
            this.conteoPieCos ++;
          }
          if(registro.Producto == 'Canal Caliente' && registro.Mercado == 'Costa Atlántica'){
            this.conteoCalienteCos ++;
          }
          if(registro.Producto == 'Canal Fría' && registro.Mercado == 'Costa Atlántica'){
            this.conteoFriaCos ++;
          }           
          this.barChartData= [
            { data: [this.conteoPieAnt, this.conteoPieEje, this.conteoPieVal, this.conteoPieCos, this.conteoPieBog], label: 'Cerdo en Pie' },
            { data: [this.conteoCalienteAnt, this.conteoCalienteEje, this.conteoCalienteVal, this.conteoCalienteCos, this.conteoCalienteBog], label: 'Canal Caliente' },
            { data: [this.conteoFriaAnt, this.conteoFriaEje, this.conteoFriaVal, this.conteoFriaCos, this.conteoFriaBog], label: 'Canal Fría' }
          ];        
        }
      }      
    }) 
  }

  consultarRondaAnterior(){
    this.conteoPieBogP=0;
    this.conteoCalienteBogP=0;
    this.conteoFriaBogP=0;
    this.conteoPieValP=0;
    this.conteoCalienteValP=0;
    this.conteoFriaValP=0;
    this.conteoPieAntP=0;
    this.conteoCalienteAntP=0;
    this.conteoFriaAntP=0;
    this.conteoPieEjeP=0;
    this.conteoCalienteEjeP=0;
    this.conteoFriaEjeP=0;
    this.conteoPieCosP=0;
    this.conteoCalienteCosP=0;
    this.conteoFriaCosP=0;
    this.auth.getRondaHistorica().then(resp=>{
      for(let registro of this.auth.listaRondaHistorica){
        if(registro.Semana == (this.numeroSemana-1) && registro.Year == this.year){
          if(registro.Producto == 'Cerdo en Pie' && registro.Mercado == 'Bogotá'){
            this.conteoPieBogP ++;
          }
          if(registro.Producto == 'Canal Caliente' && registro.Mercado == 'Bogotá'){
            this.conteoCalienteBogP ++;
          }
          if(registro.Producto == 'Canal Fría' && registro.Mercado == 'Bogotá'){
            this.conteoFriaBogP ++;
          }
          if(registro.Producto == 'Cerdo en Pie' && registro.Mercado == 'Antioquia'){
            this.conteoPieAntP ++;
          }
          if(registro.Producto == 'Canal Caliente' && registro.Mercado == 'Antioquia'){
            this.conteoCalienteAntP ++;
          }
          if(registro.Producto == 'Canal Fría' && registro.Mercado == 'Antioquia'){
            this.conteoFriaAntP ++;
          }
          if(registro.Producto == 'Cerdo en Pie' && registro.Mercado == 'Valle del Cauca'){
            this.conteoPieValP ++;
          }
          if(registro.Producto == 'Canal Caliente' && registro.Mercado == 'Valle del Cauca'){
            this.conteoCalienteValP ++;
          }
          if(registro.Producto == 'Canal Fría' && registro.Mercado == 'Valle del Cauca'){
            this.conteoFriaValP ++;
          }
          if(registro.Producto == 'Cerdo en Pie' && registro.Mercado == 'Eje Cafetero'){
            this.conteoPieEjeP ++;
          }
          if(registro.Producto == 'Canal Caliente' && registro.Mercado == 'Eje Cafetero'){
            this.conteoCalienteEjeP ++;
          }
          if(registro.Producto == 'Canal Fría' && registro.Mercado == 'Eje Cafetero'){
            this.conteoFriaEjeP ++;
          }
          if(registro.Producto == 'Cerdo en Pie' && registro.Mercado == 'Costa Atlántica'){
            this.conteoPieCosP ++;
          }
          if(registro.Producto == 'Canal Caliente' && registro.Mercado == 'Costa Atlántica'){
            this.conteoCalienteCosP ++;
          }
          if(registro.Producto == 'Canal Fría' && registro.Mercado == 'Costa Atlántica'){
            this.conteoFriaCosP ++;
          }          
          this.barChartDataP= [
            { data: [this.conteoPieAntP, this.conteoPieEjeP, this.conteoPieValP, this.conteoPieCosP, this.conteoPieBogP], label: 'Cerdo en Pie' },
            { data: [this.conteoCalienteAntP, this.conteoCalienteEjeP, this.conteoCalienteValP, this.conteoCalienteCosP, this.conteoCalienteBogP], label: 'Canal Caliente' },
            { data: [this.conteoFriaAntP, this.conteoFriaEjeP, this.conteoFriaValP, this.conteoFriaCosP, this.conteoFriaBogP], label: 'Canal Fría' }
          ];        
        }
      }
      
    }) 
  }

}
