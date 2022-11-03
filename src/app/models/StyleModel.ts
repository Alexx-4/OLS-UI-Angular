export class StyleModel{
  id?: number;

  enableOutline: boolean = false;

  fill:string = '';
  line:string = '';

  name:string = '';
  outlinePen:string = '';
  pointFill:string = '';

  pointSize:number = 0;
  imageContent?:any;

  imageRotation:number = 0;
  imageScale:number = 0;

}
