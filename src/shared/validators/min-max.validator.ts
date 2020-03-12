import {AbstractControl, ValidatorFn} from '@angular/forms';
import {CommonService} from '../common/common.service';

const commonService = new CommonService(undefined, undefined);


function isMin(value, min: number) {
  return value >= min;
}

function isMax(value, max: number) {
  return value <= max;
}

export function ValidatorIsNumber(control: AbstractControl) {
  const value = commonService.toEnglishDigits(control.value);
  if (isNaN(value)) {
    return {validIsNum: true};
  } else {
    return null;
  }
}

export function ValidatorNumberMin(min: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    const value = commonService.toEnglishDigits(control.value);
    if (isNaN(value)) {
      return {validNumMin: true};
    }
    let returnFunc;
    isMin(value, min) ? returnFunc = null : returnFunc = {validNumMin: true};
    return returnFunc;
  };
}

export function ValidatorNumberMax(max: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    const value = commonService.toEnglishDigits(control.value);
    if (isNaN(value)) {
      return {validNumMax: true};
    }
    let returnFunc;
    isMax(value, max) ? returnFunc = null : returnFunc = {validNumMax: true};
    return returnFunc;
  };
}

export function ValidatorNumberRange(min: number, max: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    const value = commonService.toEnglishDigits(control.value);
    if (isNaN(value)) {
      return {validNumRange: true};
    }
    if (isMin(value, min) && isMax(value, max)) {
      return null;
    } else {
      return {validNumRange: true};
    }
  };
}
