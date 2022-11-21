import { AbstractControl, ValidatorFn } from "@angular/forms";
import { TematicModel } from "../models/tematicModel";

export function DuplicateNameValidator(list: any[], property:string): ValidatorFn{
  return (control: AbstractControl) : { [key:string]:any } | null => {
    const _exists: boolean = list.some(t=>t[property] === control.value);
    // console.log(_exists);
    // console.log(list);
    return _exists ? { 'invalidName':{value: control.value} } : null;
  }
}
