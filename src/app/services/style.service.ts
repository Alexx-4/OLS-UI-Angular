import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


import global from '../../../global.json';

@Injectable({
  providedIn: 'root'
})
export class StyleService {

  url:string = global['serverURL'] + 'Style/';

  constructor(private http:HttpClient) { }


  getStyles(){
    return this.http.get(this.url);
   }
}
