import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LayerService } from 'src/app/services/layer.service';
import { StyleService } from 'src/app/services/style.service';
import { TematicService } from 'src/app/services/tematic.service';
import { query, TematicModel } from 'src/app/models/tematicModel';

import global from '../../../../../../global.json';

@Component({
  selector: 'app-create-category-tematic',
  templateUrl: './create-category-tematic.component.html',
  styleUrls: ['./create-category-tematic.component.css']
})
export class CreateCategoryTematicComponent implements OnInit {

  CategoryTematicForm: FormGroup;

  layers:any[] = [];
  styles:any;
  _styleImg:any;
  tables:string[] = [];

  tablesColumns: any;

  ok:boolean = false;
  tematicIndex: number | undefined = 0;

  constructor(formBuilder: FormBuilder,
              private layerService: LayerService,
              private router: Router,
              private toastr:ToastrService,
              public tematicService: TematicService,
              private styleService: StyleService) {

    this.CategoryTematicForm = formBuilder.group({
        tematicName: ['', Validators.required],
        layerName: ['', Validators.required],

        table: ['', Validators.required],
        column: ['', Validators.required]
    })
    }

  ngOnInit(): void {
    this.getLayers();
    this.getStyles();

    this.tematicService.tematicQueries = [];

    this.tematicService.getTematicModel().subscribe(
      data=>{
        if(data.tematicName){
          this.ok=true;
          this.tematicIndex = data.tematicId ? data.tematicId : 0;

          this.CategoryTematicForm.patchValue({
            tematicName: data.tematicName
          });

          this.tematicService.tematicQueries = data.queries;
        }
      }
    )
  }

  get columns(){
    if (this.tablesColumns){
      let _table:string = this.getAtrr('table')?.value;
      return this.tablesColumns[_table];
    }
    return [];
  }

  getStyles(){
    this.styleService.getStyles().subscribe(
      data=>{ this.styles = data; }
    )
  }

  getLayers(){
    this.layerService.getLayers().subscribe(
      data => {
        for(let item of data as Array<any>){
          var _layer = {
            name: item.layerTranslations[0].name,
            id: item.id
          }

        this.layers.push(_layer);
        }
      }
    )
  }

  getTables(){
    var _layerName = this.getAtrr('layerName')?.value;
    this.getAtrr('table')?.markAsUntouched();
    this.getAtrr('column')?.markAsUntouched();
    this.CategoryTematicForm.patchValue({table:'', column:''});

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

  goCategoriesList(){
    this.router.navigate([global['routeCategoryTematic']]);
  }

  getAtrr(atrr:string){
    return this.CategoryTematicForm.get(atrr);
  }

  saveCategory(){
    var create:boolean = this.tematicIndex === 0;

    const _tematic: TematicModel = {
      tematicId:(create) ? undefined: this.tematicIndex,
      tematicName: this.getAtrr('tematicName')?.value,

      queries: this.tematicService.tematicQueries
    }

    if(create){
      this.tematicService.createCategoryTematic(_tematic).subscribe({
        next: () => {
          this.goCategoriesList();
          this.toastr.info('Category tematic successfully created');
        }
      });
    }
      else{
        this.tematicService.editCategoryTematic(_tematic).subscribe({
          next: ()=>{
            this.tematicIndex = 0;
            this.goCategoriesList();
            this.toastr.info('Category tematic successfully edited');
          }
        })
      }
  }

  okFunction(){
    this.ok = true;
    this.tematicService.tematicQueries = [];

    var _column = this.getAtrr('column')?.value;
    var _table = this.getAtrr('table')?.value;
    var _layerName = this.getAtrr('layerName')?.value;

    var _layer = this.layers.find(l=>l.name === _layerName);

    this.tematicService.getCategories(_column, _table, _layer.id).subscribe(
      data=>{
        var _categories = data as Array<string>;
        for(let i = 0;  i < _categories.length &&
                        i < 3;                   i++){

              let _query: query = {

              styleName: (i < this.styles.length) ? this.styles[i].name : '',
              layerName: _layer.name,
              tableName: _table,

              conditions: [{

                columnName: _column,
                _operator: 'Equal',
                value: _categories[i],
                logicOperator:null
              }]
            }
        this.tematicService.tematicQueries.push(_query);
      }

      this.toastr.info('Founded ' + this.styles.length + ' styles',
                                    this.tematicService.tematicQueries.length + ' queries created');
    });


  }

  goBack(){
    if(this.tematicIndex === 0){
        this.ok = false;
        this.tematicService.tematicQueries = [];
      }
    else{ this.goCategoriesList(); }
  }

  getStyleImg(styleName: string){
    if(this.styles){
    var _style = this.styles.find((s: { name: string; })=>s.name === styleName);
    if(_style)
      return this.styleService.getImgUrl(_style.imageContent);
  }
    return
  }

  modifyStyle(newStyle:string, i:number, selectElement: HTMLSelectElement){
    if(newStyle === "createNew"){
      this.tematicService.updateTematicModel({
        tematicId:(this.tematicIndex === 0) ? undefined: this.tematicIndex,
        tematicName: this.getAtrr('tematicName')?.value,

        queryToEdit: i,

        queries: this.tematicService.tematicQueries
      });
      this.router.navigate([global['routeCreateStyle']]);

    }
    else{

    if(this.tematicService.tematicQueries.some(q=>q.styleName === newStyle)){
      this.toastr.info('Please select another style or create a new one','This style is already taken');
      selectElement.value = this.tematicService.tematicQueries[i].styleName !== '' ?
                            this.tematicService.tematicQueries[i].styleName : 'createNew';
      return
    }

    var q:query = this.tematicService.tematicQueries[i];
    q.styleName = newStyle;
    this.tematicService.tematicQueries.splice(i,1,q);
    }
  }

  disableCreate(){
    for(let item of this.tematicService.tematicQueries){
      if(item.styleName === '')
        return true;
    }
    return false;
  }
}
