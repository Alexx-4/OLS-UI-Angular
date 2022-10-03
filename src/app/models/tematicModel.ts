export class TematicModel{
  tematicName:string;
  layerName: string;

  queries: query []

  constructor() {
    this.tematicName = '';
    this.layerName = '';

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
  conditions: condition []
}
