import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit {

  search: string;
  @Output() filter = new EventEmitter<string>();

  ngOnInit(): void {

  }
  constructor() { }

  onModelChange(evt: string) {
    this.filter.next(evt);
  }
}
