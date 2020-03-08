import {Component} from '@angular/core';
import {CommonService} from '../../common/common.service';

@Component({
  selector: 'app-profile-menu-component',
  templateUrl: './profile-menu.component.html',
  styleUrls: ['./profile-menu.component.scss']
})

export class ProfileMenuComponent {
  constructor(public commonService: CommonService) {
  }
}
