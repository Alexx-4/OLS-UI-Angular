import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { query, TematicModel } from 'src/app/models/tematicModel';
import { StyleService } from 'src/app/services/style.service';
import { TematicService } from 'src/app/services/tematic.service';

import global from '../../../../../global.json'

@Component({
  selector: 'app-query-tematic',
  templateUrl: './query-tematic.component.html',
  styleUrls: ['./query-tematic.component.css']
})
export class QueryTematicComponent implements OnInit {

  tematics: any;
  styles:any;

  _queryTematic: any = {};

  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  dataObs!: Observable<any>;

  constructor(private tematicService:TematicService,
              private router: Router,
              private toastr: ToastrService,
              private styleService: StyleService,
              private _changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.styleService.getStyles().subscribe(
      data=>{
        this.styles = data;
        this.getQueryTematics();
      }
    )

  }

  setPagination(tableData:any) {
    this.dataSource = new MatTableDataSource<any>(tableData);
    this._changeDetectorRef.detectChanges();
    this.dataSource.paginator = this.paginator;
    this.dataObs = this.dataSource.connect();
  }

  infoTematic(tematic:any) {
    if(tematic)
        this._queryTematic = tematic;
    }

  getQueryTematics(){
    this.tematicService.getQueryTematics().subscribe({
      next:(data)=>{
        this.tematics = data;
        this.setPagination(this.tematics);
      }
    })
  }

  deleteQueryTematic(event:Event, id:number) {
    this.tematicService.deleteTematic(id).subscribe({
      next: ()=> {
        this.getQueryTematics();
        this.toastr.info('Tematic successfully deleted');
      }
    });
    }

  goCreateQuery() {
    this.tematicService.updateTematicModel({} as TematicModel);
    this.router.navigate([global['routeCreateQueryTematic']]);
  }

  editQueryTematic(event: Event, id:number){
    event.stopPropagation();

    var tematicList = this.tematics.filter((t:any)=>t.tematicId === id);
    var tematic:TematicModel={
      tematicId: id,
      tematicName: tematicList[0].tematicName,
      queries: []
    };

    for(let item of tematicList){
      let _query:query = {
        styleName: item.styleName,
        layerName: item.layerName,
        tableName: item.tableName,
        conditions: []
      };

      let conditions = item.tematicTypeName.split(';');
      var currentCond = conditions[1].split(',');

      _query.conditions.push({
        columnName: currentCond[0],
        _operator: currentCond[1],
        value: currentCond[2],
        logicOperator: null
      })

      for(let i = 2; i<conditions.length; i++){
        currentCond = conditions[i].split(',');

        _query.conditions.push({
          logicOperator: currentCond[0],
          columnName: currentCond[1],
          _operator: currentCond[2],
          value: currentCond[3]
        });
      }

      tematic.queries.push(_query);
    }

    this.tematicService.updateTematicModel(tematic);
    this.router.navigate([global['routeCreateQueryTematic']]);
  }

  printImage(tematic:any){
    if(this.styles){
      var style = this.styles.find((s: { id: any; })=> s.id === tematic.styleId);
      if(style)
        return this.styleService.getImgUrl(style.imageContent);
  }
    return
  }

}
