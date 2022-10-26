import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


import global from '../../../global.json';
import { LayerModel } from '../models/LayerModel';

@Injectable({
  providedIn: 'root'
})
export class LayerService {

  url:string = global['serverURL'] + 'Layer/';
  private _layerModel = new BehaviorSubject<LayerModel>({} as any);

  constructor(private http: HttpClient) { }

  updateLayerModel(_layer:LayerModel){
    this._layerModel.next(_layer);
   }

   getLayerModel(){
    return this._layerModel.asObservable();
   }

  getLayers(){
    return this.http.get(this.url);
  }

  createLayer(layer:LayerModel){
    return this.http.post(this.url + 'create', {Item1: layer.name, Item2:layer.description, Item3: layer});
  }

  deleteLayer(id:number){
    return this.http.delete(this.url + id);
   }

  editLayer(layer: LayerModel){
    return this.http.put(this.url + 'edit', {Item1: layer.name, Item2:layer.description, Item3: layer});
  }
}
