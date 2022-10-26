import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { query, TematicModel } from 'src/app/models/tematicModel';
import { TematicService } from 'src/app/services/tematic.service';

import global from '../../../../../../../global.json';

@Component({
  selector: 'app-create-query-tematic',
  templateUrl: './create-query-tematic.component.html',
  styleUrls: ['./create-query-tematic.component.css']
})
export class CreateQueryTematicComponent implements OnInit, OnDestroy {

  QueryTematicForm : FormGroup;

  subscription:Subscription = new Subscription();

  layers:string[] = [];
  operators:any[] = [];

  layersColumns: any;

  styles: any;

  qIndex:number = -1;
  tematicIndex = 0;

  constructor(private formBuilder: FormBuilder,
              public tematicService: TematicService,
              private toastr: ToastrService,
              private router:Router){

    this.QueryTematicForm = formBuilder.group({

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

    this.getLayersColumns();
    this.getStyles();

    this.subscription = this.tematicService.getTematicModel().subscribe({
      next: (data)=>{
        if(data.tematicId){

          this.QueryTematicForm.patchValue({
            tematicName: data.tematicName
          });

          console.log(data.queries);
          this.tematicService.tematicQueries = data.queries;
          this.tematicIndex = data.tematicId;
      }
      else{
        this.tematicService.tematicQueries = []
      }
    }});
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

  isNumber(i:number){
    try {
      return this.operators[i].indexOf("<") !== -1;
    }
    catch (error) {
      return false;
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
    return this.QueryTematicForm.get(attr);
  }

  addCondition(logicOp:string | null){
    var layerName = this.getAtrr('query')?.get('layerName')?.value;
    if((layerName != '' && layerName != null)|| logicOp == null){
      if (logicOp !== null){
        this.getAtrr('query')?.get('layerName')?.disable();
      }
      const condition = this.formBuilder.group({
        columnName: ['', [Validators.required]],
          _operator:[''],
          value:['', [Validators.required]],
          logicOperator:[logicOp]
      });
      this.conditions.push(condition);
      this.operators.push([]);
    }
    else{
      this.toastr.error('Please select Layer');
    }
  }

  getLayersColumns(){
    this.tematicService.getLayersColumns().subscribe({
      next: (data)=>{
        this.layersColumns = data;

        for(let item in this.layersColumns){
          this.layers.push(item)
        }
      }
    })
  }

  removeCondition(i:number){
    var _conditions = this.conditions;
    if(_conditions.length > 1){
      _conditions.removeAt(i);
      this.operators.splice(i,1);
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
    this.operators = [];
    this.getAtrr('query')?.get('layerName')?.enable();

    this.qIndex = -1;
  }

  setOperators(i:number){
    var _group = this.conditions.controls[i];
    var column:string = _group?.get('columnName')?.value;
    var oldOperators = this.operators[i];
    this.operators[i] = [];
    this.conditions.at(i).patchValue({_operator:''});

    if(column !== 'default'){
        this.tematicService.getOperator(column, this.getAtrr('query')?.get('layerName')?.value).subscribe({
          next: (data)=>{
            this.operators[i] = data;

            if(oldOperators.length !== this.operators[i].length){
              this.conditions.controls[i].patchValue({value:''});
            }
          },
          error: (err) => {
            console.log('Ocurrio un error')
            console.log(err);
          }

        })
      }
      else{
        this.toastr.warning('Please select column');
      }
  }

  editQuery(i:number){
    var q:query = this.tematicService.tematicQueries[i];

    if(q){

        var formConditions: FormArray = this.conditions;
        while(formConditions.length > 1){
          formConditions.removeAt(0);
        }

        this.getAtrr('query')?.patchValue({
          layerName: q.layerName,
          styleName: q.styleName
        });

        for(let i= 1; i < q.conditions.length; i++){
          this.addCondition('');
        }

        this.getAtrr('query')?.patchValue({
          conditions: q.conditions,
        });

        for(let i= 0; i < q.conditions.length; i++){
          this.setOperators(i);
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
      this.tematicService.createQueryTematic(_tematic).subscribe({
        next: () => {
          this.goQueryTematicsView();
          this.toastr.success('Query tematic created','Sucess');
        }
      })
    }
      else{
        this.tematicService.editQueryTematic(_tematic).subscribe({
          next: ()=>{
            this.tematicIndex = 0;
            this.goQueryTematicsView();
            this.toastr.success('Query tematic edited','Succes');
          }
        })
      }
  }

  goQueryTematicsView(){
    this.router.navigate([global['routeQueryTematic']]);
  }



}
