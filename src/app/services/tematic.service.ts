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

   createTematic(tematic: TematicModel){
    return this.http.post<TematicModel>(this.url + 'QueryTematic', tematic);
   }

   createCategoryTematic(tematic: TematicModel){
    return this.http.post<TematicModel>(this.url + 'CategoryTematic', tematic);
   }

   editCategoryTematic(tematic: TematicModel){
    return this.http.put<TematicModel>(this.url + 'editCategory', tematic);
   }

   getLayersColumns(){
    return this.http.get(this.url + 'layersColumns');
   }

   getOperator(column:string, layer:string){
    return this.http.post(this.url + 'operator', {Item1:column,Item2:layer});
   }

   getCategories(column:string, layer:string){
    return this.http.post(this.url + 'categories', {Item1:column,Item2:layer});
   }

   getStyles(){
    return this.http.get(this.url + 'styles');
   }

   getCategoryTematics(){
    return this.http.get(this.url + 'getCategoryTematics');
   }

   deleteTematic(id:number){
    return this.http.delete(this.url + id);
   }
}
