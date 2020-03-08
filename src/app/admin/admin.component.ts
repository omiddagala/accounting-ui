import {Component} from '@angular/core';
// @ts-ignore
import Menu from '../../shared/data/menu.json';
@Component({
  selector: 'app-admin-page',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})

export class AdminComponent {
  menu: any = Menu;
}
