import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {CommonService} from '../../../../shared/common/common.service';
import {ValidatorNumberMin} from '../../../../shared/validators/min-max.validator';
import {ActivatedRoute, Router} from '@angular/router';

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

  constructor(private  formBuilder: FormBuilder,
              private http: HttpClient,
              private commonService: CommonService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      from: new FormControl('', Validators.required),
      to: new FormControl('', Validators.required),
      number: new FormControl('', Validators.compose([
        Validators.required,
        ValidatorNumberMin(1)
      ]))
    });
    this.getList();
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
    for (let item of this.result) {
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
    this.checkFormValidation()
    if (!this.formGroup.valid) {
      return;
    }
    const from = this.getId(this.formGroup.get('from').value);
    const to = this.getId(this.formGroup.get('to').value);
    // tslint:disable-next-line:variable-name
    const number = this.formGroup.get('number').value;
    const product = this.route.snapshot.paramMap.get('product');
    if (this.isValid(from.id, to.id)) {
      this.sendRequest(from.id, to.id, number, product);
    }
  }

  // tslint:disable-next-line:variable-name
  sendRequest(fromId, toId, number, product) {
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
      count: {
        // tslint:disable-next-line:radix
        id: parseInt(number)
      }
    };
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
}
