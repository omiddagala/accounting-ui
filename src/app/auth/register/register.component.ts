import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {CommonService} from '../../../shared/common/common.service';
import {ValidatorNumberMax} from '../../../shared/validators/min-max.validator';

@Component({
  selector: 'app-auth-register-page',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent implements OnInit {
  loading = false;
  formGroup: any = {
    first: FormGroup
  };
  type = {
    pass: 'password',
    repeat: 'password'
  };

  constructor(private formBuilder: FormBuilder,
              private http: HttpClient,
              private router: Router,
              private commonService: CommonService) {
  }

  ngOnInit() {
    this.formGroup.first = this.formBuilder.group({
      firstName: new FormControl(null, Validators.compose([
        Validators.required,
        Validators.maxLength(120)
      ])),
      lastName: new FormControl(null, Validators.compose([
        Validators.required,
        Validators.maxLength(120)
      ])),
      phoneNumber: new FormControl(null, Validators.compose([
        Validators.required,
        Validators.maxLength(11),
        Validators.minLength(11)
      ])),
      username: new FormControl(null, Validators.compose([
        Validators.required,
        Validators.maxLength(120)
      ])),
      password: new FormControl(null, Validators.compose([
        Validators.required,
        Validators.maxLength(100)
      ])),
      repeatPassword: new FormControl(null, Validators.compose([
        Validators.required,
        Validators.maxLength(100)
      ]))
    });
  }

  register() {
    if (this.formGroup.first.valid) {
      if (this.isSameField(this.formGroup.first, 'password', 'repeatPassword')) {
      this.doRegister();
      }
    } else {
      this.markAsTouchFields();
    }
  }

  isSameField(form, first, second): boolean {
    if (form.get(first).value !== form.get(second).value) {
      this.commonService.showMessage('رمز عبور با تکرار ان همخوانی ندارد', 'error-msg');
      return false;
    } else {
      return true;
    }
  }

  makeObj(): object {
    let obj = {
      username: this.formGroup.first.get('username').value,
      password: this.formGroup.first.get('password').value,
      name: this.formGroup.first.get('firstName').value,
      family: this.formGroup.first.get('lastName').value,
      mobile: this.formGroup.first.get('phoneNumber').value,
    };
    for (const key of Object.keys(obj)) {
      obj[key] = this.commonService.toEnglishDigits(obj[key]);
    }
    return obj;
  }

  doRegister() {
    this.loading = true;
    const param = this.makeObj();
    this.http.post('http://37.152.180.194:9000/v1/user/anonymous/register', param)
      .subscribe(
        (val) => {
          this.loading = false;
          this.router.navigate(['/auth/login']);
          this.commonService.showMessage('ثبت نام با موفقیت انجام شد', 'success-msg');
        },
        response => {
          this.loading = false;
        });
  }

  markAsTouchFields() {
    for (const field of Object.keys(this.formGroup.first.controls)) {
      this.formGroup.first.get(field).markAsTouched();
    }
  }
}
