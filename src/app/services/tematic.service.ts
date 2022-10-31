import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import global from '../../../global.json'
import { query, TematicModel } from '../models/tematicModel';

@Injectable({
  providedIn: 'root'
})
export class TematicService {

  url:string = global['serverURL'] + 'Tematic/';

  tematicQueries: query [] = [];
  private _tematicModel = new BehaviorSubject<TematicModel>({} as any);

  constructor(private http:HttpClient) {
   }

   addQuery(query:query){
    this.tematicQueries.push(query);
   }

   updateTematicModel(_tematic:TematicModel){
    this._tematicModel.next(_tematic);
   }

   getTematicModel(){
    return this._tematicModel.asObservable();
   }

   editQuery(i:number, q:query){
    this.tematicQueries.splice(i,1,q);
   }

   removeQuery(i:number){
    this.tematicQueries.splice(i,1);
   }

   createQueryTematic(tematic: TematicModel){
    return this.http.post<TematicModel>(this.url + 'QueryTematic', tematic);
   }

   createCategoryTematic(tematic: TematicModel){
    return this.http.post<TematicModel>(this.url + 'CategoryTematic', tematic);
   }

   editCategoryTematic(tematic: TematicModel){
    return this.http.put<TematicModel>(this.url + 'editCategory', tematic);
   }

   editQueryTematic(tematic: TematicModel){
    return this.http.put<TematicModel>(this.url + 'editQuery', tematic);
   }

   getTablesColumns(layerId: number){
    return this.http.post(this.url + 'tablesColumns', {id: layerId});
   }

   getOperator(column:string, table:string, layerId:number){
    return this.http.post(this.url + 'operator', {Item1:column,Item2:table,Item3:layerId});
   }

   getCategories(column:string, table:string, layerId:number){
    return this.http.post(this.url + 'categories', {Item1:column,Item2:table,Item3:layerId});
   }

   getStyles(){
    return this.http.get(global['serverURL'] + 'Style');
   }

   getCategoryTematics(){
    return this.http.get(this.url + 'getCategoryTematics');
   }

   getQueryTematics(){
    return this.http.get(this.url + 'getQueryTematics')
   }

   deleteTematic(id:number){
    return this.http.delete(this.url + id);
   }
}
