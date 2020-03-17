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

  ngOnInit(): void {
    // localStorage.setItem('obj', 'this is just a test');
  }
}
