import {Component, OnInit} from '@angular/core';
// @ts-ignore
import Menu from '../../../shared/data/menu.json';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {CommonService} from '../../../shared/common/common.service';
import * as moment from 'jalali-moment';

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
  pageableDTO = {
    page: 0,
    size: 3,
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
    from: ''
  };

  constructor(private formBuilder: FormBuilder,
              private http: HttpClient,
              public router: Router,
              public commonService: CommonService) {
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      customerCode: new FormControl(undefined),
      userCode: new FormControl(undefined),
      // nationalCode: new FormControl(undefined),
      // mobile: new FormControl(undefined),
      // status: new FormControl('UNPAID'),
    });
    this.makeRequest();
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
    console.log(this.date);
    this.loading = true;
    // this.result = [];
    const param = {
      // name: this.formGroup.get('name').value,
      // family: this.formGroup.get('family').value,
      // nationalCode: this.convertNumbers(this.formGroup.get('nationalCode').value),
      // mobile: this.convertNumbers(this.formGroup.get('mobile').value),
      // status: this.formGroup.get('status').value,
      to: this.convertToMiladiDate(this.date.to),
      // paidDate: this.convertNumbers(this.date.paid),
      pageableDTO: this.pageableDTO
    };
    this.http.post<any>('http://127.0.0.1:9000/v1/shop/sales/report', param, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
      .subscribe(
        (val) => {
          this.loading = false;
          this.totalPrice = val.total
          this.result.push(...val.sales);
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

  goSaleDetail(id) {
    this.router.navigate(['/admin/sales/detail'], {queryParams: {id: id}});
  }

}


