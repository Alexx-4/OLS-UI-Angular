import { getMultipleValuesInSingleSelectionError } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { StyleModel } from 'src/app/models/StyleModel';
import { StyleService } from 'src/app/services/style.service';

import global from '../../../../global.json';

@Component({
  selector: 'app-style',
  templateUrl: './style.component.html',
  styleUrls: ['./style.component.css']
})
export class StyleComponent implements OnInit {

  styles: any[] = []
  color='Red';

  constructor(public styleService:StyleService,
              private router: Router,
              private toastr:ToastrService) { }

  ngOnInit(): void {
    this.styleService.updateStyleModel({} as StyleModel);
    this.getStyles();
  }

  getStyles(){
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
      },
      error: (err) => console.log(err)
    });
  }

  deleteStyle(event: MouseEvent, styleId: number) {
    event.stopPropagation();
    this.styleService.deleteStyle(styleId).subscribe({
      next:()=>{
        this.getStyles();
        this.toastr.info('Style deleted');
      }
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
