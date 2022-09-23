import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function PasswordValidator(form:AbstractControl): ValidationErrors | null{
  const _password = form.get('Password')?.value;
  const _confirmPass = form.get('ConfirmPassword')?.value;

  console.log(_password);
  console.log(_confirmPass);

  return _password && _confirmPass && _password !== _confirmPass ? {mismatch: true} : null
}
