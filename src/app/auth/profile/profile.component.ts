import {Component, OnInit} from '@angular/core';
// @ts-ignore
import Menu from '../../../shared/data/menu.json';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CommonService} from '../../../shared/common/common.service';
import {HttpClient} from '@angular/common/http';
import {ValidatorNumberMax} from '../../../shared/validators/min-max.validator';

@Component({
  selector: 'app-auth-profile-page',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit {
  menu: any = Menu;
  currentTab = 'private';
  loading = false;
  personalForm: FormGroup;
  professionalForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              public commonService: CommonService,
              private http: HttpClient) {
  }

  ngOnInit(): void {
    this.personalForm = this.formBuilder.group({
      firstName: new FormControl(this.commonService.getUser().name, Validators.maxLength(120)),
      lastName: new FormControl(this.commonService.getUser().family, Validators.maxLength(120)),
      nationalCode: new FormControl(this.commonService.getUser().nationalCode, ValidatorNumberMax(Math.pow(10, 10))),
      mobile: new FormControl(this.commonService.getUser().mobile, Validators.compose([
        Validators.minLength(11),
        Validators.maxLength(11)
      ])),
      email: new FormControl(this.commonService.getUser().email, Validators.email),
      address: new FormControl(this.commonService.getUser().address, Validators.maxLength(120)),
      telephone: new FormControl(this.commonService.getUser().phone, Validators.maxLength(100)
      )
    });
    this.professionalForm = this.formBuilder.group({
      field: new FormControl(this.commonService.getUser().field, Validators.maxLength(120)),
      employeeNum: new FormControl(this.commonService.getUser().employeeNum, Validators.maxLength(100)),
      province: new FormControl(this.commonService.getUser().province, Validators.maxLength(100)),
      city: new FormControl(this.commonService.getUser().city, Validators.maxLength(100)),
      membershipNum: new FormControl(this.commonService.getUser().membershipNum, Validators.maxLength(100))
    });
  }

  makeObj(): object {
    let obj = {
      name: this.personalForm.get('firstName').value,
      family: this.personalForm.get('lastName').value,
      nationalCode: this.personalForm.get('nationalCode').value,
      mobile: this.personalForm.get('mobile').value,
      phone: this.personalForm.get('telephone').value,
      email: this.personalForm.get('email').value,
      address: this.personalForm.get('address').value,
      field: this.professionalForm.get('field').value,
      employeeNum: this.professionalForm.get('employeeNum').value,
      membershipNum: this.professionalForm.get('membershipNum').value,
      province: this.professionalForm.get('province').value,
      city: this.professionalForm.get('city').value,
    };
    for (const key of Object.keys(obj)) {
      obj[key] = this.commonService.toEnglishDigits(obj[key]);
    }
    return obj;
  }

  markInvalidForm() {
    for (const field of Object.keys(this.personalForm.controls)) {
      this.personalForm.get(field).markAsTouched();
    }
    for (const field of Object.keys(this.professionalForm.controls)) {
      this.personalForm.get(field).markAsTouched();
    }
  }

  submit() {
    if (!(this.personalForm.valid && this.personalForm.valid)) {
      this.markInvalidForm();
      return;
    }
    this.loading = true;
    const param = this.makeObj();
    this.http.post<any>('http://127.0.0.1:9000/v1/user/authenticated/update', param, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
      .subscribe(
        (val) => {
          localStorage.setItem('user', JSON.stringify(val));
          this.commonService.setUser(val);
          this.loading = false;
          this.commonService.showMessage('اطلاعات شما با موفقیت به روز شد', 'success-msg');
        },
        response => {
          this.loading = false;
        });
  }
}

