import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import global from '../../../global.json'
import { TematicModel } from '../models/tematicModel';

@Injectable({
  providedIn: 'root'
})
export class TematicService {

  url:string = global['serverURL'] + 'Tematic/';

  constructor(private http:HttpClient) {
   }

   createTematic(tematic: TematicModel){
    return this.http.post<TematicModel>(this.url + 'QueryTematic', tematic);
   }

   getLayersColumns(){
    return this.http.get(this.url + 'layersColumns');
   }

   getOperator(layer : string, column:string){
    return this.http.post(this.url + 'operator', [layer, column]);
   }
}
