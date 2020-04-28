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
  sumPrice: any = {};
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
    from: null,
  };
  printBtn = {
    disable: false,
    factorNumber: ''
  };
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
      bankAccount: new FormControl(undefined),
      factorNum: new FormControl(undefined)
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
    return moment(date, 'YYYY-MM-DD').locale('fa').format('YYYY-MM-DD');
  }

  preparData() {
    return {
      user: this.getId(this.formGroup.get('userCode').value),
      customer: this.getId(this.formGroup.get('customerCode').value),
      bankAccount: this.getBankAccountId(this.formGroup.get('bankAccount').value),
      to: this.convertToMiladiDate(this.date.to),
      from: this.convertToMiladiDate(this.date.from),
      pageableDTO: this.pageableDTO,
      factorNumber: this.commonService.toEnglishDigits(this.formGroup.get('factorNum').value)
    };
  }

  checkPrintBtn() {
    const factorNum = this.formGroup.get('factorNum').value;
    if ((this.result.length > 0) && (factorNum)) {
      this.printBtn.disable = false;
      this.printBtn.factorNumber = factorNum;
    } else {
      this.printBtn.disable = true;
      this.printBtn.factorNumber = '';
    }
  }


  makeRequest() {
    this.loading = true;
    const param = this.preparData();
    console.log(param);
    this.http.post<any>('http://127.0.0.1:9000/v1/shop/sales/report', param, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
      .subscribe(
        (val) => {
          this.loading = false;
          this.totalPrice = val.total;
          this.result.push(...val.sales);
          this.checkPrintBtn();
          this.addValueToResult();
          this.pageableDTO.page++;
          if (val.length === this.pageableDTO.size) {
            this.loadMore = true;
          }
        },
        err => {
          this.loading = false;
          this.totalPrice = '';
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

  calculateTotalPrice() {
    this.sumPrice = {
      total: 0,
      discountToal: 0
    };
    // this.sumPrice.total = 0;
    // this.sumPrice.discountToal = 0;
    this.result.forEach(item => {
      this.sumPrice.total += item.productSize.product.price * item.amount;
      this.sumPrice.discountToal += item.price * item.amount;
    });
  }

  preparePrint() {
    this.calculateTotalPrice();
    this.printFactor(this.printBtn.factorNumber);
    console.log(this.sumPrice);
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
    date.innerHTML = 'تاریخ : ' + moment().format('jYYYY/jMM/jDD');
    header.appendChild(factorNumberBox);
    header.appendChild(date);

    const title = this.createFactorTitle();
    header.appendChild(title);

    return header;
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

  createItemDiv(text, width) {
    const div = document.createElement('div');
    div.style.width = width;
    div.innerHTML = text;
    return div;
  }

  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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
