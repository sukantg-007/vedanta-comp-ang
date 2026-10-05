import {
  Directive,
  forwardRef
} from '@angular/core';

import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator
} from '@angular/forms';

@Directive({
  selector: '[email-validator]',
  standalone: true,
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CustomEmailValidatorDirective),
      multi: true
    }
  ]
})
export class CustomEmailValidatorDirective implements Validator {

  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (!value) {
      return null;
    }

    const email = String(value).trim();

    const emailPattern =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    return emailPattern.test(email)
      ? null
      : {
          customEmail: true
        };
  }
}