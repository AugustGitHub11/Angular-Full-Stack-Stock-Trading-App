import {Component, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";
import { NgbAlert, NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { debounceTime } from 'rxjs/operators';
import { Subject } from "rxjs";

import * as HC from 'highcharts';
import * as Highcharts from 'highcharts/highstock';
import { Options } from 'highcharts/highstock';
declare var require: any;
require('highcharts/indicators/indicators')(Highcharts);
require('highcharts/indicators/volume-by-price')(Highcharts);

import { AppService } from "../app.service";
import { Description } from "../description";
import { LatestPrice } from "../latestPrice";
import { Peers } from "../peers";
import { HourlyChart } from "../hourlyChart";
import { News } from "../news";
import { SocialSentiment } from "../socialSentiment";
import { Recommendation } from "../recommendation";
import { CompanyEarnings } from "../companyEarnings";

import { newsModalComponent } from "../newsModal/newsModal.component";

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})

export class detailsComponent implements OnInit {
  tickerSymbol: string = '';
  description: Description = null;
  latestPrice: LatestPrice = null;
  currentTime: number = Date.now();
  isMarketOpen: boolean = false;
  peers: Peers[] = [];
  endTime: number = 0;
  hourlyChart: HourlyChart = null;
  Highcharts: typeof Highcharts = Highcharts;
  chartConstructor: string = 'stockChart';
  hourlyChartOptions: Options;
  chartColor: string = '';
  filteredNews: News[] = [];
  historicalChart: HourlyChart = null;
  historicalChartOptions: Options;
  socialSentiment: SocialSentiment = null;
  recommendation: Recommendation = null;
  HC: typeof HC = HC;
  HCConstructor: string='chart';
  recommendationChartsOptions: HC.Options;
  earnings: CompanyEarnings = null;
  earningsChartsOptions: HC.Options;
  stared : boolean = false;
  addSuccess: boolean = false;
  private _addedSuccess = new Subject<string>();
  addSuccessMsg = '';
  removeSuccess: boolean = false;
  private _removedSuccess = new Subject<string>();
  removeSuccessMsg = '';
  buyModalResult = '';
  walletMoney: number = 25000.00;
  numShares: number = 0;
  stockHeld: boolean = false;
  buySuccess: boolean = false;
  buySuccessMsg = '';
  private _boughtSuccess = new Subject<string>();
  sellSuccess: boolean = false;
  sellSuccessMsg = '';
  private _soldSuccess = new Subject<string>();

  constructor(private activatedRoute: ActivatedRoute,
              private appService: AppService,
              private newsActiveModal: NgbModal,
              private router: Router,
              private buyModalService: NgbModal) {
  }

