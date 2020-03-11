import {Injectable} from '@angular/core';
// @ts-ignore
import Insurers from '../data/facilities/insurance/Insurers.json';
import {Router} from '@angular/router';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material';
import * as moment from 'jalali-moment';

@Injectable({
  providedIn: 'root',
})
export class CommonService {

  private user: any;

  constructor(private router: Router,
              public snackbar: MatSnackBar) {
  }

  setUser(u) {
    this.user = u;
  }

  getUser() {
    return this.user;
  }

  hasRole(role) {
    for (let r of this.getUser().roles) {
      if (r === role)
        return true;
    }
    return false;
  }

  isCustomer() {
    return this.hasRole('Darth_Vader');
  }

  isAdmin() {
    return this.hasRole('Princess_Leia');
  }

  isShopAdmin() {
    return this.hasRole('Boba_Fett');
  }

  locateFirstPage() {
    // if (this.isShopAdmin()) {
    //   this.router.navigate(['/admin']);
    // }
    this.router.navigate(['/admin']);
  }

  isEnglish(m) {
    return /^[A-Za-z0-9]*$/.test(m.charAt(0));
  };

  handleError(e) {
    if (e.status === 400) {
      this.showMessage('نام کاربری یا رمز عبور اشتباه می باشد', 'error-msg');
    } else if (!e.error.message || this.isEnglish(e.error.message)) {
      this.showMessage('خطای سیستمی', 'error-msg');
    } else {
      this.showMessage(e.error.message, 'error-msg');
    }
  }

  differentDayUntilNow(date) {
    const last = moment(date, 'jYYYY/jMM/jDD');
    const today = moment();
    return today.diff(last, 'days');
  }

  showMessage(message, state, obj = {}) {
    this.snackbar.open(message, undefined, {
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      duration: 2000,
      panelClass: state,
      ...obj
    });
  }

  logOut() {
    this.router.navigate(['/auth/login']);
    localStorage.clear();
  }

  public toEnglishDigits(str) {
    const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
    const arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];
    if (typeof str === 'string') {
      for (let i = 0; i < 10; i++) {
        str = str.replace(persianNumbers[i], i).replace(arabicNumbers[i], i);
      }
    }
    return str;
  };

}
