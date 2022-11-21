import { Component, OnDestroy, OnInit } from '@angular/core';
import { StyleService } from 'src/app/services/style.service';


import global from '../../../../../global.json'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { StyleModel } from 'src/app/models/StyleModel';
import { TematicService } from 'src/app/services/tematic.service';
import { TematicModel } from 'src/app/models/tematicModel';
import { DuplicateNameValidator } from 'src/app/validators/duplicateName.validator';

@Component({
  selector: 'app-create-style',
  templateUrl: './create-style.component.html',
  styleUrls: ['./create-style.component.css']
})
export class CreateStyleComponent implements OnInit, OnDestroy {

  StyleForm: FormGroup;

  suscription: Subscription = new Subscription();

  styleId: number | undefined = 0;
  tematic: TematicModel = new TematicModel();
  image:any;

  styles: any[] = [];

  constructor(formBuilder: FormBuilder,
              private styleService: StyleService,
              private router: Router,
              private toastr:ToastrService,
              private tematicService: TematicService) {

    this.StyleForm = formBuilder.group({
        name: ['', Validators.required],
        enableOutline: [true, Validators.required],

        fill: ['#ffffff', Validators.required],
        line: ['#ffffff', Validators.required],
        outlinePen: ['#ffffff', Validators.required],
        pointFill: ['#ffffff', Validators.required],
        pointSize: [3, Validators.required],
    })
    }

  ngOnInit(): void {
    this.suscription = this.styleService.getStyleModel().subscribe({
      next:(data)=>{
        if(data.name){
          this.StyleForm.patchValue({
            name: data.name,
            enableOutline: data.enableOutline,
            fill: this.styleService.rgbToHex(data.fill),
            line: this.styleService.rgbToHex(data.line),
            outlinePen: this.styleService.rgbToHex(data.outlinePen),
            pointFill: this.styleService.rgbToHex(data.pointFill),
            pointSize: data.pointSize
          });
          this.styleId = data.id;
          this.getImage()

          this.styleService.updateStyleModel({} as StyleModel);
        }

        this.getStyles();
      }
    });

    this.tematicService.getTematicModel().subscribe({
      next:data =>{this.tematic = data;},
      error: () => {this.toastr.error('Error from server. Try again');}
    });
  }

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }

  goStylesList(){
    if(this.tematic.queryToEdit !== undefined){
      this.router.navigate([global['routeCreateCategoryTematic']]);
    }
    else { this.router.navigate([global['routeStyle']]); }
  }

  getStyles(){
    this.styleService.getStyles().subscribe({
      next:data=>{
        this.styles = data as Array<any>;
        const name = this.getAtrr('name');
        name?.addValidators(DuplicateNameValidator(this.styles.filter(s=>s.id !== this.styleId), 'name'))

      },error: () => {this.toastr.error('Error from server. Try again');}
    })
  }

  getAtrr(atrr:string){
    return this.StyleForm.get(atrr);
  }

  saveStyle(){
    var create:boolean = this.styleId === 0;

    var _style:StyleModel = {
      id: (create) ? undefined : this.styleId,
      name: this.getAtrr('name')?.value,
      enableOutline: this.getAtrr('enableOutline')?.value,

      fill: this.hexToRgb(this.getAtrr('fill')?.value),
      line: this.hexToRgb(this.getAtrr('line')?.value),
      outlinePen: this.hexToRgb(this.getAtrr('outlinePen')?.value),
      pointFill: this.hexToRgb(this.getAtrr('pointFill')?.value),
      pointSize: this.getAtrr('pointSize')?.value,
      imageScale: 0,
      imageRotation: 0
    }

    if(create){
      this.styleService.createStyle(_style).subscribe({
        next:()=>{
          if(this.tematic.queryToEdit !== undefined){
            this.tematic.queries[this.tematic.queryToEdit].styleName = _style.name;
            this.tematicService.updateTematicModel(this.tematic);
            this.router.navigate([global['routeCreateCategoryTematic']]);
          }
          else { this.goStylesList(); }

          this.toastr.info('Style created successfully');
        },
        error: () => {this.toastr.error('Error from server. Try again');}
      });
    }

    else{
      this.styleService.editStyle(_style).subscribe({
        next: ()=>{
          this.styleId = 0;
          this.goStylesList();
          this.toastr.info('Style edited successfully');
        },
        error: () => {this.toastr.error('Error from server. Try again');}
      })
    }
  }

  getImage(){
    var _style:StyleModel = {
      name: this.getAtrr('name')?.value,
      enableOutline: this.getAtrr('enableOutline')?.value,

      fill: this.hexToRgb(this.getAtrr('fill')?.value),
      line: this.hexToRgb(this.getAtrr('line')?.value),
      outlinePen: this.hexToRgb(this.getAtrr('outlinePen')?.value),
      pointFill: this.hexToRgb(this.getAtrr('pointFill')?.value),
      pointSize: this.getAtrr('pointSize')?.value,
      imageScale: 0,
      imageRotation: 0
    }


    this.styleService.getImage(_style).subscribe(
      data=>{
        this.image = this.styleService.getImgUrl(data);
      }
    )
  }

  hexToRgb(hex:string):string {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    var rgb = result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : null;

    var _rgbStr = '';
    if(rgb){
     _rgbStr += rgb.r +','+ rgb.g +','+ rgb.b;
     return _rgbStr;
    }
    return '#ffffff';
  }

}
