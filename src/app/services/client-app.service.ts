import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import global from '../../../global.json'
import { ClientAppModel } from '../models/ClientAppModel';

@Injectable({
  providedIn: 'root'
})
export class ClientAppService {
  url:string = global['serverURL'] + 'ClientApp/';

  private _clientAppModel = new BehaviorSubject<ClientAppModel>({} as any);

  constructor(private http: HttpClient) {
  }

  updateClientAppModel(_clientApp:ClientAppModel){
    this._clientAppModel.next(_clientApp);
   }

   getClientAppModel(){
    return this._clientAppModel.asObservable();
   }

  getClientApps(userId: string | undefined){
    return this.http.post(this.url + 'userClientApps', {Id: userId});
  }

  deleteClientApp(id:string){
    return this.http.delete(this.url + id);
  }

  createClientApp(model:any){
    return this.http.post(this.url + 'create', model);
  }

  editClientApp(model:any){
    return this.http.post(this.url + 'edit', model);
  }
}
