import {Component, DoCheck, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
// @ts-ignore
import JallaliMonth from '../../data/jallali-month.json';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'date-picker-component',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker-component.scss']
})

export class DatePickerComponent implements OnInit, DoCheck {
  test = 0;
  dateForm: FormGroup;
  jallaliMonth: any = JallaliMonth;
  @Input() title: string;
  private _touch: boolean;
  @Output() date = new EventEmitter<object>();

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.dateForm = this.formBuilder.group({
      day: new FormControl('', Validators.compose([
        Validators.required,
        Validators.maxLength(2)
      ])),
      month: new FormControl('', Validators.required),
      year: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(4)
      ]))
    });
  }

  ngDoCheck(): void {
    if (this.dateForm.get('day').valid
      &&
      this.dateForm.get('month').valid
      &&
      this.dateForm.get('year').valid
    ) {
      let day = this.dateForm.get('day').value;
      let month = this.dateForm.get('month').value;
      let year = this.dateForm.get('year').value;
      this.date.emit({
        valid: true,
        date: `${year}/${month}/${day}`
      });

    } else {
      this.date.emit({
        date: false
      });
    }
  }

  get touch() {
    return this._touch;
  }

  @Input()
  set touch(status: boolean) {
    this._touch = status;
    if (this._touch) {
      this.dateForm.get('day').markAsTouched();
      this.dateForm.get('month').markAsTouched();
      this.dateForm.get('year').markAsTouched();
    }
  }
}
