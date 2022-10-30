export class TematicModel{
  tematicId?:number;
  tematicName:string;

  queries: query []

  constructor() {
    this.tematicName = '';

    this.queries = [];

  }
}

export interface condition {
  columnName: string,
  _operator: string,
  value: string,
  logicOperator: string | null
}

export interface query{
  styleName: string;
  layerName: string;
  tableName: string;
  conditions: condition [];
}
