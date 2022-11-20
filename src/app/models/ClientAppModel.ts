export class ClientAppModel{
  id?:string;
  name:string = '';

  userId: string = '';
  userName: string = '';

  applicationType:string = '';

  workspaces: {id:number, name:string}[] = [];
  active:boolean = true;

  accessKey: string = '';
  updateKey:string = '';
}
