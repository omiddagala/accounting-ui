import {Component, OnInit} from '@angular/core';
// @ts-ignore
import Menu from '../../shared/data/menu.json';
import {CommonService} from '../../shared/common/common.service';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})

export class AdminComponent implements OnInit {
  constructor(public commonService: CommonService) {
  }

  menu: any = Menu;

  pages = [
    {
      name: 'محصولات',
      image: '../../assets/image/facilities/home/store.jpg',
      route: '/admin/library'
    },
    {
      name: 'مشتریان',
      image: '../../assets/image/facilities/home/buy.jpg',
      route: '/admin/customers'
    },
    {
      name: 'انبارها',
      image: '../../assets/image/facilities/home/buy.jpg',
      route: '/admin/reservoir'
    }
  ]

  ngOnInit(): void {
  }
}
