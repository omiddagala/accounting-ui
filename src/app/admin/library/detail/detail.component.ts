import {Component, Inject, OnInit, ViewChild} from '@angular/core';
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

  constructor(private formBuilder: FormBuilder,
              private http: HttpClient,
              private router: Router,
              private route: ActivatedRoute,
              public dialog: MatDialog,
              private commonService: CommonService) {

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
    this.getEditInformation();
    this.getGroupList();
    this.fetchReservoirs();
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
        response => {
        });
  }

  getEditInformation() {
    let id;
    this.route.queryParams.subscribe(params => {
      id = params.id;
    });
    if (id) {
      this.fetchProduct(id);
    } else {
      this.fetchSizes();
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
        },
        response => {
          this.loading = false;
        });
  }

  convertNumbers(str) {
    const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g],
      arabicNumbers  = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];
    if (typeof str === 'string') {
          for (let i = 0; i < 10; i++) {
            str = str.replace(persianNumbers[i], i).replace(arabicNumbers[i], i);
          }
        }
    return str;
  }

  fetchSizes() {
    this.http.post('http://127.0.0.1:9000/v1/shop/product/sizes', {}, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
      .subscribe(
        (val) => {
          this.initFormGroup();
          this.product.productSizes = val;
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
    }
    this.product.expireDate = moment(this.formGroup.get('year').value + '/' + this.formGroup.get('month').value + '/' + this.formGroup.get('day').value, 'YYYY-MM-DD');
    this.product.image = this.url;
    this.product.price = this.formGroup.get('price').value
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
        },
        response => {
        });
  }

  openDialog(size): void {
    this.size = size;
    const dialogRef = this.dialog.open(CountDialog, {
      data: {count: this.size.count}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.size.count = result === '0' ? null : result;
    });
  }

  getFile(file, type) {
    this.url = file.link;
    type.valid = true;
    type.link = file.link;
    if (this.product.id)
      this.save();
  }

}


@Component({
  selector: 'count-dialog',
  templateUrl: 'count-dialog.html',
})
export class CountDialog {

  constructor(
    public dialogRef: MatDialogRef<CountDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
