import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import global from '../../../global.json';
import { ProviderModel } from '../models/ProviderModel';

@Injectable({
  providedIn: 'root'
})
export class ProviderService {

  url:string = global['serverURL'] + 'Provider/';
  private _providerModel = new BehaviorSubject<ProviderModel>({} as any);

  constructor(private http: HttpClient) { }

  updateProviderModel(_provider:ProviderModel){
    this._providerModel.next(_provider);
   }

   getProviderModel(){
    return this._providerModel.asObservable();
   }

  getProviders(){
    return this.http.get(this.url);
  }

  createProvider(provider:ProviderModel){
    return this.http.post(this.url + 'create', {Item1: provider.name, Item2:provider.description, Item3: provider});
  }

  deleteProvider(id:number){
    return this.http.delete(this.url + id);
   }

  editProvider(provider: ProviderModel){
    return this.http.put(this.url + 'edit', {Item1: provider.name, Item2:provider.description, Item3: provider});
  }

  getProvider(id:number){
    return this.http.get(this.url + id);
  }
}
