import {AfterViewInit, Component, ElementRef, EventEmitter, Output, ViewChild} from '@angular/core';
// @ts-ignore
import Menu from '../../data/menu.json';
import {MatDrawer} from '@angular/material';

@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.component.html'
})

export class DrawerComponent implements AfterViewInit{
  // @Output() emitSnave = new EventEmitter();
  menu: any = Menu;
  @ViewChild('snav', {static: false}) public drawer: MatDrawer;
  ngAfterViewInit(): void {
    // this.emitSnave.emit(this.snav);
  }
}
