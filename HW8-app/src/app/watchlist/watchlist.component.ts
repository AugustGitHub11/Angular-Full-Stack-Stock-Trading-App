import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import {Subject} from "rxjs";

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})

export class watchlistComponent implements OnInit{
  myWatchlist = [];
  ticker;
  noStock: boolean = false;

  constructor(private router: Router) {
  }

  ngOnInit() {
    if (localStorage.getItem('myWatchlist')) {
      this.myWatchlist = JSON.parse(localStorage.getItem('myWatchlist'));
    }
    if (!this.myWatchlist.length) {
      this.noStock = true;
    }
    //localStorage.clear();
  }

  public goToTicker(tickerSymbol) {
    this.router.navigate(['/search', tickerSymbol]);
  }

  public removeTicker(tickerSymbol) {
    this.myWatchlist = this.myWatchlist.filter(ticker => ticker.tickerSymbol !== tickerSymbol);
    localStorage.setItem('myWatchlist', JSON.stringify(this.myWatchlist));
    if (!this.myWatchlist.length) {
      this.noStock = true;
    }
  }
}
