import {Component, ComponentFactoryResolver, Inject, OnInit} from '@angular/core';
// @ts-ignore
import Menu from '../../../../shared/data/menu.json';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonService} from '../../../../shared/common/common.service';
import * as moment from 'jalali-moment';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-admin-sales-detail',
  templateUrl: './sale-detail.component.html',
  styleUrls: ['./sale-detail.scss']
})

export class SaleDetailComponent implements OnInit {
  menu: any = Menu;
  showSearchField = false;
  formGroup: FormGroup;
  loading = false;
  public result = [];
  customerId: any;
  pageableDTO = {
    page: 0,
    size: 3,
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
      this.customerId = params.id;
    });
    if (this.customerId) {
      this.makeRequest();
    }
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
      console.log(date.format('YYYY-MM-DD'));
      return date.format('YYYY-MM-DD');
    } else {
      return '';
    }
  }

  makeRequest() {
    this.loading = true;
    // this.result = [];
    const param = {
      customer: {
        // tslint:disable-next-line:radix
        id: parseInt(this.customerId)
      },
      status: this.formGroup.get('status').value,
      addDate:  this.convertToMiladiDate(this.date.add),
      paidDate: this.convertNumbers(this.date.paid),
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
          this.pageableDTO.page++;
          if (val.length === this.pageableDTO.size) {
            this.loadMore = true;
          }
        },
        response => {
          this.loading = false;
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
          if (item.name === secondItem.name) {
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
        result : this.result,
        index,
        id
      }
    });
    console.log(dialogRef)
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
    let param = {
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
        response => {
          this.loading = false;
          this.onNoClick();
          this.commonService.showMessage('خطایی رخ داده است', 'error-msg');
        });
  }

}
