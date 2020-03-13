import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommonService} from '../../common/common.service';
// @ts-ignore
import Menu from '../../data/menu.json';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})

export class MainMenuComponent implements OnInit {

  @Input() logo: boolean;
  @Input() mainMenu: boolean;
  @Input() profile: boolean;
  @Input() snav: any;
  @Output() ordersList = new EventEmitter<object>();
  notificationsNumber: any;
  constructor(public commonService: CommonService,
              private router: Router,
              private http: HttpClient) {

  }

   ngOnInit() {
     this.getOrders();
  }


  toggleDrawer() {
    // console.log(this.snav.drawer);
    // this.snav.drawer.toggle();
    this.snav.toggle();
    // snav.toggle()
  }

   getOrders() {
    const TIME = 20000;
    this.ordersList.emit({
      orders: [],
      loading: true
    });
     this.gerOrdersRequest();
    setInterval(() => {
      this.gerOrdersRequest();
    }, TIME);

  }

   gerOrdersRequest() {
      this.http.post('http://127.0.0.1:9000/v1/shop/order/fetch', {}, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      })
        .subscribe(
          (val) => {
            const result: any = val;
            this.notificationsNumber = result.length;
            this.ordersList.emit({
              orders: val,
              loading: false
            });
          },
          err => {
            console.log(err);
          });

  }

  routeHome() {
    this.commonService.locateFirstPage();
  }

  routeUsers() {
    this.router.navigate(['/admin/users']);
  }

  routeToNotification() {
    this.router.navigate(['/admin/notification']);
  }


  routeLibrary() {
    if (this.commonService.isAdmin()) {
      this.router.navigate(['/admin/library']);
    } else {
      this.router.navigate(['/admin/notification']);
    }
  }


}
