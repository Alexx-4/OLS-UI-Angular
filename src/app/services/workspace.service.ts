import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import global from '../../../global.json'
import { WorkspaceModel } from '../models/WorkspaceModel';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {

  url:string = global['serverURL'] + 'Workspace/';

  private _workspaceModel = new BehaviorSubject<WorkspaceModel>({} as any);

  constructor(private http: HttpClient) {
  }

  updateWorkspaceModel(_workspace:WorkspaceModel){
    this._workspaceModel.next(_workspace);
   }

   getWorkspaceModel(){
    return this._workspaceModel.asObservable();
   }

  getWorkspaces(userId: string | undefined){
    return this.http.post(this.url + 'userWorkspaces', {Id: userId});
  }

  deleteWorkspace(id:number){
    return this.http.delete(this.url + id);
  }
}
