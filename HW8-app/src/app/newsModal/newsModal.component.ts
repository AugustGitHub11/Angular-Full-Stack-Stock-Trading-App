import {Component, Input, OnInit} from '@angular/core';
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

import { News } from '../news';

@Component({
  selector: 'app-newsModal',
  templateUrl: './newsModal.component.html',
  styleUrls: ['./newsModal.component.css']
})

export class newsModalComponent implements OnInit{
  @Input() news: News;

  constructor(public newsActiveModal: NgbActiveModal) {
  }

  ngOnInit() {
  }
}
