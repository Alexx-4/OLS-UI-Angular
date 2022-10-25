
export class ProviderModel{
  id?:number;

  name: string = '';
  description: string = '';

  connectionString: string = '';
  geoField: string = '';
  pkField: string = '';
  boundingBoxField: string = '';
  table: string = '';
}
