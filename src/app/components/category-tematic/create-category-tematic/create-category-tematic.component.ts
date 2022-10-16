import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { query, TematicModel } from 'src/app/models/tematicModel';
import { TematicService } from 'src/app/services/tematic.service';

@Component({
  selector: 'app-create-category-tematic',
  templateUrl: './create-category-tematic.component.html',
  styleUrls: ['./create-category-tematic.component.css']
})
export class CreateCategoryTematicComponent implements OnInit {

  CategoryTematicForm: FormGroup;

  layers:string[] = [];
  categories:any[] = [];

  layersColumns: any;

  styles:any;
  qIndex:number = -1;

  constructor(private formBuilder: FormBuilder,
              public tematicService: TematicService,
              private toastr: ToastrService) {

    this.CategoryTematicForm = formBuilder.group({
      tematicName: [''],

      query: formBuilder.group({

          layerName: ['', [Validators.required]],
          conditions: formBuilder.array([]),
          styleName: ['', [Validators.required]]
    })
    })
   }

  ngOnInit(): void {
    this.addCondition(null);

    this.getLayersColumns();
    this.getStyles();
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
    const _tematic: TematicModel = {
      tematicName: this.getAtrr('tematicName')?.value,

      queries: this.tematicService.tematicQueries
    }

    this.tematicService.createCategoryTematic(_tematic).subscribe({
      next: (data) => {
        console.log(data);
        console.log('Enviado exitosamente');
      }
    })
  }

}
