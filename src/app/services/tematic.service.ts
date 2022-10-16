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
  private _query = new BehaviorSubject<number>({} as any);

  constructor(private http:HttpClient) {
   }

   addQuery(query:query){
    this.tematicQueries.push(query);
   }

   updateQuery(i:number){
    this._query.next(i);
   }

   editQuery(i:number, q:query){
    this.tematicQueries.splice(i,1,q);
   }

   getQuery(){
    return this._query.asObservable();
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
}
