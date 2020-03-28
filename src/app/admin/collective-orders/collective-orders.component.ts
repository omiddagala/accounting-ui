import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '../../../shared/common/common.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {map, startWith} from 'rxjs/operators';
import {ValidatorNumberMax} from '../../../shared/validators/min-max.validator';

@Component({
  selector: 'app-collective-order',
  styleUrls: ['./collective-orders.component.scss'],
  templateUrl: './collective-orders.component.html'
})

export class CollectiveOrdersComponent implements OnInit {

  list = [];
  productList = [];
  result = [];
  product = [];
  loading = false;
  formGroup: FormGroup;
  fromFiltered: Observable<string[]>;
  toFiltered: Observable<string[]>;
  productFiltered: Observable<string[]>;
  sizes: any;
  size: any;
  productId: any;
  orderSized = [];
  pageableDTO = {
    page: 0,
    size: 30,
    direction: 'ASC',
    sortBy: 'name',
  };
  productLoading = true;

  constructor(public  formBuilder: FormBuilder,
              public http: HttpClient,
              public commonService: CommonService,
              public route: ActivatedRoute,
              public dialog: MatDialog,
              public router: Router) {
    // this.productId = route.snapshot.params.product;
  }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      from: new FormControl('', Validators.required),
      to: new FormControl('', Validators.required),
      product: new FormControl('', Validators.required)
    });
    // this.getProduct();
    this.getList();
  }

  getProduct(value) {
    this.productLoading = true;
    this.product = [];
    const param = {
      name: value,
      type: null,
      id: null,
      pageableDTO: this.pageableDTO
    };
    this.http.post<any>('http://127.0.0.1:9000/v1/shop/product/list', param, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
      .subscribe(
        (val) => {
          this.product.push(...val);
          console.log(this.product);
          this.productLoading = false;
          // this.showProduct()
        },
        res => {
          this.productLoading = false;
          console.log(res);
        });
  }

  checkProduct(value) {
    this.productLoading = true;
    console.log(value);
    setTimeout(() => {
      if (this.product.length > 0) {
        this.product.forEach(item => {
          if (item.name === value) {
            this.productId = item.id;
            this.fetchSize();
            return;
          }
        });
      }
      this.getProduct(value);
    }, 2000);
  }

  /*  showProduct() {
          this.product.forEach((item, index) => {
       if (item.name === value) {
         console.log(index);
         console.log(this.product[index]);
         this.productId = this.product[index].id
         // this.productId = item.id;
         this.fetchSize();
         return;
       }
     });
    }*/


  fetchSize() {
    this.loading = true;
    const param = {
      id: this.productId
    };
    this.http.post('http://127.0.0.1:9000/v1/shop/product/sizes', param, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
      .subscribe(
        (val) => {
          this.orderSized = [];
          this.sizes = val;
          this.setOrderSizeObj();
          this.loading = false;
        },
        err => {
          console.log(err);
          this.loading = false;
        });
  }

  setOrderSizeObj() {
    for (const item of this.sizes) {
      this.orderSized.push({
        id: item.size.id,
        value: '',
        size: item.size.value
      });
    }
  }

  autocompleteFilter() {
    console.log(this.formGroup.get('from').valueChanges);
    this.fromFiltered = this.formGroup.get('from').valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
    this.toFiltered = this.formGroup.get('to').valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );

    this.productFiltered = this.formGroup.get('product').valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterProduct(value))
      );
  }

  private _filter(value: any) {
    const filterValue = value.toLowerCase();
    return this.list.filter(item => item.toLowerCase().includes(filterValue));
  }

  private _filterProduct(value: any) {
    console.log('here');
    console.log(value);
    let filterValue = value;
    /*if (Object.keys(value).length > 0) {
      filterValue = value.name.toLowerCase();
    } else {
      filterValue = value.toLowerCase();
    }*/
    return this.product.filter(item => item.name.toLowerCase().includes(filterValue));
  }

  makeListFromResult() {
    this.result.forEach(item => {
      this.list.push(item.name);
    });
    /* this.product.forEach(item => {
       this.productList.push(item.name);
     });*/
    console.log(this.list);
  }


  getList() {
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
          this.result.push(...val);
          this.makeListFromResult();
          this.autocompleteFilter();
        },
        err => {
          this.loading = false;
          console.log(err);
        });
  }

  getId(value): any {
    for (const item of this.result) {
      if (item.name === value) {
        return item;
      }
    }
  }

  isValid(fromId, toId) {
    if (fromId === toId) {
      this.commonService.showMessage(' مبدا و مقصد نمیتواند یکی باشد', 'error-msg');
      return false;
    } else {
      return true;
    }
  }

  checkFormValidation() {
    for (const form of Object.keys(this.formGroup.controls)) {
      this.formGroup.get(form).markAsTouched();
    }
  }

  saveOrder() {
    this.checkFormValidation();
    if (!this.formGroup.valid) {
      return;
    }
    const from = this.getId(this.formGroup.get('from').value);
    const to = this.getId(this.formGroup.get('to').value);
    // tslint:disable-next-line:variable-name
    if (this.isValid(from.id, to.id)) {
      this.sendRequest(from.id, to.id, this.productId);
    }
  }

  getUserId() {
    const user = JSON.parse(localStorage.getItem('user'));
    return user.id;
  }

  // tslint:disable-next-line:variable-name
  sendRequest(fromId, toId, product) {
    this.loading = true;
    const param = {
      source: {
        id: fromId
      },
      destination: {
        id: toId
      },
      product: {
        // tslint:disable-next-line:radix
        id: parseInt(product)
      },
      submitter: {
        id: this.getUserId()
      },
      orders: this.setSize()
      // tslint:disable-next-line:radix
    };
    console.log(param);
    this.http.post('http://127.0.0.1:9000/v1/shop/order/submit', param, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
        'Content-Type': 'application/json'
      }
    })
      .subscribe(
        (val) => {
          this.commonService.showMessage('عملیات با موفقیت انجام شد.', 'success-msg');
          this.loading = false;
        },
        err => {
          console.log(err);
          this.loading = false;
        });
  }

  setSize() {
    let obj = [];
    for (const item of this.orderSized) {
      if (item.value !== '') {
        obj.push(item);
      }
    }
    console.log(obj);
    return JSON.stringify(obj);
  }

  /*setSize() {
    let obj = [];
    for (const item of this.sizes) {
      if (item.count !== null) {
        obj.push({
          id: item.size.id,
          value: item.count,
          size: item.size.value
        });
      }
    }
    console.log(obj);
    return JSON.stringify(obj);
  }*/

  openDialog(size, i): void {
    this.size = size;
    const dialogRef = this.dialog.open(CollectiveOrderCountDialog, {
      data: {
        count: this.size.count,
        size: this.sizes[i]
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.setCount(result);
    });
  }

  setCount(result) {
    if (result !== undefined) {
      console.log(result);
      if (result.size.count >= result.count) {
        // this.size.count = (result.count === '0') ? 'undefined' : result.count;
        const id = result.size.size.id;
        for (const index in this.orderSized) {
          console.log(this.orderSized[index]);
          console.log(id);
          if (this.orderSized[index].id === id) {
            this.orderSized[index].value = result.count;
          }
        }
        console.log(this.orderSized);
      } else {
        this.commonService.showMessage('تعداد کالاهای درخواستی بیشتر از کالاهای موجود است', 'error-msg');
      }

    }
  }
}


@Component({
  selector: 'collective-order-count-dialog',
  templateUrl: 'collective-order-count-dialog.html',
})
export class CollectiveOrderCountDialog implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<CollectiveOrderCountDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  input: any;

  ngOnInit(): void {
    this.input = new FormControl('', ValidatorNumberMax(this.data.size.count));
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  sendData() {
    return {
      count: this.input.value,
      size: this.data.size
    };
  }

}

