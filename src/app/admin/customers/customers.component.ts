import {Component, ComponentFactoryResolver, Inject, OnInit} from '@angular/core';
// @ts-ignore
import Menu from '../../../shared/data/menu.json';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {CommonService} from '../../../shared/common/common.service';
import {DeleteDialog} from '../library/library.component';

@Component({
  selector: 'app-admin-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})

export class CustomersComponent implements OnInit {
  menu: any = Menu;
  showSearchField = false;
  formGroup: FormGroup;
  loading = false;
  public result = [];
  timelineLoading = false;
  pageableDTO = {
    page: 0,
    size: 3,
    direction: 'ASC',
    sortBy: 'name',
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
      name: new FormControl(undefined),
      family: new FormControl(undefined),
      nationalCode: new FormControl(undefined),
      mobile: new FormControl(undefined),
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
      name: this.formGroup.get('name').value,
      family: this.formGroup.get('family').value,
      nationalCode: this.convertNumbers(this.formGroup.get('nationalCode').value),
      mobile: this.convertNumbers(this.formGroup.get('mobile').value),
      pageableDTO: this.pageableDTO
    };
    this.http.post<any>('http://127.0.0.1:9000/v1/shop/customer/list', param, {
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
      /*flag.forEach((item, index) => {
        if (flag >= 2) {
          this.result.splice(index, 1);
        }
      });*/
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

  edit(id) {
    this.router.navigate(['/admin/customers/detail'], {queryParams: {id: id}});
  }


  openDeleteDialog(id, index): void {
    const dialogRef = this.dialog.open(DeleteCustomerDialog, {
      data: {
        result : this.result,
        index,
        id
      }
    });
  }

  addCustomer() {
    this.router.navigate(['/admin/customers/detail']);
  }
}

@Component({
  selector: 'customer-delete-dialog',
  templateUrl: './delete-customer-dialog.html'
})

export class DeleteCustomerDialog {
  constructor(
    public dialogRef: MatDialogRef<DeleteCustomerDialog>,
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
    this.http.post('http://127.0.0.1:9000/v1/shop/customer/delete', param, {
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
