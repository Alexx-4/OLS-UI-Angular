import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { query, TematicModel } from 'src/app/models/tematicModel';
import { TematicService } from 'src/app/services/tematic.service';
import { __values } from 'tslib';

import global from '../../../../../global.json';

@Component({
  selector: 'app-create-category-tematic',
  templateUrl: './create-category-tematic.component.html',
  styleUrls: ['./create-category-tematic.component.css']
})
export class CreateCategoryTematicComponent implements OnInit, OnDestroy {

  CategoryTematicForm: FormGroup;

  subscription: Subscription = new Subscription();

  layers:string[] = [];
  categories:any[] = [];

  layersColumns: any;

  styles:any;

  qIndex:number = -1;
  tematicIndex:number = 0;

  constructor(private formBuilder: FormBuilder,
              public tematicService: TematicService,
              private toastr: ToastrService,
              private router:Router) {

    this.CategoryTematicForm = formBuilder.group({
      tematicName: [''],

      query: formBuilder.group({

          layerName: ['', [Validators.required]],
          conditions: formBuilder.array([]),
          styleName: ['', [Validators.required]]
    })
    })
   }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {

    this.addCondition(null);

    this.subscription = this.tematicService.getTematicModel().subscribe({
      next: (data)=>{
        if(data.tematicId){
          this.getStyles();
          this.getLayersColumns();

          this.CategoryTematicForm.patchValue({
            tematicName: data.tematicName
          });
          console.log(data.queries);
          this.tematicService.tematicQueries = data.queries;
          this.tematicIndex = data.tematicId;
      }
      else{
        this.defaultQueries();
      }
    }
    })

  }

  get conditions(){
    return this.getAtrr('query')?.get('conditions') as FormArray;
  }
  get columns(){
    if (this.layersColumns){
      let _layer:string = this.getAtrr('query')?.get('layerName')?.value;
      return this.layersColumns[_layer];
    }

    return []
  }

  async defaultQueries(){

    await this.getStyles();
    await this.getLayersColumns();

    var _layer:string = this.layers[0];
    var _column:string = this.layersColumns[_layer][0];
    var _value:any;

    await new Promise<void>((resolve)=>{
      this.tematicService.getCategories(_column, _layer).subscribe({
        next: (data) =>{
          _value = data;
          resolve();
        }
      })
    })

    this.tematicService.tematicQueries = []
    for(let i = 0; i < this.styles.length &&
                   i < _value.length      &&
                   i < 10;                i++){
          let query:query = {

            styleName: this.styles[i].name,
            layerName: _layer,

            conditions: [{

              columnName: _column,
              _operator: 'Equal',
              value: _value[i],
              logicOperator:null

            }]
          }
          this.tematicService.addQuery(query);


    }
  }

  getStyles(){
    this.tematicService.getStyles().subscribe({
      next: (data)=> {
        this.styles = data;
      }
  })
    return [];
  }

  getAtrr(attr:string){
    return this.CategoryTematicForm.get(attr);
  }

  addCondition(logicOp:string | null){
    if(this.getAtrr('query')?.get('layerName')?.value != '' || logicOp == null){
      if (logicOp !== null){
        this.getAtrr('query')?.get('layerName')?.disable();
      }
      const condition = this.formBuilder.group({
        columnName: ['', [Validators.required]],
          _operator:['Equal'],
          value:['', [Validators.required]],
          logicOperator:[logicOp]
      });
      this.conditions.push(condition);
      this.categories.push([]);
}
else{
  this.toastr.error('Please select Layer');
}
  }

  getLayersColumns(){
    return new Promise<void>(resolve => {
          this.tematicService.getLayersColumns().subscribe({
            next: (data)=>{
              this.layersColumns = data;

              for(let item in this.layersColumns){
                this.layers.push(item)
              }
              resolve();
            }
          })
    })

  }

  removeCondition(i:number){
    var _conditions = this.conditions;
    if(_conditions.length > 1){
      _conditions.removeAt(i);
      this.categories.splice(i,1);
      if(_conditions.length == 1){
        this.getAtrr('query')?.get('layerName')?.enable();
      }
      _conditions.at(0).get('logicOperator')?.reset();
    }
    else{
      this.toastr.error('Query must have at least one condition')
    }
  }

  addQuery(){
    var query:query = {
      layerName: this.getAtrr('query')?.get('layerName')?.value,
      styleName: this.getAtrr('query')?.get('styleName')?.value,
      conditions: this.getAtrr('query')?.get('conditions')?.value
    }
    if(this.qIndex === -1){
      this.tematicService.addQuery(query);
    }
    else{
      this.tematicService.editQuery(this.qIndex, query);
    }

    var formConditions: FormArray = this.conditions;
    while(formConditions.length > 0){
      formConditions.removeAt(0);
    }

    this.getAtrr('query')?.reset();
    this.addCondition(null);
    this.categories = [];
    this.getAtrr('query')?.get('layerName')?.enable();

    this.qIndex = -1;
  }

  setCategories(i:number){
    var _group = this.conditions.controls[i];
    var column:string = _group?.get('columnName')?.value;
    this.categories[i] = [];

    this.tematicService.getCategories(column, this.getAtrr('query')?.get('layerName')?.value).subscribe({
      next: (data)=>{
        this.categories[i] = data;
      },
      error: (err) => {
        console.log('Ocurrio un error')
        console.log(err);
      }

    })
  }

  editQuery(i:number){
    var q:query = this.tematicService.tematicQueries[i];

        if(q){

          var formConditions: FormArray = this.conditions;
          while(formConditions.length > 1){
            formConditions.removeAt(0);
          }

          for(let i= 1; i < q.conditions.length; i++){
            this.addCondition('');
          }

          this.getAtrr('query')?.patchValue({
            layerName: q.layerName,
            styleName: q.styleName,
            conditions: q.conditions,
          });

          for(let i= 0; i < q.conditions.length; i++){
            this.setCategories(i);
          }
          this.qIndex = i;
      }
  }

  deleteQuery(i:number){
    this.tematicService.removeQuery(i);
  }

  saveTematic(){
    var create:boolean = this.tematicIndex === 0;

    const _tematic: TematicModel = {
      tematicId:(create) ? undefined: this.tematicIndex,
      tematicName: this.getAtrr('tematicName')?.value,

      queries: this.tematicService.tematicQueries
    }
    if(create){
    this.tematicService.createCategoryTematic(_tematic).subscribe({
      next: (data) => {
        this.router.navigate([global['routeCategoryTematic']]);
        this.toastr.success('Category tematic created','Sucess');
      }
    })
  }
    else{
      this.tematicService.editCategoryTematic(_tematic).subscribe({
        next: ()=>{
          this.tematicIndex = 0;
          this.router.navigate([global['routeCategoryTematic']]);
          this.toastr.success('Category tematic edited','Succes');
        }
      })
    }
  }

}
