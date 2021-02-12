import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-toaster',
  templateUrl: './toaster.component.html',
  styleUrls: ['./toaster.component.css']
})
export class ToasterComponent implements OnInit {
@Input() success;
@Input() message;
@Output() isToast = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  closeToast(): void {
    this.isToast.emit(false);
  }

}
