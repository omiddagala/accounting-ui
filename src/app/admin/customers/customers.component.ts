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
    size: 20,
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
      type: new FormControl(undefined),
      name: new FormControl(undefined),
      productCode: new FormControl(undefined)
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


  makeRequest() {
    this.loading = true;
    // this.result = [];
    const param = {
      name: this.formGroup.get('name').value,
      type: this.formGroup.get('type').value,
      id: this.formGroup.get('productCode').value,
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
