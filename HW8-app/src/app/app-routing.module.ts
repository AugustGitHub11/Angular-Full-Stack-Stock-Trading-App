import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { detailsComponent } from "./details/details.component";
import { watchlistComponent } from "./watchlist/watchlist.component";
import { searchbarComponent } from "./searchbar/searchbar.component";
import { portfolioComponent } from "./portfolio/portfolio.component";
import {searchdetailsComponent} from "./searchdetails/searchdetails.component";

const routes: Routes = [
  { path: '', redirectTo: 'search/home', pathMatch: 'full'},
  { path: 'search',
    children: [
      { path: 'home', component: searchbarComponent },
      { path: ':ticker', component: searchdetailsComponent }
    ]
  },
  { path: 'watchlist', component: watchlistComponent },
  { path: 'portfolio', component: portfolioComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
