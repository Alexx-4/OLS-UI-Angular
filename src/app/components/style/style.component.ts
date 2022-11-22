import { getMultipleValuesInSingleSelectionError } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { StyleModel } from 'src/app/models/StyleModel';
import { StyleService } from 'src/app/services/style.service';
import { MatTableDataSource } from '@angular/material/table';

import global from '../../../../global.json';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-style',
  templateUrl: './style.component.html',
  styleUrls: ['./style.component.css']
})
export class StyleComponent implements OnInit {

  styles: any[] = []
  _style: StyleModel = new StyleModel();


  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  dataObs!: Observable<any>;

  constructor(public styleService:StyleService,
              private router: Router,
              private toastr:ToastrService,
              private _changeDetectorRef: ChangeDetectorRef,
              private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.styleService.updateStyleModel({} as StyleModel);
    this.getStyles();
  }

  setPagination(tableData:any) {
    this.dataSource = new MatTableDataSource<any>(tableData);
    this._changeDetectorRef.detectChanges();
    this.dataSource.paginator = this.paginator;
    this.dataObs = this.dataSource.connect();
  }

  getStyles(){
    this.spinner.show();
    this.styleService.getStyles().subscribe({
      next: (data) => {
        this.styles = [];
        for(let item of data as Array<any>){

          var style:StyleModel = {
            id: item.id,
            name: item.name,
            fill: item.fill,

            line: item.line,
            outlinePen: item.outlinePen,

            pointFill: item.pointFill,
            pointSize: item.pointSize,

            imageRotation: item.imageRotation,
            imageScale: item.imageScale,
            enableOutline: item.enableOutline,
            imageContent: item.imageContent

          };

          this.styles.push(style);
        }
        this.setPagination(this.styles);
        this.spinner.hide();
      },
      error: () => {this.toastr.error('Error from server. Try again');
                    this.spinner.hide();}
    });
  }

  deleteStyle(event: MouseEvent, styleId: number | undefined) {
    this.spinner.show();
    this.styleService.deleteStyle(styleId as number).subscribe({
      next:()=>{
        this.getStyles();
        this.toastr.info('Style deleted');
      },
      error: () => {this.toastr.error('Error from server. Try again');
                    this.spinner.hide();}
    })
  }

  editStyle(event: MouseEvent, style: StyleModel) {
    event.stopPropagation();
    this.styleService.updateStyleModel(style);
    this.router.navigate([global['routeCreateStyle']]);
  }

  infoStyle(i:number) {
    console.log('Info Style');
    console.log(this.styles[i])
  }

  goCreateStyle() {
    this.router.navigate([global['routeCreateStyle']]);
  }

}
