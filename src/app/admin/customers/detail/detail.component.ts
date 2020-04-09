import {Component, ComponentFactoryResolver, Inject, OnInit, ViewChild} from '@angular/core';
// @ts-ignore
import Menu from '../../../../shared/data/menu.json';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {CommonService} from '../../../../shared/common/common.service';
import * as moment from 'jalali-moment';


export interface DialogData {
  count;
}


@Component({
  selector: 'app-admin-customer-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})

export class DetailComponent implements OnInit {
  menu: any = Menu;
  customer: any = {};
  size: any;
  loading = false;
  saveLoading = false;
  url: string;
  days: any = [];
  // @ViewChild('uploader', {static: false}) uploader;
  image = {
    valid: true,
    link: undefined
  };
  formGroup: FormGroup;
  count = 0;
  color = 'warn';
  isEdit: any;

  constructor(private formBuilder: FormBuilder,
              private http: HttpClient,
              private router: Router,
              private route: ActivatedRoute,
              public dialog: MatDialog,
              public commonService: CommonService) {

  }


  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      name: new FormControl(this.customer ? this.customer.name : '', Validators.required),
      family: new FormControl('', Validators.required),
      nationalCode: new FormControl('', Validators.required),
      mobile: new FormControl('', Validators.required)

    });
    this.getEditInformation();
  }


  getEditInformation() {
    let id;
    this.route.queryParams.subscribe(params => {
      id = params.id;
    });
    if (id) {
      this.fetchProduct(id);
      this.isEdit = true;
    } else {
      /*this.fetchSizes();*/
      this.isEdit = false;
    }
  }


  initFormGroup() {
    this.formGroup.patchValue({
      name: this.customer ? this.customer.name : '',
      family: this.customer ? this.customer.family : '',
      nationalCode: this.customer ? this.customer.nationalCode : '',
      mobile: this.customer ? this.customer.mobile : ''
    });
  }

  fetchProduct(id) {
    this.loading = true;
    const param = {
      id
    };
    this.http.post('http://127.0.0.1:9000/v1/shop/customer/fetch', param, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
      .subscribe(
        (val) => {
          this.customer = val;
          this.initFormGroup();
          this.loading = false;
          // this.addSizeIsNotInProductSize();
        },
        err => {
          this.loading = false;
          console.log(err);
        });
  }


  convertNumbers(str) {
    const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g],
      arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];
    if (typeof str === 'string') {
      for (let i = 0; i < 10; i++) {
        str = str.replace(persianNumbers[i], i).replace(arabicNumbers[i], i);
      }
    }
    return str;
  }

  prepareData() {
    this.customer.name = this.formGroup.get('name').value;
    this.customer.family = this.formGroup.get('family').value;
    this.customer.nationalCode = this.convertNumbers(this.formGroup.get('nationalCode').value);
    this.customer.mobile = this.convertNumbers(this.formGroup.get('mobile').value);
  }

  save() {
    if (this.saveLoading) {
      return;
    }
    this.saveLoading = true;
    this.prepareData();
    console.log(this.customer);
    this.http.post('http://127.0.0.1:9000/v1/shop/customer/save', this.customer, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
      .subscribe(
        (val) => {
          this.commonService.showMessage('عملیات با موفقیت انجام شد.', 'success-msg');
          this.saveLoading = false;
          this.router.navigate(['/admin/customers']);
        },
        err => {
          this.commonService.handleError(err);
          this.saveLoading = false;
        });
  }
}
