import {Component, OnInit} from '@angular/core';
// @ts-ignore
import Menu from '../../../shared/data/menu.json';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {CommonService} from '../../../shared/common/common.service';
import {AddAccountDialog} from './add-account/add-account-dialog';
import {DeleteAccountDialog} from './delete-account/delete-account-dialog';

@Component({
  selector: 'app-admin-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})

export class AccountComponent implements OnInit {
  menu: any = Menu;
  showSearchField = false;
  formGroup: FormGroup;
  loading = false;
  public result = [];
  timelineLoading = false;
  pageableDTO = {
    page: 0,
    size: 25,
    direction: 'ASC',
    sortBy: 'bank',
  };
  loadMore = true;

  constructor(private formBuilder: FormBuilder,
              private http: HttpClient,
              public router: Router,
              private dialog: MatDialog,
              public commonService: CommonService) {
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      bank: new FormControl(undefined),
      accountNumber: new FormControl(undefined),
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

  makeRequest() {
    this.loading = true;
    // this.result = [];
    const param = {
      bank: this.formGroup.get('bank').value,
      accountNumber: this.formGroup.get('accountNumber').value,
      pageableDTO: this.pageableDTO
    };
    this.http.post<any>('http://127.0.0.1:9000/v1/shop/bank/list', param, {
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
        err => {
          this.loading = false;
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

  edit(item) {
    const dialogRef = this.dialog.open(AddAccountDialog, {
      data: {
        item
      }
    });
  }

  openDeleteAccountDialog(id, index) {
    const dialogRef = this.dialog.open(DeleteAccountDialog, {
      data: {
        result : this.result,
        index,
        id
      }
    });
  }

  addAccountDialog() {
    const dialogRef = this.dialog.open(AddAccountDialog, {
      data: {}
    });
  }
}
