import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonService} from '../../../../shared/common/common.service';
import {ValidatorNumberMax} from '../../../../shared/validators/min-max.validator';
import {map, startWith} from 'rxjs/operators';
import {Observable} from 'rxjs';
import * as moment from 'jalali-moment';

@Component({
  selector: 'app-detail-page',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})

export class DetailComponent implements OnInit {
  loading = false;
  formGroup: any = {
    first: FormGroup
  };
  type = {
    pass: 'password',
    repeat: 'password'
  };
  user: any;
  reservoirList = [];
  reservoirNameList = [];
  reservoirFilter: Observable<string[]>;
  rolesType = [
    {
      text: 'فروشنده',
      value: 'SELLER'
    },
    {
      text: 'حسابدار',
      value: 'ACCOUNTANT'
    },
    {
      text: 'حسابرس',
      value: 'AUDITOR'
    },
    {
      text: 'حمل و نقل',
      value: 'TRANSFER'
    },
    {
      text: 'مدیر داخلی',
      value: 'INTERNAL_MANAGER'
    },
    {
      text: 'صندوق دار',
      value: 'CASHIER'
    },
    {
      text: 'انباردار',
      value: 'STOCK_EMPLOYEE'
    },
    {
      text: 'مدیر انبار',
      value: 'STOCK_MANAGER'
    },
  ];

  constructor(private formBuilder: FormBuilder,
              private http: HttpClient,
              private router: Router,
              private commonService: CommonService,
              private route: ActivatedRoute) {
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
      ])),
      reservoir: new FormControl('', Validators.required),
      role: new FormControl('', Validators.required)
    });
    this.getEditInformation();
    this.getReservoirList();
  }

  makeReservoirNameList() {
    this.reservoirList.forEach(item => {
      this.reservoirNameList.push(item.name);
    });
  }

  autocompleteFilter() {
    this.reservoirFilter = this.formGroup.first.get('reservoir').valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  getEditInformation() {
    let id;
    this.route.queryParams.subscribe(params => {
      id = params.id;
    });
    if (id) {
      this.fetchUser(id);
    }
  }

  initFormGroup() {
    this.formGroup.first.patchValue({
      firstName: this.user ? this.user.name : '',
      lastName: this.user ? this.user.family : '',
      phoneNumber: this.user ? this.user.mobile : '',
      role: this.user ? this.user.role : '',
      reservoir: this.user ? this.user.resevoir : ''
    });
  }

  fetchUser(id) {
    this.loading = true;
    const param = {
      id
    };
    this.http.post('http://127.0.0.1:9000/v1/shop/users/findOne', param, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
      .subscribe(
        (val) => {
          console.log(val);
          this.user = val;
          console.log(this.user);
          this.initFormGroup();
        },
        response => {
          this.loading = false;
        });
  }

  _filter(value: any) {
    const filterValue = value.toLowerCase();
    return this.reservoirNameList.filter(item => item.toLowerCase().includes(filterValue));
  }

  getReservoirList() {
    this.loading = true;
    const param = {
      name: '',
    };
    this.http.post<any>('http://127.0.0.1:9000/v1/shop/reservoir/list', param, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
      .subscribe(
        (val) => {
          this.loading = false;
          this.reservoirList.push(...val);
          console.log(this.reservoirList);
          this.makeReservoirNameList();
          this.autocompleteFilter();
        },
        response => {
          this.loading = false;
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

  getId(value) {
    for (const item of this.reservoirList) {
      if (item.name === value) {
        return item;
      }
    }
  }

  makeObj(): object {
    const reservoir = this.getId(this.formGroup.first.get('reservoir').value);
    let obj = {
      username: this.formGroup.first.get('username').value,
      password: this.formGroup.first.get('password').value,
      name: this.formGroup.first.get('firstName').value,
      family: this.formGroup.first.get('lastName').value,
      mobile: this.formGroup.first.get('phoneNumber').value,
      role: this.formGroup.first.get('role').value,
      reservoir: {
        id: reservoir.id
      }
    };
    for (const key of Object.keys(obj)) {
      obj[key] = this.commonService.toEnglishDigits(obj[key]);
    }
    return obj;
  }

  doRegister() {
    this.loading = true;
    const param = this.makeObj();
    console.log(param);
    this.http.post('http://127.0.0.1:9000/v1/shop/users/saveOrUpdate', param, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
        'Content-Type': 'application/json'
      }
    })
      .subscribe(
        (val) => {
          this.loading = false;
          this.router.navigate(['/admin/users']);
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
