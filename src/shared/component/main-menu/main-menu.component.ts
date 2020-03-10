import {Component, Input, OnInit} from '@angular/core';
import {CommonService} from '../../common/common.service';
// @ts-ignore
import Menu from '../../data/menu.json';
import {Router} from '@angular/router';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})

export class MainMenuComponent implements OnInit {
  // menu = [
  //   {
  //     text: 'خانه',
  //     route: this.routeHome
  //   },
  //   {
  //     text: 'قوانین و مقررات',
  //     route: this.routeHome
  //   },
  //   {
  //     text: 'کاربران',
  //     route: this.routeUsers
  //   }
  //
  // ];
  @Input() logo: boolean;
  @Input() mainMenu: boolean;
  @Input() profile: boolean;
  @Input() snav: any;

  constructor(public commonService: CommonService,
              private router: Router) {

  }

  ngOnInit(): void {
  }

  toggleDrawer() {
    // console.log(this.snav.drawer);
    // this.snav.drawer.toggle();
    this.snav.toggle();
    // snav.toggle()
  }

  routeHome() {
    this.commonService.locateFirstPage();
  }

  routeUsers() {
    this.router.navigate(['/admin/users']);
  }


  routeLibrary() {
    if (this.commonService.isCustomer()) {
      this.router.navigate(['/facilities/library/list']);
    } else if (this.commonService.isAdmin()) {
      this.router.navigate(['/admin/library']);
    }
  }


}
