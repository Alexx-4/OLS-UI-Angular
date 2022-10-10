export class TematicModel{
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
  logicOperator: string
}

export interface query{
  styleName: string;
  layerName: string;
  conditions: condition [];
}
