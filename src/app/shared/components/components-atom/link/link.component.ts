import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.scss']
})
export class LinkComponent implements OnInit {

  @Input() to : string;
  @Input() id : string;
  @Input() className : string;
  constructor() { }

  ngOnInit() {
  }

}