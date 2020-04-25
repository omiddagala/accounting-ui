import {Component, ComponentFactoryResolver, EventEmitter, Inject, OnInit} from '@angular/core';
// @ts-ignore
import Menu from '../../../shared/data/menu.json';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {CommonService} from '../../../shared/common/common.service';
import * as moment from 'jalali-moment';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {ValidatorNumberMax, ValidatorNumberMin} from '../../../shared/validators/min-max.validator';
import {DeleteSaleDialog, EditSaleDialog} from '../sales/sale-detail/sale-detail.component';

@Component({
  selector: 'app-admin-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.compnent.scss']
})

export class ReportComponent implements OnInit {
  menu: any = Menu;
  showSearchField = false;
  formGroup: FormGroup;
  loading = false;
  totalPrice: any;
  public result = [];
  public accountList = [];
  public account = null;
  pageableDTO = {
    page: 0,
    size: 15,
    direction: 'ASC',
    sortBy: 'id',
  };
  loadMore = true;
  date = {
    to: {
      date: {
        year: moment().jYear(),
        month: moment().jMonth() + 1,
        day: moment().jDate()
      },
      jsdate: new Date(moment().format('jYYYY/jM/jD')),
      formatted: moment().format('jYYYY/jM/jD')
    },
    from: null
  };

