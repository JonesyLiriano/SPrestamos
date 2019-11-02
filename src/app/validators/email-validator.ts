import { AbstractControl,  } from '@angular/forms';
export function EmailValidator
(AC: AbstractControl):  {[key: string]: any} | null {
    if (AC.value !== '') {
    let email = AC.parent.value['email'];
    let confirmEmail = AC.value;
    if (email !== confirmEmail) {
      return { "not_match": true }
    } 
  }
  return null;
}
