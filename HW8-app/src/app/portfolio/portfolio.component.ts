import {Component, OnInit, ViewChild} from '@angular/core';
import { NgbAlert, NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import {Subject} from "rxjs";
import {debounceTime} from "rxjs/operators";

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})

export class portfolioComponent implements OnInit{
  myWallet = {
    'wallet': 25000.00
  };
  myPortfolio = [];
  ticker;
  noStock: boolean = false;
  buyModalResult = '';
  sellModalResult = '';
  numShares: number = 0;
  transaction;
  buySuccess: boolean = false;
  buySuccessMsg = '';
  private _boughtSuccess = new Subject<string>();
  sellSuccess: boolean = false;
  sellSuccessMsg = '';
  private _soldSuccess = new Subject<string>();

  constructor(private buyModalService: NgbModal) {
  }

  @ViewChild('selfClosingAlert', { static: false }) selfClosingAlert: NgbAlert;

  ngOnInit() {
    if (localStorage.getItem('myPortfolio') && localStorage.getItem('myWallet')) {
      this.myWallet = JSON.parse(localStorage.getItem('myWallet'));
      this.myPortfolio = JSON.parse(localStorage.getItem('myPortfolio'));
      //localStorage.clear();
    }
    if (!this.myPortfolio.length) {
      this.noStock = true;
    }

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
  }

  open(buyModal) {
    this.buyModalService.open(buyModal, {ariaLabelledBy: 'buy-modal-title'}).result.then((result) => {
      this.buyModalResult = `Closed with: ${result}`;
    }, (reason) => {
      this.buyModalResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  open2(sellModal) {
    this.buyModalService.open(sellModal, {ariaLabelledBy: 'sell-modal-title'}).result.then((result) => {
      this.sellModalResult = `Closed with: ${result}`;
    }, (reason) => {
      this.sellModalResult = `Dismissed ${this.getDismissReason(reason)}`;
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

  buyStock(ticker) {
    this.buySuccess = true;
    this._boughtSuccess.next(`${new Date()} - Message successfully changed.`);
    this.transaction = ticker['tickerSymbol'].toUpperCase();
    this.myWallet['wallet'] -= ticker['price'] * this.numShares;
    let target = {
      'tickerSymbol': ticker['tickerSymbol'].toUpperCase(),
      'tickerName': ticker['tickerName'],
      'quantity': ticker['quantity'] + this.numShares,
      'totalCost': ticker['totalCost'] + this.numShares * ticker['price'],
      'change': ticker['change'],
      'price': ticker['price']
    }
    let complement = this.myPortfolio.filter(purchase => purchase.tickerSymbol !== ticker['tickerSymbol'].toUpperCase());
    complement.push(target);
    localStorage.setItem('myPortfolio', JSON.stringify(complement));
  }

  sellStock(ticker) {
    this.sellSuccess = true;
    this._soldSuccess.next(`${new Date()} - Message successfully changed.`);
    this.transaction = ticker['tickerSymbol'].toUpperCase();
    this.myWallet['wallet'] += ticker['price'] * this.numShares;
    let target = {
      'tickerSymbol': ticker['tickerSymbol'].toUpperCase(),
      'tickerName': ticker['tickerName'],
      'quantity': ticker['quantity'] - this.numShares,
      'totalCost': ticker['totalCost'] - this.numShares * ticker['price'],
      'change': ticker['change'],
      'price': ticker['price']
    }
    let complement = this.myPortfolio.filter(purchase => purchase.tickerSymbol !== ticker['tickerSymbol'].toUpperCase());
    complement.push(target);
    localStorage.setItem('myPortfolio', JSON.stringify(complement));
  }

}
