import { AbstractControl } from '@angular/forms';
export function PasswordValidator(
  AC: AbstractControl): {[key: string]: any} | null {
    if (AC.value !== '') {
      let password = AC.parent.value['password'];
      let confirmPassword = AC.value;
      if (password !== confirmPassword) {
        return { "not_match": true };
      } 
    }
  return null;
}