import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import global from '../../../global.json';

@Injectable({
  providedIn: 'root'
})
export class ProviderService {

  url:string = global['serverURL'] + 'Provider/';

  constructor(private http: HttpClient) { }

  getProviders(){
    return this.http.get(this.url);
  }

}
