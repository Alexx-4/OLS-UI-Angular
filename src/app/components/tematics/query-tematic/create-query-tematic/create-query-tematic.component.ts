import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { query, TematicModel } from 'src/app/models/tematicModel';
import { LayerService } from 'src/app/services/layer.service';
import { StyleService } from 'src/app/services/style.service';
import { TematicService } from 'src/app/services/tematic.service';

import global from '../../../../../../global.json';

@Component({
  selector: 'app-create-query-tematic',
  templateUrl: './create-query-tematic.component.html',
  styleUrls: ['./create-query-tematic.component.css']
})
export class CreateQueryTematicComponent implements OnInit {

  QueryTematicForm: FormGroup;

  tables:string[] = [];
  layers:any[] = [];
  operators:any[] = [];

  tablesColumns: any;

  styles: any;

  qIndex:number = -1;
  tematicIndex = 0;

  constructor(private formBuilder: FormBuilder,
              public tematicService: TematicService,
              private toastr: ToastrService,
              private router:Router,
              private layerService: LayerService,
              private styleService: StyleService) {

    this.QueryTematicForm = formBuilder.group({
        tematicName: ['', Validators.required],

        query: formBuilder.group({

          layerName: ['', Validators.required],
          tableName:['', Validators.required],
          styleName: ['', Validators.required],

          conditions: this.formBuilder.array([

            formBuilder.group({
              columnName: ['', [Validators.required]],
              _operator:['',[Validators.required]],
              value:['', [Validators.required]],
              logicOperator:[null]

          })])
      })
    });
  }

  ngOnInit(): void {
    this.getLayers();
    this.getStyles();

    this.tematicService.getTematicModel().subscribe(
      data=>{
        if(data.tematicName){

          this.QueryTematicForm.patchValue({
            tematicName: data.tematicName
          });

          this.tematicService.tematicQueries = data.queries;
          this.tematicIndex = data.tematicId as number;
        }
        else { this.tematicService.tematicQueries = []; }
      }
    );
  }

  getAtrr(control:string){
    return this.QueryTematicForm.get(control);
  }

  getAttrQuery(attr:string){
    return this.QueryTematicForm.get('query')?.get(attr);
  }

  get conditions(){
    return this.getAtrr('query')?.get('conditions') as FormArray;
  }

  get columns(){
    if (this.tablesColumns){
      let _table:string = this.getAttrQuery('tableName')?.value;
      return this.tablesColumns[_table];
    }
    return [];
  }

  getLayers(){
    this.layerService.getLayers().subscribe({
      next:(data)=>{
        this.layers = [];
        for(let item of data as Array<any>){
          var _layer = {
            id: item.id,
            name: item.layerTranslations[0].name
          }
          this.layers.push(_layer);
        }
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }

  getStyles(){
    this.styleService.getStyles().subscribe(
      (data)=>{
        this.styles = data;
      }
    )
  }

  getTables(){
    var _layerName = this.getAttrQuery('layerName')?.value;
    var _style = this.getAttrQuery('styleName')?.value;
    this.QueryTematicForm.get('query')?.reset();
    this.QueryTematicForm.get('query')?.patchValue({layerName: _layerName, styleName: _style});

    var _layer = this.layers.find(l=>l.name === _layerName);

    this.tematicService.getTablesColumns(_layer.id).subscribe({
      next:(data)=>{
        this.tablesColumns = data;

        this.tables = [];
        for(let item in this.tablesColumns){
          this.tables.push(item)
        }
      },
      error:(err)=>{console.log(err);}
    })
  }

  clearCondition(){
    var _layerName = this.getAttrQuery('layerName')?.value;
    var _style = this.getAttrQuery('styleName')?.value;
    var _table = this.getAttrQuery('tableName')?.value;

    this.QueryTematicForm.get('query')?.reset();
    this.QueryTematicForm.get('query')?.patchValue({layerName: _layerName,
                                                    styleName: _style,
                                                    tableName: _table});
  }

  setOperators(i:number, edit:boolean = false){
    var _column = this.conditions.at(i).get('columnName')?.value;
    if(!edit)
        this.conditions.at(i).patchValue({_operator: '', value: ''});

    if(_column === 'default'){
      this.toastr.info('Please select a column');
      return
    }

    var _table = this.getAttrQuery('tableName')?.value;
    this.operators[i]=[];

    this.tematicService.getOperator(_column, _table).subscribe({
      next: (data)=>{
        this.operators[i] = data;
      },
      error: (err)=>{console.log(err);}
    })
  }

  addCondition(logicOperator: string = ""){
    var _layerControl = this.getAttrQuery('layerName');
    var _tableControl = this.getAttrQuery('tableName');

    if(_layerControl?.invalid || _tableControl?.invalid){
      this.toastr.info('Please select Layer and corresponding Table');
      return
    }

    var _newCondition = this.formBuilder.group({
            columnName: ['', [Validators.required]],
            _operator:['',[Validators.required]],
            value:['', [Validators.required]],
            logicOperator:[logicOperator]
    });

    this.conditions.push(_newCondition);
    this.operators.push([]);

    _layerControl?.disable();
    _tableControl?.disable();
  }

  typeNumber(index:number){
    try { return this.operators[index].indexOf('<') !== -1; }
    catch (error) { return false; }
  }

  removeCondition(i:number){
    if(this.conditions.length > 1){

      this.conditions.removeAt(i);
      this.operators.splice(i,1);

      if(this.conditions.length === 1){

        this.getAttrQuery('layerName')?.enable();
        this.getAttrQuery('tableName')?.enable();
    }

    this.conditions.at(0).get('logicOperator')?.reset();
  }

    else{
      this.toastr.info('Query must have at least one condition');
    }
  }

  addQuery(){
    var _query:query ={
      layerName: this.getAttrQuery('layerName')?.value,
      tableName: this.getAttrQuery('tableName')?.value,
      styleName: this.getAttrQuery('styleName')?.value,
      conditions: this.getAttrQuery('conditions')?.value
    }

    if(this.qIndex === -1){
      this.tematicService.addQuery(_query);
    }
    else{
      this.tematicService.editQuery(this.qIndex, _query);
    }

    while(this.conditions.length > 1)
      this.removeCondition(this.conditions.length - 1);

    this.conditions.at(0).reset();
    this.operators = [];
    this.qIndex = -1;
  }

  deleteQuery(index:number){
    this.tematicService.removeQuery(index);
  }

  editQuery(index:number){
    var _query:query = this.tematicService.tematicQueries[index];

    this.getAtrr('query')?.patchValue({layerName: _query.layerName});
    this.getTables();

    while(this.conditions.length > 0)
      this.conditions.removeAt(0);

    this.getAtrr('query')?.patchValue({
      tableName: _query.tableName,
      styleName: _query.styleName
    });

    for(let i = 0; i < _query.conditions.length; i++)
      this.addCondition('');

    this.getAtrr('query')?.patchValue({conditions: _query.conditions});

    for(let i = 0; i < _query.conditions.length; i++)
      this.setOperators(i, true);

    this.qIndex = index;
  }

  goQueryTematicsView(){
    this.router.navigate([global['routeQueryTematic']]);
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
          this.toastr.info('Query tematic successfully created');
        }
      });
    }
      else{
        this.tematicService.editQueryTematic(_tematic).subscribe({
          next: ()=>{
            this.tematicIndex = 0;
            this.goQueryTematicsView();
            this.toastr.info('Query tematic successfully edited');
          }
        })
      }
  }
}
