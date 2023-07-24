import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";

import { SearchStock } from './searchStock';
import { Description} from './description';
import { LatestPrice } from './latestPrice';
import { Peers } from "./peers";
import { HourlyChart } from './hourlyChart';
import { News } from './news';
import { SocialSentiment } from "./socialSentiment";
import { Recommendation } from "./recommendation";
import { CompanyEarnings } from "./companyEarnings";

@Injectable({
  providedIn: 'root'
})

export class AppService {
  rootURL = 'https://csci-hw8-server.wl.r.appspot.com/api';

  private searchAPI = this.rootURL + '/search';
  private descriptionAPI = this.rootURL + '/description';
  private latestPriceAPI = this.rootURL + '/latestPrice';
  private peersAPI = this.rootURL + '/peers';
  private hourlyChartAPI = this.rootURL + '/hourlyChart';
  private newsAPI = this.rootURL + '/news';
  private historicalChartAPI = this.rootURL + '/historicalChart';
  private socialSentimentAPI = this.rootURL + '/socialSentiment';
  private recommendationAPI = this.rootURL + '/recommendation';
  private companyEarningsAPI = this.rootURL + '/companyEarnings';

  constructor(private http: HttpClient) { }

  getsearch(tickersymbol: string): Observable<SearchStock[]> {
    let searchurl = this.searchAPI + '/' + tickersymbol;
    return this.http.get<SearchStock[]>(searchurl);
  }

  getdescription(tickersymbol: string): Observable<Description> {
    let descriptionurl = this.descriptionAPI + '/' + tickersymbol;
    return this.http.get<Description>(descriptionurl);
  }

  getlatestPrice(tickersymbol: string): Observable<LatestPrice> {
    let latestPriceurl = this.latestPriceAPI + '/' + tickersymbol;
    return this.http.get<LatestPrice>(latestPriceurl);
  }

  getPeers(tickersymbol: string): Observable<Peers[]> {
    let peersurl = this.peersAPI + '/' + tickersymbol;
    return this.http.get<Peers[]>(peersurl);
  }

  gethourlyChart(tickersymbol: string, to: number): Observable<HourlyChart> {
    let hourlyCharturl = this.hourlyChartAPI + '/' + tickersymbol + '/' + to.toString();
    return this.http.get<HourlyChart>(hourlyCharturl);
  }

  getNews(tickersymbol: string): Observable<News[]> {
    let newsurl = this.newsAPI + '/' + tickersymbol;
    return this.http.get<News[]>(newsurl);
  }

  getHistoricalChart(tickersymbol: string): Observable<HourlyChart> {
    let historicalCharturl = this.historicalChartAPI + '/' + tickersymbol;
    return this.http.get<HourlyChart>(historicalCharturl);
  }

  getSocialSentiment(tickersymbol: string): Observable<SocialSentiment> {
    let socialSentimenturl = this.socialSentimentAPI + '/' + tickersymbol;
    return this.http.get<SocialSentiment>(socialSentimenturl);
  }

  getRecommendation(tickersymbol: string): Observable<Recommendation> {
    let recommendationurl = this.recommendationAPI + '/' + tickersymbol;
    return this.http.get<Recommendation>(recommendationurl);
  }

  getCompanyEarnings(tickersymbol: string): Observable<CompanyEarnings> {
    let companyEarningsurl = this.companyEarningsAPI + '/' + tickersymbol;
    return this.http.get<CompanyEarnings>(companyEarningsurl);
  }
}
