import {Component, OnInit} from '@angular/core';
// @ts-ignore
import Menu from '../../../../shared/data/menu.json';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {CommonService} from '../../../../shared/common/common.service';


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
  printer: any;
  showBarcode = false;

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
    this.http.post('http://127.0.0.1:9000/v1/shop/customer/list', param, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
      .subscribe(
        (val) => {
          this.customer = val[0];
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
          // this.commonService.handleError(err);
          if (err.status === 422) {
            console.log(err);
            this.commonService.showMessage(err.error, 'error-msg');
          }
          this.saveLoading = false;
        });
  }

  getPrinterInfo() {
    const obj = localStorage.getItem('printer');
    const printerInfo = JSON.parse(obj);
    this.printer = printerInfo;
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

  createCustomerBarcode() {
    const imageContainer = document.createElement('div');
    imageContainer.style.width = `${this.printer.labelWidth}mm`;
    imageContainer.style.height = `${this.printer.labelHeight}mm`;
    const img = this.createImage();
    imageContainer.style.display = 'flex';
    imageContainer.style.flexDirection = 'column';
    // imageContainer.style.alignItems = 'center';
    imageContainer.style.justifyContent = 'center';
    imageContainer.append(img);
    const infoDiv = document.createElement('div');
    infoDiv.style.fontSize = `${this.printer.fontSize}px`;
    infoDiv.innerHTML = this.customer.id;
    infoDiv.style.display = 'flex';
    infoDiv.style.justifyContent = 'center';
    imageContainer.append(infoDiv);
    return imageContainer;
  }

  showPrintPage() {
    const container = document.createElement('div');
    container.style.width = `100%`;
    container.style.paddingRight = `${this.printer.paperPaddingX}mm`;
    container.style.height = `${this.printer.paperHeight}mm`;
    container.style.paddingLeft = `${this.printer.paperPaddingX}mm`;
    container.style.paddingTop = `${this.printer.paperPaddingY}mm`;
    container.style.paddingBottom = `${this.printer.paperPaddingY}mm`;
    container.style.alignContent = 'baseline';
    container.style.display = 'flex';
    container.style.flexDirection = 'row';
    container.style.justifyContent = 'center';
    // container.style.alignItems = 'center';
    const barcode = this.createCustomerBarcode();
    container.appendChild(barcode);
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

  printCustomerBarcode() {
    if (localStorage.getItem('printer')) {
      this.getPrinterInfo();
      this.showBarcode = true;
      setTimeout(() => {
        this.showPrintPage();
      }, 100);
    } else {
      this.commonService.showMessage('ابتدا تنظیمات پرینت رو مشخص کنید', 'error-msg');
      this.router.navigate(['/admin/printer']);
    }
    console.log(this.customer);
  }
}
