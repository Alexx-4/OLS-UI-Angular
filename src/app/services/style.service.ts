import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';

import global from '../../../global.json';
import { StyleModel } from '../models/StyleModel';

@Injectable({
  providedIn: 'root'
})
export class StyleService {

  url:string = global['serverURL'] + 'Style/';
  private _styleModel = new BehaviorSubject<StyleModel>({} as any);

  constructor(private http:HttpClient,
              private sanitizer: DomSanitizer) { }


  getStyles(){
    return this.http.get(this.url);
   }

   updateStyleModel(_style:StyleModel){
    this._styleModel.next(_style);
   }

   getStyleModel(){
    return this._styleModel.asObservable();
   }

   createStyle(style:StyleModel){
    return this.http.post(this.url + 'create', style);
  }

  deleteStyle(id:number){
    return this.http.delete(this.url + id);
   }

  editStyle(style: StyleModel){
    return this.http.put(this.url + 'edit', style);
  }

  getStyle(id:number){
    return this.http.get(this.url + id);
  }

  getImage(style: any){
    return this.http.post(this.url + 'getImage', style);
  }

  rgbToHex(str:string) {
    var list = str.split(',');

    var r:number = parseInt(list[0]);
    var g:number = parseInt(list[1]);
    var b:number = parseInt(list[2]);

    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  getImgUrl(data:any){
    let objectURL = 'data:image/png;base64,' + data;
    return this.sanitizer.bypassSecurityTrustUrl(objectURL);
  }

}
