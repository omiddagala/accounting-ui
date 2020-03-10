import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {CommonService} from '../../../../shared/common/common.service';
import {ValidatorNumberMin} from '../../../../shared/validators/min-max.validator';
import {ActivatedRoute, Router} from '@angular/router';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {CountDialog, DialogData} from '../detail/detail.component';

@Component({
  selector: 'order-component',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})

export class OrderComponent implements OnInit {

  list = [];
  result = [];
  loading = false;
  formGroup: FormGroup;
  fromFiltered: Observable<string[]>;
  toFiltered: Observable<string[]>;
  sizes: any;
  size: any;
  constructor(private  formBuilder: FormBuilder,
              private http: HttpClient,
              private commonService: CommonService,
              private route: ActivatedRoute,
              public dialog: MatDialog,
              private router: Router) {
  }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      from: new FormControl('', Validators.required),
      to: new FormControl('', Validators.required),
    });
    this.getList();
    this.fetchSize();
  }

  fetchSize() {
    this.http.post('http://127.0.0.1:9000/v1/shop/product/sizes', {}, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
      .subscribe(
        (val) => {
          this.sizes = val;
        },
        response => {
        });
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
  }

  private _filter(value: any) {
    const filterValue = value.toLowerCase();
    return this.list.filter(item => item.toLowerCase().includes(filterValue));
  }

  makeListFromResult() {
    this.result.forEach(item => {
      this.list.push(item.name);
    });
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
        response => {
          this.loading = false;
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
    const product = this.route.snapshot.paramMap.get('product');
    if (this.isValid(from.id, to.id)) {
      this.sendRequest(from.id, to.id, product);
    }
  }

  // tslint:disable-next-line:variable-name
  sendRequest(fromId, toId, product) {
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
          this.router.navigate(['/admin/library']);
        },
        response => {
        });
  }

  setSize() {
    let obj = []
    for (const item of this.sizes) {
      if (item.count !== null) {
        obj.push({
          id: item.size.id,
          value: item.count,
          size: item.size.value
        });
      }
    }
    console.log(obj)
    return JSON.stringify(obj);
  }

  openDialog(size): void {
    this.size = size;
    const dialogRef = this.dialog.open(OrderCountDialog, {
      data: {count: this.size.count}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.size.count = (result === '0') ? 'undefined' : result;
    });
  }
}


@Component({
  selector: 'count-dialog',
  templateUrl: 'order-count-dialog.html',
})
export class OrderCountDialog {

  constructor(
    public dialogRef: MatDialogRef<OrderCountDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
