import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import global from '../../../global.json';
import { AlphaInfoModel } from '../models/AlphaInfoModel';

@Injectable({
  providedIn: 'root'
})
export class AlphaInfoService {

  url:string = global['serverURL'] + 'AlphaInfo/';
  private _alphaInfoModel = new BehaviorSubject<AlphaInfoModel>({} as any);

  constructor(private http: HttpClient) { }

  updateAlphaInfoModel(_alphaInfo:AlphaInfoModel){
    this._alphaInfoModel.next(_alphaInfo);
   }

   getAlphaInfoModel(){
    return this._alphaInfoModel.asObservable();
   }

  getAlphaInfos(){
    return this.http.get(this.url);
  }

  createAlphaInfo(alphaInfo:AlphaInfoModel){
    return this.http.post(this.url + 'create', {Item1: alphaInfo.name, Item2:alphaInfo.description, Item3: alphaInfo});
  }

  deleteAlphaInfo(id:number){
    return this.http.delete(this.url + id);
   }

  editAlphaInfo(alphaInfo: AlphaInfoModel){
    return this.http.put(this.url + 'edit', {Item1: alphaInfo.name, Item2:alphaInfo.description, Item3: alphaInfo});
  }

  getAlphaInfo(id:number){
    return this.http.get(this.url + id);
  }
}
