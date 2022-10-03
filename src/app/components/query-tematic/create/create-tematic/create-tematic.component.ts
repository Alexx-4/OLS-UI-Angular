import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray} from '@angular/forms';
import { query, TematicModel } from 'src/app/models/tematicModel';
import { TematicService } from 'src/app/services/tematic.service';

declare var $:any;

@Component({
  selector: 'app-create-tematic',
  templateUrl: './create-tematic.component.html',
  styleUrls: ['./create-tematic.component.css']
})
export class CreateTematicComponent implements OnInit {

  TematicForm : FormGroup;

  tematicQuerys : query [] = [];
  layers:string[] = [];

  layersColumns: any;

  constructor(private formBuilder: FormBuilder,
              private tematicService: TematicService){

    this.TematicForm = formBuilder.group({

      tematicName: ['', [Validators.required]],
      layerName: ['', [Validators.required]],

      query: formBuilder.group({

      conditions: formBuilder.array([]),
      styleName: ['', [Validators.required]]

    })

    })


  }

  ngOnInit(): void {
    this.addCondition(null);
    this.getLayersColumns();
  }

  get conditions(){
    return this.getAtrr('query')?.get('conditions') as FormArray;
  }

  get columns(){
    if (this.layersColumns){
      let _layer:string = this.getAtrr('layerName')?.value;
      return this.layersColumns[_layer];
    }

    return []
  }

  addCondition(logicOp:string | null){
    const condition = this.formBuilder.group({
      columnName: ['', [Validators.required]],
        _operator:['', [Validators.required]],
        value:['', [Validators.required]],
        logicOperator:[logicOp]
    })
    this.conditions.push(condition);
  }

  addQuery(){
    this.getAtrr('tematicName')?.disable();
    this.getAtrr('layerName')?.disable();

    var query:query = {
      styleName: this.getAtrr('query')?.get('styleName')?.value,
      conditions: this.getAtrr('query')?.get('conditions')?.value
    }

    this.tematicQuerys.push(query);

    var formConditions: FormArray = this.conditions;
    while(formConditions.length > 1){
      formConditions.removeAt(0);
    }

    this.getAtrr('query')?.reset();
  }

  getAtrr(attr:string){
    return this.TematicForm.get(attr);
  }

  saveTematic(){
    const _tematic: TematicModel = {
      tematicName: this.getAtrr('tematicName')?.value,
      layerName: this.getAtrr('layerName')?.value,

      queries: this.tematicQuerys
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
}
