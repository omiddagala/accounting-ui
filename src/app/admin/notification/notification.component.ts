import {Component, Inject, OnInit} from '@angular/core';
// @ts-ignore
import Menu from '../../../shared/data/menu.json';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {DialogData} from '../library/detail/detail.component';
import {CommonService} from '../../../shared/common/common.service';

@Component({
  selector: 'app-notification-component',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})

export class NotificationComponent implements OnInit {
  menu: any = Menu;
  showSearchField = false;
  formGroup: FormGroup;
  loading = true;
  public result = [];

  constructor(private formBuilder: FormBuilder,
              private http: HttpClient,
              public dialog: MatDialog,
              private router: Router,
              public commonService: CommonService) {
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      type: new FormControl(undefined),
      name: new FormControl(undefined)
    });
    // this.setOrders();
  }


  updateOrders(val) {
    this.result = val.orders;
    this.loading = val.loading;
  }

  approveOrder(id, orders) {
    const param = {
      id,
      listOrders: JSON.parse(orders)
    };
    this.http.post<any>('http://127.0.0.1:9000/v1/shop/order/approve', param, {
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

  openDialog(item) {
    this.dialog.open(NotificationDialog, {
      data: item
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

@Component({
  selector: 'notification-dialog',
  templateUrl: './notification-dialog.html'
})

export class NotificationDialog implements OnInit {
  constructor(public dialogRef: MatDialogRef<NotificationDialog>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  size: any;

  ngOnInit(): void {
    this.size = JSON.parse(this.data.orders);
    console.log(this.size);
  }
}
