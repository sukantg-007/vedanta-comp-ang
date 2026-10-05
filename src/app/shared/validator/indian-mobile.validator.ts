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
  selector: '[indian-mobile]',
  standalone: true,
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => IndianMobileValidatorDirective),
      multi: true
    }
  ]
})
export class IndianMobileValidatorDirective implements Validator {

  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (!value) {
      return null;
    }

    const mobileNumber = String(value).trim();

    const indianMobilePattern = /^[6-9][0-9]{9}$/;

    return indianMobilePattern.test(mobileNumber)
      ? null
      : {
          indianMobile: true
        };
  }
}