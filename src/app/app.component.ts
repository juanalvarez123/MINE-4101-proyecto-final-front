import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import { ShapeService } from './shape.service';
import * as chroma from 'chroma-js'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {

  private colors: string[] = chroma.scale(['#00bcd4', '#4CAF50', '#FFEB3B', '#F44336']).mode('lch').colors(20)
  private map!: L.Map;
  private states: any;
  private clusters: any;
  @ViewChild('models') models!: ElementRef;
  selectedModel = 0;

  onSelected(): void {
    this.selectedModel = this.models.nativeElement.value;
    let modelId = Number(this.selectedModel);

    if (Number.isNaN(modelId)) {
      alert('Selecciona un modelo válido')
      return
    }

    this.shapeService.getClusters(modelId).subscribe(clusters => {
      this.clusters = clusters
      let barriosList: any[] = this.clusters.barrios
      this.states.features.forEach((element: any) => {

        let clusterInfo = barriosList.find((barrio: { barrio: string; }) => barrio.barrio.toLowerCase() === element.properties.CODIGO.toLowerCase());
        let clusterId = clusterInfo ? clusterInfo.cluster : -5
        let colorId
        if (modelId == 1) {
          colorId = 0
        } else {
          colorId = (clusterId / (modelId-1)) * 19 
        }

        element.properties.PRINT_COLOR = this.getColor(Math.round(colorId))

      });
      let barrios = this.states
      this.initStatesLayer(barrios);
    })
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [6.2610, -75.5950],
      zoom: 12
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);
  }

  constructor(
    private shapeService: ShapeService,) {
  }

  private initStatesLayer(barrios: any) {
    const stateLayer = L.geoJSON(barrios, {
      style: function (feature) {
        let color: string = feature?.properties.PRINT_COLOR

        return {
          weight: 1,
          opacity: 0.9,
          color: '#000000',
          fillOpacity: 0.9,
          fillColor: color,
        }
      }
    });
    this.map.addLayer(stateLayer);
  }

  ngAfterViewInit(): void {
    this.initMap();
    console.log(this.colors)
    this.shapeService.getStateShapes().subscribe(states => {
      this.states = states;
      this.shapeService.getClusters(1).subscribe(clusters => {
        this.clusters = clusters
        let barriosList: any[] = this.clusters.barrios
        this.states.features.forEach((element: any) => {

          let clusterInfo = barriosList.find((barrio: { barrio: string; }) => barrio.barrio.toLowerCase() === element.properties.CODIGO.toLowerCase());
          let clusterId = clusterInfo ? clusterInfo.cluster : -5
          let colorId = (clusterId / 1) * 19
          element.properties.PRINT_COLOR = this.getColor(Math.round(colorId))
        });
        let barrios = this.states
        this.initStatesLayer(barrios);
      })
    });
  }

  private getColor(colorId: number): String {
    if (colorId > -1) {
      return this.colors[colorId]
    }
    else {
      console.log("Negativo:" + colorId)
      return '#FFFFFF'
    }
  }
}
