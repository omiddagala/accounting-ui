import {Component, OnInit} from '@angular/core';
// @ts-ignore
import Menu from '../../../shared/data/menu.json';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CommonService} from '../../../shared/common/common.service';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

@Component({
  selector: 'app-auth-change-password-page',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss', '../../../assets/style/auth/change-and-forget-password.scss']
})

export class ChangePasswordComponent implements OnInit {
  menu: any = Menu;
  passwordForm: FormGroup;
  recoveryForm: FormGroup;
  loading = false;
  recoveryPassword = false;
  type = {
    oldPass: 'password',
    repeatPass: 'password',
    newPass: 'password'
  };

  constructor(private formBuilder: FormBuilder,
              public commonService: CommonService,
              private http: HttpClient,
              private router: Router) {
  }

  ngOnInit(): void {
    this.passwordForm = this.formBuilder.group({
      old: new FormControl(null, Validators.compose([
        Validators.required,
        Validators.maxLength(100)
      ])),
      new: new FormControl(null, Validators.compose([
        Validators.required,
        Validators.maxLength(100)
      ])),
      repeat: new FormControl(null, Validators.compose([
        Validators.required,
        Validators.maxLength(100)
      ]))
    });
    this.recoveryForm = this.formBuilder.group({
      new: new FormControl(null, Validators.compose([
        Validators.required,
        Validators.maxLength(100)
      ])),
      repeat: new FormControl(null, Validators.compose([
        Validators.required,
        Validators.maxLength(100)
      ]))
    });
    if (localStorage.getItem('forgetPassword')) {
      this.recoveryPassword = true;
    }
  }

  submit() {
    if (!this.isSameField(this.passwordForm, 'new', 'repeat')
      ||
      !this.passwordForm.valid) {
      return;
    }
    this.loading = true;
    const obj = {
      oldPass: this.passwordForm.get('old').value,
      newPass: this.passwordForm.get('new').value
    };
    this.http.post('http://127.0.0.1:9000/v1/user/authenticated/changePass', obj, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
      .subscribe(
        (val) => {
          this.loading = false;
          this.commonService.showMessage('رمز شما با موفقیت تغیر کرد', 'success-msg');
          this.router.navigate(['/auth/profile']);
        },
        err => {
          console.log(err);
          this.commonService.showMessage(err.error.message, 'error-msg');
          this.loading = false;
        });
  }

  isSameField(form, first, second): boolean {
    if (form.get(first).value !== form.get(second).value) {
      this.commonService.showMessage('رمز عبور با تکرار ان همخوانی ندارد', 'error-msg');
      return false;
    } else {
      return true;
    }
  }

  doRecovery() {
    if (!this.isSameField(this.recoveryForm, 'new', 'repeat')
      ||
      !this.recoveryForm.valid) {
      return;
    }
    this.loading = true;
    let user = JSON.parse(localStorage.getItem('forgetPassword'));
    user.newPass = this.recoveryForm.get('new').value;
    console.log('user');
    console.log(user);
    this.http.post('http://127.0.0.1:9000/v1/user/anonymous/recoveryChangePass',
      user, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .subscribe(
        value => {
          console.log(value);
          localStorage.removeItem('forgetPassword');
          this.loading = false;
          this.router.navigate(['/auth/login']);
          this.commonService.showMessage('رمز با موفقیت تغیر کرد', 'success-msg');
        },
        err => {
          console.log(err);
          this.loading = false;
        }
      );
  }
}
