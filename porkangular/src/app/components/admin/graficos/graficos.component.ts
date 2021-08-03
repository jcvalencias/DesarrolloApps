import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import { AuthService } from 'src/app/services/auth.service';
import { GeneralService } from 'src/app/services/general.service';

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
    private general: GeneralService
  ) { }
  
  ngOnInit(): void {
    this.cargarLocalizacion();
    this.consultarRondaActual();
    this.consultarRondaAnterior();
    this.numeroSemana = this.auth.numeroSemana;
  }

  cargarLocalizacion(){
    this.general.getMercados().subscribe((resp: any)=>{
      this.listaMercados = resp["mercados"];      
      for(let list of this.listaMercados){
        this.barChartLabels.push(list.Nombre)
        this.barChartLabels.sort();
      }
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
    this.general.getRondas().subscribe((resp: any)=>{ 
    //console.log(resp);    
      for(let registro of resp["rondas"]){                        
        if(registro.semana == this.numeroSemana && registro.year == this.year){
          if(registro.producto == 'Cerdo en Pie' && registro.mercado == 'Bogotá'){
            this.conteoPieBog ++;
          }
          if(registro.producto == 'Canal Caliente' && registro.mercado == 'Bogotá'){
            this.conteoCalienteBog ++;
          }
          if(registro.producto == 'Canal Fría' && registro.mercado == 'Bogotá'){
            this.conteoFriaBog ++;
          }
          if(registro.producto == 'Cerdo en Pie' && registro.mercado == 'Antioquia'){
            this.conteoPieAnt ++;
          }
          if(registro.producto == 'Canal Caliente' && registro.mercado == 'Antioquia'){
            this.conteoCalienteAnt ++;
          }
          if(registro.producto == 'Canal Fría' && registro.mercado == 'Antioquia'){
            this.conteoFriaAnt ++;
          }
          if(registro.producto == 'Cerdo en Pie' && registro.mercado == 'Valle del Cauca'){
            this.conteoPieVal ++;
          }
          if(registro.producto == 'Canal Caliente' && registro.mercado == 'Valle del Cauca'){
            this.conteoCalienteVal ++;
          }
          if(registro.producto == 'Canal Fría' && registro.mercado == 'Valle del Cauca'){
            this.conteoFriaVal ++;
          }
          if(registro.producto == 'Cerdo en Pie' && registro.mercado == 'Eje Cafetero'){
            this.conteoPieEje ++;
          }
          if(registro.producto == 'Canal Caliente' && registro.mercado == 'Eje Cafetero'){
            this.conteoCalienteEje ++;
          }
          if(registro.producto == 'Canal Fría' && registro.mercado == 'Eje Cafetero'){
            this.conteoFriaEje ++;
          }
          if(registro.producto == 'Cerdo en Pie' && registro.mercado == 'Caribe Norte'){
            this.conteoPieCos ++;
          }
          if(registro.producto == 'Canal Caliente' && registro.mercado == 'Caribe Norte'){
            this.conteoCalienteCos ++;
          }
          if(registro.producto == 'Canal Fría' && registro.mercado == 'Caribe Norte'){
            this.conteoFriaCos ++;
          }                  
        }        
      }     
      this.barChartData= [
        { data: [this.conteoPieAnt, this.conteoPieBog, this.conteoPieCos, this.conteoPieEje, this.conteoPieVal], label: 'Cerdo en Pie' },
        { data: [this.conteoCalienteAnt, this.conteoCalienteBog, this.conteoCalienteCos, this.conteoCalienteEje, this.conteoCalienteVal], label: 'Canal Caliente' },
        { data: [this.conteoFriaAnt, this.conteoFriaBog, this.conteoFriaCos, this.conteoFriaEje, this.conteoFriaVal], label: 'Canal Fría' }
      ];      
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
    this.general.getRondas().subscribe((resp:any)=>{
      for(let registro of resp["rondas"]){
        if(registro.semana == (this.numeroSemana-1) && registro.year == this.year){
          if(registro.producto == 'Cerdo en Pie' && registro.mercado == 'Bogotá'){
            this.conteoPieBogP ++;
          }
          if(registro.producto == 'Canal Caliente' && registro.mercado == 'Bogotá'){
            this.conteoCalienteBogP ++;
          }
          if(registro.producto == 'Canal Fría' && registro.mercado == 'Bogotá'){
            this.conteoFriaBogP ++;
          }
          if(registro.producto == 'Cerdo en Pie' && registro.mercado == 'Antioquia'){
            this.conteoPieAntP ++;
          }
          if(registro.producto == 'Canal Caliente' && registro.mercado == 'Antioquia'){
            this.conteoCalienteAntP ++;
          }
          if(registro.producto == 'Canal Fría' && registro.mercado == 'Antioquia'){
            this.conteoFriaAntP ++;
          }
          if(registro.producto == 'Cerdo en Pie' && registro.mercado == 'Valle del Cauca'){
            this.conteoPieValP ++;
          }
          if(registro.producto == 'Canal Caliente' && registro.mercado == 'Valle del Cauca'){
            this.conteoCalienteValP ++;
          }
          if(registro.producto == 'Canal Fría' && registro.mercado == 'Valle del Cauca'){
            this.conteoFriaValP ++;
          }
          if(registro.producto == 'Cerdo en Pie' && registro.mercado == 'Eje Cafetero'){
            this.conteoPieEjeP ++;
          }
          if(registro.producto == 'Canal Caliente' && registro.mercado == 'Eje Cafetero'){
            this.conteoCalienteEjeP ++;
          }
          if(registro.producto == 'Canal Fría' && registro.mercado == 'Eje Cafetero'){
            this.conteoFriaEjeP ++;
          }
          if(registro.producto == 'Cerdo en Pie' && registro.mercado == 'Caribe Norte'){
            this.conteoPieCosP ++;
          }
          if(registro.producto == 'Canal Caliente' && registro.mercado == 'Caribe Norte'){
            this.conteoCalienteCosP ++;
          }
          if(registro.producto == 'Canal Fría' && registro.mercado == 'Caribe Norte'){
            this.conteoFriaCosP ++;
          }                
        }
      }
      this.barChartDataP= [
        { data: [this.conteoPieAntP, this.conteoPieBogP, this.conteoPieCosP, this.conteoPieEjeP, this.conteoPieValP], label: 'Cerdo en Pie' },
        { data: [this.conteoCalienteAntP, this.conteoCalienteBogP, this.conteoCalienteCosP, this.conteoCalienteEjeP, this.conteoCalienteValP], label: 'Canal Caliente' },
        { data: [this.conteoFriaAntP, this.conteoFriaBogP, this.conteoFriaCosP, this.conteoFriaEjeP, this.conteoFriaValP], label: 'Canal Fría' }
      ];
    }) 
  }

}
