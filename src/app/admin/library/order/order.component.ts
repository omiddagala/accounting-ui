import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'order-component',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})

export class OrderComponent implements OnInit {

  list = [];
  loading = false;
  formGroup: FormGroup;
  constructor(private  formBuilder: FormBuilder,
              private http: HttpClient) {
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      from: new FormControl(''),
      to: new FormControl(''),
      number: new FormControl('')
    });
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
          this.list.push(...val);
        },
        response => {
          this.loading = false;
        });
  }
}
