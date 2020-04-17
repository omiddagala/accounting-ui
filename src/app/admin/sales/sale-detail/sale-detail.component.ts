import {Component, ComponentFactoryResolver, Inject, OnInit} from '@angular/core';
// @ts-ignore
import Menu from '../../../../shared/data/menu.json';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonService} from '../../../../shared/common/common.service';
import * as moment from 'jalali-moment';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {FactorList} from './factor-list/factor-list';
import {ValidatorNumberMax, ValidatorNumberMin, ValidatorNumberRange} from '../../../../shared/validators/min-max.validator';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-admin-sales-detail',
  templateUrl: './sale-detail.component.html',
  styleUrls: ['./sale-detail.scss']
})

export class SaleDetailComponent implements OnInit {
  menu: any = Menu;
  showSearchField = false;
  formGroup: FormGroup;
  accountList: any;
  account = '';
  loading = false;
  saleLoading = false;
  factorTitle = [
    {
      name: 'گروه کالا',
      enName: 'productGroup',
      width: '15%'
    },
    {
      name: 'کد محصول',
      enName: 'productCode',
      width: '20%'
    },
    {
      name: 'قیمت واحد',
      enName: 'price',
      width: '15%'
    },
    {
      name: 'تعداد',
      enName: 'amount',
      width: '10%'
    },
    {
      name: 'قیمت کل',
      enName: 'totalPrice',
      width: '15%'
    },
    {
      name: 'قیمت کل با تخفیف',
      enName: 'discountPrice',
      width: '25%'
    },
  ];
  sumPrice = {
    total: 0,
    discountToal: 0
  };
  public result = [];
  customer: any = {
    id: 0,
    obj: 0,
    loading: true
  };
  pageableDTO = {
    page: 0,
    size: 30,
    direction: 'ASC',
    sortBy: 'id',
  };
  loadMore = true;
  date = {
    add: '',
    paid: ''
  };

