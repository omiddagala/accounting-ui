import {Component, OnInit} from '@angular/core';
// @ts-ignore
import Menu from '../../../shared/data/menu.json';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

@Component({
  selector: 'app-users-library',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})

export class UsersComponent implements OnInit {
  menu: any = Menu;
  showSearchField = false;
  formGroup: FormGroup;
  loading = false;
  public result = [];

  rolesType = [
    {
      text: 'فروشنده',
      value: 'SELLER'
    },
    {
      text: 'حسابدار',
      value: 'ACCOUNTANT'
    },
    {
      text: 'حسابرس',
      value: 'AUDITOR'
    },
    {
      text: 'حمل و نقل',
      value: 'TRANSFER'
    },
    {
      text: 'مدیر داخلی',
      value: 'INTERNAL_MANAGER'
    },
    {
      text: 'صندوق دار',
      value: 'CASHIER'
    },
    {
      text: 'انباردار',
      value: 'STOCK_EMPLOYEE'
    },
    {
      text: 'مدیر انبار',
      value: 'STOCK_MANAGER'
    },
  ];


  constructor(private formBuilder: FormBuilder,
              private http: HttpClient,
              private router: Router) {
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      type: new FormControl(undefined),
      name: new FormControl(undefined)
    });
    this.search();
  }


  search() {
    this.loading = true;
    this.result = [];
    const param = {
      name: this.formGroup.get('name').value,
      type: this.formGroup.get('type').value
    };
    this.http.post<any>('http://127.0.0.1:9000/v1/shop/users/list', param, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
      .subscribe(
        (val) => {
          this.loading = false;
          this.result.push(...val);
          console.log(this.result)
        },
        response => {
          this.loading = false;
        });
  }

  edit(id) {
    this.router.navigate(['/admin/users/detail'], { queryParams: { id } });
  }

  findRole(role) {
    for (const item of this.rolesType) {
      if (item.value === role) {
        return item.text;
      }
    }
  }


  delete(id, index) {
    const param = {
      id
    };
    this.loading = true;
    this.http.post('http://127.0.0.1:9000/v1/shop/users/delete', param, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
      .subscribe(
        (val) => {
          this.loading = false;
          this.result.splice(index, 1);
        },
        response => {
          this.loading = false;
        });
  }

}
