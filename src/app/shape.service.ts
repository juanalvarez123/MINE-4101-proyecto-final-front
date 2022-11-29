import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ShapeService {
  constructor(private http: HttpClient) { }

  getStateShapes() {
    return this.http.get('/assets/data/medellin.json');
  }

  getClusters(clusterId: Number) {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
    
    const requestOptions = {                                                                                                                                                                                 
      headers: headers, 
    };
    return this.http.post(`https://mine-4101-proyecto-final-api.herokuapp.com/predict?clusters_quantity=${clusterId}`, '', requestOptions)
  }
}