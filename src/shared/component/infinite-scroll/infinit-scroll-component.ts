import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';

@Component({
  selector: 'infinite-scroll',
  template: `
      <ng-content></ng-content>
      <div #anchor></div>`
})

export class InfinitScrollComponent implements OnDestroy, AfterViewInit {
  @Input() options = {};
  @Output() scrolled = new EventEmitter();
  @ViewChild('anchor', {static: false}) anchor: ElementRef<HTMLElement>;
  private observer: IntersectionObserver;

  constructor(private host: ElementRef) {
  }

  get element() {
    return this.host.nativeElement;
  }

  ngAfterViewInit() {
    const options = {
      root: this.isHostScrollable() ? this.host.nativeElement : null,
      ...this.options
    };

    this.observer = new IntersectionObserver(([entry]) => {
      entry.isIntersecting && this.scrolled.emit();
    }, options);
    this.observer.observe(this.anchor.nativeElement);
  }

  private isHostScrollable() {
    const style = window.getComputedStyle(this.element);

    return style.getPropertyValue('overflow') === 'auto' ||
      style.getPropertyValue('overflow-y') === 'scroll';
  }

  ngOnDestroy(): void {
    // this.observer.disconnect();
  }
}
