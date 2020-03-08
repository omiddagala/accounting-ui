import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {CommonService} from "../shared/common/common.service";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'stewi';

  constructor(private router:Router, private commonService: CommonService) {
  }

  ngOnInit(): void {
    if (!localStorage.getItem("token") || !localStorage.getItem("user")) {
      this.router.navigate(['/auth/login']);
    } else {
      this.commonService.setUser(JSON.parse(localStorage.getItem("user")));
      if (window.location.pathname === '/' || window.location.pathname === '') {
        this.commonService.locateFirstPage();
      }
    }
  }
}
