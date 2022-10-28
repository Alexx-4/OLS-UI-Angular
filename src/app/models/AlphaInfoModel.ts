export class AlphaInfoModel{
  id?:number;

  name:string = '';
  description:string = '';

  pkField: string = '';
  table:string = '';
  connectionString:string = '';

  columns:string = '';

  layerId:number = 0;
  layerName:string = '';
}
