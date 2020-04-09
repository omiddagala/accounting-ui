import {Component, ComponentFactoryResolver, Inject, OnInit} from '@angular/core';
// @ts-ignore
import Menu from '../../../shared/data/menu.json';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {CommonService} from '../../../shared/common/common.service';

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

  findTypeById(id) {
    for (let i in this.types) {
      if (this.types[i].value === id) {
        return this.types[i].text;
      }
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
    localStorage.setItem('productCopy', JSON.stringify({}));
    this.router.navigate(['/admin/library/detail'], {queryParams: {id: id}});
  }


  openDeleteDialog(id, index): void {
    /*const dialogRef = this.dialog.open(DeleteDialog, {
      data: {
        result : this.result,
        index: index,
        id: id
      }
    })*/
  }

  addCustomer() {
    this.router.navigate(['/admin/customers/detail']);
  }
}
