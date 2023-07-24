import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { navbarComponent } from './navbar/navbar.component';
import { searchbarComponent } from './searchbar/searchbar.component';
import { detailsComponent } from './details/details.component';
import { newsModalComponent } from "./newsModal/newsModal.component";
import { watchlistComponent } from "./watchlist/watchlist.component";
import { portfolioComponent } from "./portfolio/portfolio.component";
import { searchdetailsComponent } from "./searchdetails/searchdetails.component";
import { footerComponent } from "./footer/footer.component";

import { AppService } from "./app.service";
import { HttpClientModule } from "@angular/common/http";

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTabsModule } from "@angular/material/tabs";
import { ReactiveFormsModule } from "@angular/forms";
import { FormsModule } from "@angular/forms";
import { HighchartsChartModule } from 'highcharts-angular';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    navbarComponent,
    searchbarComponent,
    detailsComponent,
    newsModalComponent,
    watchlistComponent,
    portfolioComponent,
    searchdetailsComponent,
    footerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    MatTabsModule,
    HighchartsChartModule,
    NgbModule
  ],
  providers: [AppService],
  bootstrap: [AppComponent],
})
export class AppModule {}
