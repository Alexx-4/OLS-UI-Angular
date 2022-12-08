import { AbstractControl, ValidationErrors } from "@angular/forms";

export function PasswordValidator(form:AbstractControl): ValidationErrors | null{
  const _password = form.get('PasswordRegister')?.value;
  const _confirmPass = form.get('ConfirmPassword')?.value;

  return _password && _confirmPass && _password !== _confirmPass ? {mismatch: true} : null
}
