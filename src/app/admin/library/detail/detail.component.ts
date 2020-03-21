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
  selector: 'app-library-new-page',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})

export class DetailComponent implements OnInit {
  menu: any = Menu;
  product: any = {};
  size: any;
  loading = false;
  url: string;
  reservoirs: any;
  expireDate: any;
  days: any = [];
  @ViewChild('uploader', {static: false}) uploader;
  types = [
    {
      text: 'زنانه',
      value: '1'
    },
    {
      text: 'مردانه',
      value: '2'
    },
    {
      text: 'بچه گانه',
      value: '3'
    }
  ];
  image = {
    valid: true,
    link: undefined
  };
  formGroup: FormGroup;
  groupList = [];
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
      name: new FormControl(this.product ? this.product.name : '', Validators.required),
      description: new FormControl(this.product ? this.product.description : ''),
      type: new FormControl(this.product ? this.product.type : '', Validators.required),
      image: new FormControl(this.product ? this.product.image : ''),
      reservoir: new FormControl(this.product ? this.product.reservoir : ''),
      day: new FormControl(''),
      month: new FormControl(''),
      year: new FormControl(''),
      price: new FormControl('', Validators.required),
      group: new FormControl('', Validators.required)
    });
    this.checkCopyProduct();
    this.getEditInformation();
    this.getGroupList();
    this.fetchReservoirs();
  }

  checkCopyProduct() {
    if (this.isCopyProduct()) {
      this.fillInput();
    }
  }

  fillInput() {
    const obj = JSON.parse(localStorage.getItem('productCopy'));
    this.product.name = obj.name;
    this.product.description = obj.description;
    this.product.type = obj.type;
    this.product.image = obj.type;
    this.product.price = parseInt(obj.price);
    this.product.reservoir = obj.reservoir;
    this.product.group = obj.group;
  }

  isCopyProduct() {
    let obj = localStorage.getItem('productCopy');
    if (obj) {
      obj = JSON.parse(obj);
      return Object.keys(obj).length !== 0;
    } else {
      return false;
    }
  }

  getGroupList() {
    this.reservoirs = [];
    this.http.post<any>('http://127.0.0.1:9000/v1/shop/group/list', {name: null}, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
      .subscribe(
        (val) => {
          this.groupList.push(...val);
          console.log(this.groupList);
        },
        err => {
          console.log(err);
        });
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
      this.fetchSizes();
      this.isEdit = false;
    }
  }

  fetchReservoirs() {
    this.reservoirs = [];
    this.http.post<any>('http://127.0.0.1:9000/v1/shop/reservoir/list', {name: null}, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
      .subscribe(
        (val) => {
          this.reservoirs.push(...val);
        },
        response => {
        });
  }

  initFormGroup() {
    this.formGroup.patchValue({
      name: this.product ? this.product.name : '',
      description: this.product ? this.product.description : '',
      type: this.product ? this.product.type : '',
      image: this.product ? this.product.image : '',
      reservoir: this.product && this.product.reservoir ? this.product.reservoir.id : '',
      day: this.expireDate ? this.expireDate[2] : '',
      month: this.expireDate ? this.expireDate[1] : '',
      year: this.expireDate ? this.expireDate[0] : '',
      price: this.product ? this.product.price : '',
      group: this.product ? (this.product.group ? this.product.group.id : '') : ''
    });
  }

  fetchProduct(id) {
    this.loading = true;
    const param = {
      id
    };
    this.http.post('http://127.0.0.1:9000/v1/shop/product/fetch', param, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
      .subscribe(
        (val) => {
          this.product = val;
          if (this.product.image) {
            this.uploader.bgImage = this.product.image;
            this.uploader.video = this.product.image;
          }
          if (this.product.expireDate) {
            this.expireDate = moment(this.product.expireDate, 'YYYY-MM-DDTHH:mmZ').format('jYYYY/jMM/jDD');
            this.expireDate = new Date(this.expireDate).toLocaleDateString('fa-IR');
            this.expireDate = this.convertNumbers(this.expireDate);
            this.expireDate = this.expireDate.split('/', 3);
          }
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

  fetchSizes() {
    this.http.post('http://127.0.0.1:9000/v1/shop/size/list', {}, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
      .subscribe(
        (val) => {
          console.log(val);
          this.initFormGroup();
          const sizeList: any = val;
          this.product.productSizes = [];
          for (const size of sizeList) {
            this.product.productSizes.push({
              size,
              count: null
            });
          }
          console.log(this.product.productSizes);
        },
        response => {
        });
  }

  prepareData() {
    this.product.name = this.formGroup.get('name').value;
    this.product.description = this.formGroup.get('description').value;
    this.product.type = this.formGroup.get('type').value;
    this.product.reservoir = {
      id: this.formGroup.get('reservoir').value
    };
    this.product.group = {
      id: this.formGroup.get('group').value
    };
    this.product.expireDate = moment(this.formGroup.get('year').value + '/' + this.formGroup.get('month').value + '/' + this.formGroup.get('day').value, 'YYYY-MM-DD');
    this.product.image = this.url;
    this.product.price = this.formGroup.get('price').value;
  }

  deleteCopyProduct() {
    localStorage.setItem('productCopy', JSON.stringify({}));
  }

  save() {
    this.prepareData();
    this.http.post('http://127.0.0.1:9000/v1/shop/product/save', this.product, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
      .subscribe(
        (val) => {
          this.commonService.showMessage('عملیات با موفقیت انجام شد.', 'success-msg');
          this.deleteCopyProduct();
          this.router.navigate(['/admin/library']);
        },
        err => {
          console.log(err);
        });
  }

  openDialog(size, index): void {
    this.size = size;
    const dialogRef = this.dialog.open(CountDialog, {
      data: {
        count: this.size.count,
        product: this.product,
        isEdit: this.isEdit,
        productSize: this.product.productSizes[index]
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.size.count = result === '0' ? null : result;
      }
    });
  }

  getFile(file, type) {
    this.url = file.link;
    type.valid = true;
    type.link = file.link;
    if (this.product.id) {
      this.save();
    }
  }

}


@Component({
  selector: 'count-dialog',
  templateUrl: 'count-dialog.html',
  styleUrls: ['./detail.component.scss']
})
export class CountDialog implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<CountDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(ComponentFactoryResolver) factoryResolver,
    private router: Router,
    private commonService: CommonService) {
  }

  printer: any;
  showBarcode = false;

  ngOnInit(): void {
    console.log(this.data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }


  createImage() {
    const barcodeImage = document.querySelector('.barcode').children[0];
    let url = barcodeImage.getAttribute('src');
    const img = document.createElement('img');
    img.style.width = `${this.printer.barcodeWidth}mm`;
    img.style.margin = 'auto';
    img.style.height = `${this.printer.barcodeHeight}mm`;
    img.setAttribute('src', url);
    return img;
  }

  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  createBarcodeContainer() {
    const imageContainer = document.createElement('div');
    imageContainer.style.width = `${this.printer.labelWidth}mm`;
    imageContainer.style.height = `${this.printer.labelHeight}mm`;
    const img = this.createImage();
    imageContainer.style.display = 'flex';
    imageContainer.style.flexDirection = 'column';
    imageContainer.style.justifyContent = 'center';
    imageContainer.append(img);
    const info = [this.data.productSize.id, this.data.product.name, this.numberWithCommas(this.data.product.price) + 'R', this.data.productSize.size.value];
    for (const item of info) {
      const infoDiv = document.createElement('div');
      infoDiv.style.fontSize = `${this.printer.fontSize}px`;
      infoDiv.innerHTML = item;
      infoDiv.style.display = 'flex';
      infoDiv.style.justifyContent = 'center';
      imageContainer.append(infoDiv);
    }
    return imageContainer;
  }

  getPrinterInfo() {
    const obj = localStorage.getItem('printer');
    const printerInfo = JSON.parse(obj);
    this.printer = printerInfo;
  }

  printBarcode() {
    if (localStorage.getItem('printer')) {
      this.getPrinterInfo();
      this.showBarcode = true;
      setTimeout(() => {
        this.showPrintPage();
      }, 100);
    } else {
      this.onNoClick();
      this.commonService.showMessage('ابتدا تنظیمات پرینت رو مشخص کنید', 'error-msg');
      this.router.navigate(['/admin/printer']);
    }
  }

  setBarcodeInWindow(mywindow, div) {
    // style="@media print { width: 370px}"
    const body = document.createElement('body');
    // body.style.width = `50px`;
    body.style.display = 'flex';
    body.style.flexWrap = 'wrap';
    body.style.alignContent = 'baseline';
    body.style.backgroundColor = 'green';
    body.appendChild(div);
    console.log(body);
    mywindow.document.write('<html><head><title></title>');
    mywindow.document.write('</head>');
    mywindow.document.write(body.innerHTML);
    mywindow.document.write('</html>');
  }

  showPrintPage() {
    const container = document.createElement('div');
    container.style.width = `100%`;
    container.style.paddingRight = `${this.printer.paperPaddingX}mm`;
    container.style.height = `${this.printer.paperHeight}mm`;
    // container.style.backgroundColor = 'red';
    container.style.paddingLeft = `${this.printer.paperPaddingX}mm`;
    container.style.paddingTop = `${this.printer.paperPaddingY}mm`;
    container.style.paddingBottom = `${this.printer.paperPaddingY}mm`;
    container.style.alignContent = 'baseline';
    container.style.display = 'flex';
    container.style.flexDirection = 'row';
    container.style.flexWrap = 'wrap';
    let flag = 0; // is center
    for (let i = 0; i < this.data.count; i++) {
      const div = this.createBarcodeContainer();

      // div.style.marginTop = `${this.printer.labelMarginY}mm`;
      console.log(flag)
      div.style.marginBottom = `${this.printer.labelMarginY}mm`;
      if (flag === 1) {
        div.style.marginLeft = `${this.printer.labelMarginX}mm`;
        div.style.marginRight = `${this.printer.labelMarginX}mm`;
      }
      if (flag === 2) {
        flag = 0;
      } else {
        flag++;
      }
      container.appendChild(div);
    }
    console.log(container);
    const myWindow = window.open('', '', 'left=200,top=200,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    this.setBarcodeInWindow(myWindow, container);
    myWindow.document.close(); // necessary for IE >= 10
    myWindow.focus(); // necessary for IE >= 10*/
    setTimeout(function() {
      myWindow.print();
      myWindow.close();
    }, 200);
  }

}
