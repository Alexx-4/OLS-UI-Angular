import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { query, TematicModel } from 'src/app/models/tematicModel';
import { TematicService } from 'src/app/services/tematic.service';

declare var $:any;

@Component({
  selector: 'app-create-tematic',
  templateUrl: './create-tematic.component.html',
  styleUrls: ['./create-tematic.component.css']
})
export class CreateTematicComponent implements OnInit, OnDestroy {

  subscription:Subscription = new Subscription();

  TematicForm : FormGroup;

  layers:string[] = [];
  operators:any[] = [];
  styles: any;

  layersColumns: any;

  qIndex:number = -1;

  constructor(private formBuilder: FormBuilder,
              public tematicService: TematicService,
              private toastr: ToastrService){

    this.TematicForm = formBuilder.group({

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

    this.subscription = this.tematicService.getQuery().subscribe(data => {

      var q:query = this.tematicService.tematicQueries[data];

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
            this.setOperators(i);
          }
          this.qIndex = data;
      }
    });
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

  getStyles(){
    this.tematicService.getStyles().subscribe({
      next: (data)=> {
        console.log(data);
        this.styles = data;
      }
  })
    return [];
  }

  addCondition(logicOp:string | null){
    if(this.getAtrr('query')?.get('layerName')?.value != '' || logicOp == null){
        if (logicOp !== null){
          this.getAtrr('query')?.get('layerName')?.disable();
        }
        const condition = this.formBuilder.group({
          columnName: ['', [Validators.required]],
            _operator:['', [Validators.required]],
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
    while(formConditions.length > 1){
      formConditions.removeAt(0);
    }

    this.getAtrr('query')?.reset();
    this.operators = [];
    this.getAtrr('query')?.get('layerName')?.enable();

    this.qIndex = -1;
  }

  getAtrr(attr:string){
    return this.TematicForm.get(attr);
  }

  saveTematic(){
    const _tematic: TematicModel = {
      tematicName: this.getAtrr('tematicName')?.value,

      queries: this.tematicService.tematicQueries
    }

    this.tematicService.createTematic(_tematic).subscribe({
      next: (data) => {
        console.log(data);
        console.log('Enviado exitosamente');
      }
    })
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

  setOperators(i:number){
    var _group = this.conditions.controls[i];
    var column:string = _group?.get('columnName')?.value;
    this.operators[i] = [];

    this.tematicService.getOperator(column, this.getAtrr('query')?.get('layerName')?.value).subscribe({
      next: (data)=>{
        this.operators[i] = data;
      },
      error: (err) => {
        console.log('Ocurrio un error')
        console.log(err);
      }

    })
  }


}
