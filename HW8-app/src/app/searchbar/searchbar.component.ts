import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";

import {debounceTime, tap, switchMap, finalize, filter} from "rxjs/operators";

import { AppService } from '../app.service';
import { SearchStock } from '../searchStock';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.css']
})

export class searchbarComponent implements OnInit{
  search: FormGroup;
  load = false;
  allresults: SearchStock[] = [];
  ticker: string;

  constructor(private formbuilder: FormBuilder, private appservice: AppService, private router: Router) {
  }

  ngOnInit() {
    this.search = this.formbuilder.group({ tickersymbol: '' });
    this.search.get('tickersymbol').valueChanges.pipe(
      filter(value => value!==''),
      debounceTime(300),
      tap(() => (this.load = true)),
      switchMap((value) => this.appservice.getsearch(value).pipe(finalize(() => (this.load = false)))))
      .subscribe((results) => (this.allresults = results));
  }

  mydisplay(result: SearchStock) {
    if (result) {
      return result.symbol;
    }
  }

  ngOnSubmit(searchvalue) {
    this.ticker = searchvalue.tickersymbol;
    this.router.navigate(['/search', this.ticker]);
  }

  searchResult(result) {
    this.ticker = result.symbol;
    this.router.navigate(['/search', this.ticker])
  }
}