  constructor(private formBuilder: FormBuilder,
              private http: HttpClient,
              public router: Router,
              private dialog: MatDialog,
              public commonService: CommonService) {
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      customerCode: new FormControl(undefined),
      userCode: new FormControl(undefined),
      bankAccount: new FormControl(undefined)
    });

    this.makeRequest();
    this.getAccountList();
  }

  getAccountList() {
    const param = {
      pageableDTO: this.pageableDTO
    };
    this.http.post<any>('http://127.0.0.1:9000/v1/shop/bank/list', param, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
      .subscribe(
        (val) => {
          console.log(val);
          this.accountList = val;
        },
        err => {
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

  convertToMiladiDate(dateObj) {
    if (dateObj) {
      const date = moment(dateObj.formatted, 'jYYYY/jMM/jDD');
      // console.log(date.format('YYYY-MM-DD'));
      return date.format('YYYY-MM-DD');
    } else {
      return null;
    }
  }

  getId(id) {
    return id ? {id} : null;
  }

  getBankAccountId(bankAccount) {
    if (bankAccount) {
      const id = bankAccount.id;
      return id ? {id} : null;
    } else {
      return null;
    }
  }

  showDate(date) {
    // console.log(new Date(date))
    // console.log(moment('2020-4-5').format('jYYYY-jMM-jDD'));
    return moment(date, 'YYYY-MM-DD').format('jYYYY-jMM-jDD');
  }

  makeRequest() {
    // console.log(this.date);
    this.loading = true;
    const param = {
      user: this.getId(this.formGroup.get('userCode').value),
      customer: this.getId(this.formGroup.get('customerCode').value),
      bankAccount: this.getBankAccountId(this.formGroup.get('bankAccount').value),
      to: this.convertToMiladiDate(this.date.to),
      from: this.convertToMiladiDate(this.date.from),
      pageableDTO: this.pageableDTO
    };
    console.log(param)
    this.http.post<any>('http://127.0.0.1:9000/v1/shop/sales/report', param, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
      .subscribe(
        (val) => {
          this.loading = false;
          this.totalPrice = val.total;
          console.log(val);
          this.result.push(...val.sales);
          console.log('here');
          console.log(this.result);
          this.addValueToResult();
          this.pageableDTO.page++;
          if (val.length === this.pageableDTO.size) {
            this.loadMore = true;
          }
        },
        err => {
          this.loading = false;
          console.log(err);
        });
  }

  addValueToResult() {
    if (this.result.length <= this.pageableDTO.size * 2) {
      let flag: any = [];
      this.result.forEach(item => {
        flag.push(0);
      });
      this.result.forEach((item, index) => {
        this.result.forEach((secondItem, secondIndex) => {
          if (item.id === secondItem.id) {
            flag[index] += 1;
            if (flag[index] >= 2) {
              this.result.splice(index, 1);
              flag.splice(index, 1);
            }
          }
        });
      });
    }
  }

  search() {
    this.pageableDTO.page = 0;
    this.result = [];
    this.makeRequest();
  }

  onScroll() {
    console.log('scrolled !!');
    if (this.loadMore) {
      this.loadMore = false;
      this.makeRequest();
    }
  }

  openEditSale(index) {
    const dialogRef = this.dialog.open(DetailReport, {
      data: {
        result: this.result[index],
      }
    });
  }

  openDeleteSaleDialog(id, index) {
    const dialogRef = this.dialog.open(DeleteSale, {
      data: {
        result: this.result,
        index,
        id
      }
    });
  }
}


@Component({
  selector: 'sale-delete',
  templateUrl: './delete-dialog/delete-dialog.html',
  // styleUrls: ['./edit-dialog/edit-dialog.scss']
})

export class DeleteSale {
  constructor(
    public dialogRef: MatDialogRef<DeleteSale>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(ComponentFactoryResolver) factoryResolver,
    private http: HttpClient,
    private commonService: CommonService) {
  }

  loading = false;

  onNoClick(): void {
    this.dialogRef.close();
  }

  closeDialog = new EventEmitter();

  delete() {
    const param = {
      id: this.data.id
    };
    this.loading = true;
    this.http.post('http://127.0.0.1:9000/v1/shop/sales/delete', param, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
      .subscribe(
        (val) => {
          this.loading = false;
          this.data.result.splice(this.data.index, 1);
          location.reload();
          this.onNoClick();
          this.commonService.showMessage('محصول با موفقیت حذف شد', 'success-msg');
          this.closeDialog.emit(null);
        },
        err => {
          this.loading = false;
          this.onNoClick();
          this.commonService.showMessage('خطایی رخ داده است', 'error-msg');
        });
  }
}



@Component({
  selector: 'detail-report',
  templateUrl: './detail-dialog/detail.dialog.html',
  styleUrls: ['./detail-dialog/detail.dialog.scss']
})

export class DetailReport implements OnInit {
  loading = false;
  obj: any;
  formGroup: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DetailReport>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(ComponentFactoryResolver) factoryResolver,
    private http: HttpClient,
    private commonService: CommonService,
    private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.obj = this.data.result;
    this.formGroup = this.formBuilder.group({
      amount: new FormControl(this.obj.amount, Validators.required),
      discountPrice: new FormControl(this.obj.price, Validators.required),
      // discount: new FormControl(0, [ValidatorNumberMin(0), ValidatorNumberMax(100)])
    });
    console.log(this.obj);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  checkFormValidation() {
    for (const form of Object.keys(this.formGroup.controls)) {
      this.formGroup.get(form).markAsTouched();
    }
  }

  checkData() {
    this.obj.price = this.formGroup.get('discountPrice').value;
    this.obj.amount = this.formGroup.get('amount').value;
  }

  changeSale() {
    this.checkFormValidation();
    if (!this.formGroup.valid) {
      return;
    }
    if (this.loading) {
      return true;
    }
    this.checkData();
    let param = this.obj;
    param.user = {
      id: this.obj.user.id,
      username: this.obj.user.username
    };
    this.loading = true;
    this.http.post('http://127.0.0.1:9000/v1/shop/sales/save', param, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
      .subscribe(
        (val) => {
          this.loading = false;
          location.reload();
          this.onNoClick();
          this.commonService.showMessage('تغیرات با موفقیت اعمال شد', 'success-msg');
        },
        err => {
          this.loading = false;
          this.onNoClick();
          this.commonService.showMessage('خطایی رخ داده است', 'error-msg');
        });
  }
}
