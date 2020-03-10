import {Component, OnInit} from '@angular/core';
// @ts-ignore
import Menu from '../../../shared/data/menu.json';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

@Component({
  selector: 'app-notification-component',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})

export class NotificationComponent implements OnInit {
  menu: any = Menu;
  showSearchField = false;
  formGroup: FormGroup;
  loading = false;
  public result = [];

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
    this.http.post<any>('http://127.0.0.1:9000/v1/shop/order/fetch', param, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
      .subscribe(
        (val) => {
          this.loading = false;
          this.result.push(...val);
          console.log(this.result);
        },
        response => {
          this.loading = false;
        });
  }

  closeOrder(id) {
    const param = {
      id
    };
    this.http.post<any>('http://127.0.0.1:9000/v1/shop/order/close', param, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
      .subscribe(
        (val) => {
          this.loading = false;
          location.reload();
        },
        response => {
          this.loading = false;
        });
  }
}
