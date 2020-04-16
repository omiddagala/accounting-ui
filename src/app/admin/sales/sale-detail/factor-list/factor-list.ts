import {Component, Inject, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {CommonService} from '../../../../../shared/common/common.service';

@Component({
  selector: 'factor-list',
  templateUrl: './factor-list.html'
})

export class FactorList implements OnInit {
  loading = false;
  loadMore = true;
  result = [];
  pageableDTO = {
    page: 0,
    size: 2,
    direction: 'ASC',
    sortBy: 'id',
  };

  constructor(private http: HttpClient,
              public dialogRef: MatDialogRef<FactorList>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private commonService: CommonService) {
  }

  ngOnInit(): void {
    // this.getListOfFactorNumber();
  }

  makeRequest() {
    this.loading = true;
    const param = {
      customer: {
        id: this.data.customer
      },
      pageableDTO: this.pageableDTO
    };
    this.http.post<any>('http://127.0.0.1:9000/v1/shop/customer/factorNumber', param, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
      .subscribe(
        (val) => {
          this.loading = false;
          console.log(val);
          this.result.push(...val);
          console.log(this.result);
          if (val.length === this.pageableDTO.size) {
            this.loadMore = true;
          }
        },
        err => {
          this.loading = false;
          // this.onNoClick();
          this.commonService.showMessage('خطایی رخ داده است', 'error-msg');
        });
  }

  onScroll() {
    console.log('scrolled !!');
    if (this.loadMore) {
      this.loadMore = false;
      this.makeRequest();
    }
  }

}