  @ViewChild('selfClosingAlert', { static: false }) selfClosingAlert: NgbAlert;

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      this.tickerSymbol = paramMap.get('ticker');
      this.checkWatchlist();
      this.checkPortfolio();
      this.fetchDescription();
      this.fetchLatestPrice();
      this.fetchPeers();
      this.fetchNews();
      this.fetchHistoricalChart();
      this.fetchSocialSentiment();
      this.fetchRecommendation();
      this.fetchCompanyEarnings();
      this._addedSuccess.subscribe(message => this.addSuccessMsg = message);
      this._addedSuccess.pipe(debounceTime(5000)).subscribe(() => {
      if (this.selfClosingAlert) {
        this.selfClosingAlert.close();
        }
      });
      this._removedSuccess.subscribe(message => this.removeSuccessMsg = message);
      this._removedSuccess.pipe(debounceTime(5000)).subscribe(() => {
        if (this.selfClosingAlert) {
          this.selfClosingAlert.close();
        }
      });
      this._boughtSuccess.subscribe(message => this.buySuccessMsg = message);
      this._boughtSuccess.pipe(debounceTime(5000)).subscribe(() => {
        if (this.selfClosingAlert) {
          this.selfClosingAlert.close();
        }
      });
      this._soldSuccess.subscribe(message => this.sellSuccessMsg = message);
      this._soldSuccess.pipe(debounceTime(5000)).subscribe(() => {
        if (this.selfClosingAlert) {
          this.selfClosingAlert.close();
        }
      });
    });
  }

  fetchDescription() {
    this.appService.getdescription(this.tickerSymbol).subscribe((description) => {
      this.description = description;
    });
  }

  fetchLatestPrice() {
    this.appService.getlatestPrice(this.tickerSymbol).subscribe((latestPrice) => {
      this.latestPrice = latestPrice;
      this.isMarketOpen = (this.currentTime - this.latestPrice.t) / 1000 < 60;
      if (this.isMarketOpen) {
        this.endTime = this.currentTime;
      } else {
        this.endTime = this.latestPrice.t;
      }
      if (this.latestPrice.c - this.latestPrice.pc > 0) {
        this.chartColor = 'green';
      } else {
        this.chartColor = 'red';
      }
      this.appService.gethourlyChart(this.tickerSymbol, this.endTime).subscribe((hourlyChart) => {
        this.hourlyChart = hourlyChart;
        this.displayHourlyCharts();
      });
    });
  }

  displayHourlyCharts() {
    let hourlyPrice = [];
    for (let i = 0; i < this.hourlyChart.t.length; i += 1) {
      hourlyPrice.push([this.hourlyChart.t[i] * 1000, this.hourlyChart.c[i]]);
    }
    this.hourlyChartOptions = {
      chart: {
        spacingTop: 0,
        spacingRight: 0
      },
      title: {
        text: this.tickerSymbol.toUpperCase() + ' Hourly Price Variation',
        style: {
          color: 'gray',
          fontSize: '20px'}
      },
      time: { timezoneOffset: 7 * 60 },
      rangeSelector: { enabled: false },
      navigator: { enabled: false },
      series: [{
        name: this.tickerSymbol,
        type: 'line',
        color: this.chartColor,
        data: hourlyPrice,
        tooltip: { valueDecimals: 2 }
      }]
    }
  }

  fetchPeers() {
    this.appService.getPeers(this.tickerSymbol).subscribe((peers) => {
      this.peers = peers;
    });
  }

  fetchNews() {
    this.appService.getNews(this.tickerSymbol).subscribe((filteredNews) => {
      this.filteredNews = filteredNews;
    })
  }

  checkNews(news: News) {
    let newsModal = this.newsActiveModal.open(newsModalComponent);
    newsModal.componentInstance.news = news;
  }

  fetchHistoricalChart() {
    this.appService.getHistoricalChart(this.tickerSymbol).subscribe((historicalChart) => {
        this.historicalChart = historicalChart;
        this.displayHistoricalCharts();
    });
  }

  displayHistoricalCharts() {
    let historicalPrice = [];
    let volume = [];
    for (let i = 0; i < this.historicalChart.t.length; i += 1) {
      historicalPrice.push([this.historicalChart.t[i] * 1000,
        this.historicalChart.o[i],
        this.historicalChart.h[i],
        this.historicalChart.l[i],
        this.historicalChart.c[i]
      ]);
      volume.push([this.historicalChart.t[i] * 1000, this.historicalChart.v[i]])
    }
    this.historicalChartOptions = {
      title: {
        text: this.tickerSymbol.toUpperCase() + ' Historical',
        style: {
          fontSize: '25px'
        }
      },
      subtitle: {
        text: 'With SMA and Volume by Price technical indicators',
        style: {
          fontSize: '18px'
        }
      },
      time: {
        timezoneOffset: 7 * 60
      },
      rangeSelector: {
        selected: 2
      },
      yAxis: [{
        startOnTick: false,
        endOnTick: false,
        labels: {
          align: 'right',
          x: -3
        },
        title: {
          text: 'OHLC'
        },
        height: '60%',
        lineWidth: 2,
        resize: {
          enabled: true
        }
      }, {
        labels: {
          align: 'right',
          x: -3
        },
        title: {
          text: 'Volume'
        },
        top: '65%',
        height: '35%',
        offset: 0,
        lineWidth: 2
      }],
      tooltip: {
        split: true
      },
      plotOptions: {
        series: {
          dataGrouping: {
            units: [
              ['week', [1]],
              ['month', [1, 2, 3, 4, 6]]
            ]
          }
        }
      },
      series: [
        {
          type: 'candlestick',
          name: this.tickerSymbol.toUpperCase(),
          id: this.tickerSymbol,
          zIndex: 2,
          data: historicalPrice,
          tooltip: {
            valueDecimals: 2
          }
        },
        {
          type: 'column',
          name: 'Volume',
          id: 'volume',
          data: volume,
          yAxis: 1
        },
        {
          type: 'vbp',
          linkedTo: this.tickerSymbol,
          params: {
            volumeSeriesID: 'volume'
          },
          dataLabels: {
            enabled: false
          },
          zoneLines: {
            enabled: false
          }
        },
        {
          type: 'sma',
          linkedTo: this.tickerSymbol,
          zIndex: 1,
          marker: {
            enabled: false
          }
        }
      ]
    }
  }

  fetchSocialSentiment() {
    this.appService.getSocialSentiment(this.tickerSymbol).subscribe((socialSentiment) => {
      this.socialSentiment = socialSentiment;
    })
  }

  fetchRecommendation() {
    this.appService.getRecommendation(this.tickerSymbol).subscribe((recommendation) => {
      this.recommendation = recommendation;
      this.displayRecommendationChart();
    })
  }

  displayRecommendationChart() {
    let period = [], strongSell = [], sell = [], hold = [], buy = [], strongBuy = [];
    for (let i = 0; i < this.recommendation.period.length; i += 1) {
      period.push(this.recommendation.period[i]);
      strongSell.push(this.recommendation.strongSell[i]);
      sell.push(this.recommendation.sell[i]);
      hold.push(this.recommendation.hold[i]);
      buy.push(this.recommendation.buy[i]);
      strongBuy.push(this.recommendation.strongBuy[i]);
    }
    this.recommendationChartsOptions = {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Recommendation Trends',
        style: {
          fontSize: '28px'
        }
      },
      xAxis: {
        categories: period
      },
      yAxis: {
        min: 0,
        title: {
          text: '#Analysis',
          style: {
            fontSize: '20px'
          }
        },
        stackLabels: {
          enabled: true,
          style: {
            fontWeight: 'bold',
            color: 'gray'
          }
        }
      },
      tooltip: {
        headerFormat: '<b>{point.x}</b><br/>',
        pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          dataLabels: {
            enabled: true
          }
        }
      },
      series: [
        {
          type: 'column',
          name: 'Strong Buy',
          data: strongBuy,
          color: '#006400'
        },
        {
          type: 'column',
          name: 'Buy',
          data: buy,
          color: '#32CD32'
        },
        {
          type: 'column',
          name: 'Hold',
          data: hold,
          color: '#B8860B'
        },
        {
          type: 'column',
          name: 'Sell',
          data: sell,
          color: '#DC143C'
        },
        {
          type: 'column',
          name: 'Strong Sell',
          data: strongSell,
          color: '#800000'
        }
      ]
    };
  }

  fetchCompanyEarnings() {
    this.appService.getCompanyEarnings(this.tickerSymbol).subscribe((earnings) => {
      this.earnings = earnings;
      this.displayEarningChart();
    })
  }

  displayEarningChart() {
    let actual = [], estimate = [], category= [];
    for (let i = 0; i < this.earnings.period.length; i += 1) {
      category.push(this.earnings.period[i] + '<br>Surprise: ' + this.earnings.surprise[i])
      actual.push([category[i], this.earnings.actual[i]]);
      estimate.push([category[i], this.earnings.estimate[i]]);
    }
    this.earningsChartsOptions = {
      chart: {
        type: 'spline',
        inverted: false
      },
      title: {
        text: 'Historical EPS Surprises',
        style: {
          fontSize: '28px'
        }
      },
      xAxis: {
        reversed: false,
        categories: category
      },
      yAxis: {
        title: {
          text: 'Quarterly EPS',
          style: {
            fontSize: '20px'
          }
        },
        min: 0,
        allowDecimals: false,
        lineWidth: 2
      },
      tooltip: {
        shared: true
      },
      series: [{
        type: 'spline',
        name: 'Actual',
        data: actual
      }, {
        type: 'spline',
        name: 'Estimate',
        data: estimate
      }]
    }
  }

  public addToWatchlist() {
    this.stared = true;
    this.addSuccess = true;
    this._addedSuccess.next(`${new Date()} - Message successfully changed.`);
    let myWatchlist = [];
    if (localStorage.getItem('myWatchlist')) {
      myWatchlist = JSON.parse(localStorage.getItem('myWatchlist'));
    }
    let newTicker = {
      'tickerSymbol': this.tickerSymbol.toUpperCase(),
      'tickerName': this.description.name,
      'tickerPrice': this.latestPrice.c,
      'priceChange': this.latestPrice.d,
      'priceChangePercent': this.latestPrice.dp
    }
    myWatchlist.push(newTicker);
    localStorage.setItem('myWatchlist', JSON.stringify(myWatchlist));
  }

  checkWatchlist() {
    let myWatchlist = [];
    if (localStorage.getItem('myWatchlist')) {
      myWatchlist = JSON.parse(localStorage.getItem('myWatchlist'));
    }
    myWatchlist = myWatchlist.filter(ticker => ticker.tickerSymbol === this.tickerSymbol.toUpperCase());
    if (!myWatchlist.length) {
      this.stared = false;
    } else {
      this.stared = true;
    }
  }

  public removeFromWatchlist() {
    this.stared = false;
    this.removeSuccess = true;
    this._removedSuccess.next(`${new Date()} - Message successfully changed.`);
    let myWatchlist = JSON.parse(localStorage.getItem('myWatchlist'));
    myWatchlist = myWatchlist.filter(ticker => ticker.tickerSymbol !== this.tickerSymbol.toUpperCase());
    localStorage.setItem('myWatchlist', JSON.stringify(myWatchlist));
  }

  open(buyModal) {
    this.buyModalService.open(buyModal, {ariaLabelledBy: 'buy-modal-title'}).result.then((result) => {
      this.buyModalResult = `Closed with: ${result}`;
    }, (reason) => {
      this.buyModalResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  public buyStock() {
    this.buySuccess = true;
    this._boughtSuccess.next(`${new Date()} - Message successfully changed.`);

    let myPortfolio = [];
    this.walletMoney -= this.numShares * this.latestPrice.c;

    if (localStorage.getItem('myWallet')) {
      let prevWallet = JSON.parse(localStorage.getItem('myWallet'));
      prevWallet['wallet'] = this.walletMoney;
      localStorage.setItem('myWallet', JSON.stringify(prevWallet));
    } else {
      let curWallet = {
        'wallet': this.walletMoney
      }
      localStorage.setItem('myWallet', JSON.stringify(curWallet));
    }

    if (localStorage.getItem('myPortfolio')) {
      myPortfolio = JSON.parse(localStorage.getItem('myPortfolio'));
    }
    let myStock = myPortfolio.filter(purchase => purchase.tickerSymbol.toUpperCase() === this.tickerSymbol.toUpperCase());
    if (myStock.length) {
      myPortfolio.map(purchase => {
        let curPurchase = Object.assign({}, purchase);
        if (curPurchase.tickerSymbol === this.tickerSymbol.toUpperCase()) {
          curPurchase.quantity += this.numShares;
          curPurchase.totalCost += this.numShares * this.latestPrice.c;
        }
      });
    } else {
      let newPurchase = {
        'tickerSymbol': this.tickerSymbol.toUpperCase(),
        'tickerName': this.description.name,
        'quantity': this.numShares,
        'totalCost': this.numShares * this.latestPrice.c,
        'change': this.latestPrice.d,
        'price': this.latestPrice.c
      };
      myPortfolio.push(newPurchase);
    }
    localStorage.setItem('myPortfolio', JSON.stringify(myPortfolio));
    this.checkPortfolio();
  }

  checkPortfolio() {
    let myPortfolio = [];
    if (localStorage.getItem('myPortfolio')) {
      myPortfolio = JSON.parse(localStorage.getItem('myPortfolio'));
    }
    if (!myPortfolio.length) {
      this.stockHeld = false;
    } else {
      this.stockHeld = true;
    }
  }

  public sellStock() {
    this.sellSuccess = true;
    this._soldSuccess.next(`${new Date()} - Message successfully changed.`);

    let myPortfolio = [];
    this.walletMoney += this.numShares * this.latestPrice.c;

    if (localStorage.getItem('myWallet')) {
      let prevWallet = JSON.parse(localStorage.getItem('myWallet'));
      prevWallet['wallet'] = this.walletMoney;
      localStorage.setItem('myWallet', JSON.stringify(prevWallet));
    } else {
      let curWallet = {
        'wallet': this.walletMoney
      }
      localStorage.setItem('myWallet', JSON.stringify(curWallet));
    }

    if (localStorage.getItem('myPortfolio')) {
      myPortfolio = JSON.parse(localStorage.getItem('myPortfolio'));
    }
    let myStock = myPortfolio.filter(purchase => purchase.tickerSymbol === this.tickerSymbol.toUpperCase());
    let prevQuantity = myStock[0]['quantity'];
    let prevTotalCost = myStock[0]['totalCost'];
    let updatedStock = {
      'tickerSymbol': this.tickerSymbol.toUpperCase(),
      'tickerName': this.description.name,
      'quantity': prevQuantity - this.numShares,
      'totalCost': prevTotalCost - this.numShares * this.latestPrice.c,
      'change': this.latestPrice.d,
      'price': this.latestPrice.c
    }
    myPortfolio = myPortfolio.filter(purchase => purchase.tickerSymbol !== this.tickerSymbol.toUpperCase());
    myPortfolio.push(updatedStock);
    localStorage.setItem('myPortfolio', JSON.stringify(myPortfolio));
    this.checkPortfolio();
  }

  open2(sellModal) {
    this.buyModalService.open(sellModal, {ariaLabelledBy: 'buy-modal-title'}).result.then((result) => {
      this.buyModalResult = `Closed with: ${result}`;
    }, (reason) => {
      this.buyModalResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  checkPeer(peer) {

  }
}

