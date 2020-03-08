import {Component, OnInit} from '@angular/core';
// @ts-ignore
import Menu from '../../../shared/data/menu.json';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {CommonService} from '../../../shared/common/common.service';

@Component({
  selector: 'app-auth-forget-password-page',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss', '../../../assets/style/auth/change-and-forget-password.scss']
})


export class ForgetPasswordComponent implements OnInit {
  step: number;
  menu: any = Menu;
  loading = false;
  countCkeckCode = 0;
  formGroup: any = {
    first: FormGroup,
    second: FormGroup
  };

  constructor(private formBuilder: FormBuilder,
              private http: HttpClient,
              private commonService: CommonService,
              private router: Router) {
  }

  ngOnInit(): void {

    this.step = 1;
    this.formGroup.first = this.formBuilder.group({
      phone: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(11),
        Validators.maxLength(11),
      ])),
    });
    this.formGroup.second = this.formBuilder.group({
      phone: new FormControl({disabled: true, value: ''}),
      code: new FormControl('', Validators.compose([
        Validators.required,
        Validators.maxLength(100)
      ]))
    });
  }

  goNextStep() {
    if (this.formGroup.first.valid) {
      this.loading = true;
      const phone = this.commonService.toEnglishDigits(this.formGroup.first.get('phone').value);
      this.http.post('http://127.0.0.1:9000/v1/user/anonymous/forgetPass',
        phone, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .subscribe(
          value => {
            console.log(value);
            this.loading = false;
            this.step++;
          },
          response => {
            console.log(response);
            this.loading = false;
          }
        );
      // this.step++;
    } else {
      this.formGroup.first.get('phone').markAsTouched();
    }
  }

  goBackStep() {
    this.step--;
  }

  sendCode() {
    console.log('here');
    const obj = {
      mobile: this.commonService.toEnglishDigits(this.formGroup.first.get('phone').value),
      recoveryCode: this.commonService.toEnglishDigits(this.formGroup.second.get('code').value)
    };
    if (this.formGroup.second.valid) {
      this.loading = true;
      console.log(obj);
      this.http.post('http://127.0.0.1:9000/v1/user/anonymous/recoveryCode',
        obj, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .subscribe(
          value => {
            console.log(value);
            const token = 'token'
            if (Object.keys(value[token])) {
              localStorage.setItem('forgetPassword', JSON.stringify(value));
              this.router.navigate(['/auth/change-password']);
            }
            this.loading = false;
          },
          response => {
            this.countCkeckCode++;
            this.commonService.handleError(response);
            if (this.countCkeckCode === 3) {
              this.step = 1;
              this.countCkeckCode = 0;
            }
            console.log(response);
            this.loading = false;
          }
        );
    } else {
      this.formGroup.second.get('code').markAsTouched();
    }
  }

}