  constructor(private formBuilder: FormBuilder,
              private http: HttpClient,
              public router: Router,
              private route: ActivatedRoute,
              private dialog: MatDialog,
              public commonService: CommonService) {
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      status: new FormControl('UNPAID'),
      factorNumber: new FormControl('')
    });

    this.getCustomerId();
  }

  getCustomerId() {
    this.route.queryParams.subscribe(params => {
      this.customer.id = params.id;
    });
    if (this.customer.id) {
      this.getUser();
      this.getAccountList();
    }
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

  getUser() {
    const param = {
      id: this.customer.id
    };
    this.http.post<any>('http://127.0.0.1:9000/v1/shop/customer/list', param, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
      .subscribe(
        (val) => {
          this.customer.obj = val[0];
          this.customer.loading = false;
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
      return date.format('YYYY-MM-DD');
    } else {
      return '';
    }
  }

  convertMiladiToShamsi(date) {
    /*console.log(date)
    const miladiDate = moment(date, 'YYYY-M-D');
    console.log(miladiDate.format('jYYYY-jM-jD'));
    return miladiDate.format('jYYYY-jM-jD');*/
    return moment(date, 'YYYY-MM-DD ').endOf('jMonth').format('jYYYY/jM/jD ');
  }

  makeRequest() {
    this.loading = true;
    const param = {
      customer: {
        // tslint:disable-next-line:radix
        id: parseInt(this.customer.id)
      },
      status: this.formGroup.get('status').value,
      addDate: this.convertToMiladiDate(this.date.add),
      paidDate: this.convertNumbers(this.date.paid),
      factorNumber: this.formGroup.get('factorNumber').value,
      pageableDTO: this.pageableDTO
    };
    this.http.post<any>('http://127.0.0.1:9000/v1/shop/sales/list', param, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
      .subscribe(
        (val) => {
          this.loading = false;
          this.result.push(...val);
          this.addValueToResult();
          this.calculateTotalPrice();
          this.pageableDTO.page++;
          if (val.length === this.pageableDTO.size) {
            this.loadMore = true;
          }
        },
        err => {
          this.loading = false;
        });
  }

  isUnpaid() {
    return this.formGroup.get('status').value === 'UNPAID';
  }

  calculateTotalPrice() {
    this.sumPrice.total = 0;
    this.sumPrice.discountToal = 0;
    if (this.isUnpaid()) {
      this.result.forEach(item => {
        this.sumPrice.total += item.productSize.product.price * item.amount;
        this.sumPrice.discountToal += item.price * item.amount;
      });
    }
  }

  openFactorNumberList() {
    const dialogRef = this.dialog.open(FactorList, {
      data: {
        customer: this.customer.id
      }
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

  openDeleteSaleDialog(id, index) {
    const dialogRef = this.dialog.open(DeleteSaleDialog, {
      data: {
        result: this.result,
        index,
        id
      }
    });
  }

  openEditSaleDialog(index) {
    const dialogRef = this.dialog.open(EditSaleDialog, {
      data: {
        result: this.result[index],
      }
    });
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

  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  createFactorTitle() {
    const title = document.createElement('div');
    title.style.width = '100%';
    title.style.display = 'flex';
    title.style.flexDirection = 'row';
    title.style.marginTop = '15px';
    title.style.borderTop = 'solid 1px black';
    title.style.borderBottom = 'dashed 1px black';
    title.style.paddingTop = '5px';
    title.style.paddingBottom = '5px';
    this.factorTitle.forEach(item => {
      const div = document.createElement('div');
      div.style.width = item.width;
      div.style.fontSize = '12px';
      div.innerHTML = item.name;
      title.appendChild(div);
    });
    return title;
  }

  creatFactorHeader(factorNumber) {
    const header = document.createElement('div');
    header.style.width = '100%';
    header.style.display = 'flex';
    header.style.flexDirection = 'row';
    header.style.justifyContent = 'space-between';
    header.style.flexWrap = 'wrap';
    const factorNumberBox = document.createElement('div');
    factorNumberBox.innerHTML = 'شماره فاکتور : ' + factorNumber;
    const date = document.createElement('div');
    date.innerHTML = 'تاریخ';
    header.appendChild(factorNumberBox);
    header.appendChild(date);

    const title = this.createFactorTitle();
    header.appendChild(title);

    return header;
  }

  createItemDiv(text, width) {
    const div = document.createElement('div');
    div.style.width = width;
    div.innerHTML = text;
    return div;
  }

  createFactorProductDetail() {
    const container = document.createElement('div');
    container.style.width = '100%';
    this.result.forEach(item => {
      const detail = document.createElement('div');
      detail.style.width = '100%';
      detail.style.display = 'flex';
      detail.style.flexDirection = 'row';
      detail.style.borderBottom = 'dashed 1px black';
      detail.style.paddingTop = '5px';
      detail.style.paddingBottom = '5px';
      detail.style.fontSize = '12px';

      const productGroup = this.createItemDiv(item.productSize.product.group.name, this.factorTitle[0].width);
      const productCode = this.createItemDiv(item.productSize.code, this.factorTitle[1].width);
      const price = this.createItemDiv(this.numberWithCommas(item.productSize.product.price), this.factorTitle[2].width);
      const amount = this.createItemDiv(item.amount, this.factorTitle[3].width);
      const totalPrice = this.createItemDiv(this.numberWithCommas(item.productSize.product.price * item.amount), this.factorTitle[4].width);
      const discountPrice = this.createItemDiv(this.numberWithCommas(item.price * item.amount), this.factorTitle[5].width);

      detail.appendChild(productGroup);
      detail.appendChild(productCode);
      detail.appendChild(price);
      detail.appendChild(amount);
      detail.appendChild(totalPrice);
      detail.appendChild(discountPrice);
      container.appendChild(detail);
    });

    return container;
  }

  createFooterFactor() {
    const footer = document.createElement('div');
    footer.style.width = '100%';
    footer.style.display = 'flex';
    footer.style.flexDirection = 'row';
    // footer.style.marginTop = '15px';
    footer.style.borderTop = 'solid 1px black';
    footer.style.borderBottom = 'dashed 1px black';
    footer.style.paddingTop = '5px';
    footer.style.paddingBottom = '5px';
    this.factorTitle.forEach((item) => {
      const div = document.createElement('div');
      div.style.width = item.width;
      div.style.fontSize = '12px';
      if (item.enName === 'productGroup') {
        div.innerHTML = 'مجموع';
      }
      if (item.enName === 'totalPrice') {
        div.innerHTML = this.numberWithCommas(this.sumPrice.total);
      }
      if (item.enName === 'discountPrice') {
        div.innerHTML = this.numberWithCommas(this.sumPrice.discountToal);
      }
      footer.appendChild(div);
    });
    return footer;
  }

  createFactor(factorNumber) {
    const container = document.createElement('div');
    container.style.width = `100%`;
    container.style.display = 'flex';
    container.style.flexDirection = 'row';
    container.style.flexWrap = 'wrap';
    container.style.direction = 'rtl';
    container.appendChild(this.creatFactorHeader(factorNumber));
    container.appendChild(this.createFactorProductDetail());
    container.appendChild(this.createFooterFactor());
    return container;
  }

  printFactor(factorNumber) {
    const myWindow = window.open('', '', 'left=200,top=200,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    const factor = this.createFactor(factorNumber);
    this.setFactorInWindow(myWindow, factor);
    myWindow.document.close(); // necessary for IE >= 10
    myWindow.focus(); // necessary for IE >= 10*/
    setTimeout(function() {
      myWindow.print();
      myWindow.close();
    }, 200);
  }

  canSaveSale() {
    if (this.saleLoading) {
      return false;
    }
    if (!this.result.length) {
      this.commonService.showMessage('لیست خریدی موجود نمیباشد', 'error-msg');
      return false;
    }
    if (!this.account) {
      this.commonService.showMessage('شماره حساب رو انتخاب کنید', 'error-msg');
      return false;
    }
    return true;
  }

  prepareData() {
    let ids = [];
    this.result.forEach(item => {
      ids.push(item.id);
    });
    return {
      ids,
      bankAccount: this.account
    };
  }

  saveSales() {
    if (!this.canSaveSale()) {
      return;
    }
    this.saleLoading = true;
    const param = this.prepareData();
    console.log(param);
    this.http.post<any>('http://127.0.0.1:9000/v1/shop/sales/finalize', param, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
      .subscribe(
        (val) => {
          console.log(val);
          this.saleLoading = false;
          this.printFactor(val);
          location.reload();
        },
        err => {
          this.saleLoading = false;
        });
  }

  setFactorInWindow(myWindow, container) {
    const body = document.createElement('body');
    body.style.display = 'flex';
    body.style.flexWrap = 'wrap';
    body.style.alignContent = 'baseline';
    body.style.backgroundColor = 'green';
    body.appendChild(container);
    myWindow.document.write('<html><head><title></title>');
    myWindow.document.write('</head>');
    myWindow.document.write(body.innerHTML);
    myWindow.document.write('</html>');
  }


}


@Component({
  selector: 'sale-detail-delete-dialog',
  templateUrl: './delete-dialog.html'
})

export class DeleteSaleDialog {
  constructor(
    public dialogRef: MatDialogRef<DeleteSaleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(ComponentFactoryResolver) factoryResolver,
    private http: HttpClient,
    private commonService: CommonService) {
  }

  loading = false;

  onNoClick(): void {
    this.dialogRef.close();
  }

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
          this.onNoClick();
          this.commonService.showMessage('محصول با موفقیت حذف شد', 'success-msg');
        },
        err => {
          this.loading = false;
          this.onNoClick();
          this.commonService.showMessage('خطایی رخ داده است', 'error-msg');
        });
  }

}

@Component({
  selector: 'sale-edit-dialog',
  templateUrl: './edit-dialog/edit-dialog.html',
  styleUrls: ['./edit-dialog/edit-dialog.scss']
})

export class EditSaleDialog implements OnInit {
  loading = false;
  obj: any;
  formGroup: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditSaleDialog>,
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
      discount: new FormControl(0, [ValidatorNumberMin(0), ValidatorNumberMax(100)])
    });
    this.discount();
  }

  discount() {
    this.formGroup.get('discount').valueChanges.forEach(
      (value) => {
        if(!value) {
          value = 0;
        }
        console.log(value);
        const price = this.obj.productSize.product.price;
        const val = price -  (price * (parseFloat(value) / 100));
        console.log(val);
        this.formGroup.patchValue({
          discountPrice: val
        });
      }
    );
  }



  onNoClick(): void {
    this.dialogRef.close();
  }

  checkData() {
    this.obj.price = this.formGroup.get('discountPrice').value;
    this.obj.amount = this.formGroup.get('amount').value;
  }

  checkFormValidation() {
    for (const form of Object.keys(this.formGroup.controls)) {
      this.formGroup.get(form).markAsTouched();
    }
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
