const express = require('express');
const app = express();

const cors = require('cors');
const fetch = require('node-fetch');

const APIkey = 'c832kcaad3ie4lt0c4m0';
const port = process.env.PORT || 8080;

app.use(cors());

function skipFavicon(req, res, next) {
    if (req.originalUrl.includes('favicon.ico')) {
        res.status(204).end();
    }
    next();
}

app.use(skipFavicon);

app.get('/', (req, res) => {
    return res.send('Stock backend is running!');
})

app.get('/api/search/:tickersymbol', async function (req, res) {
    let tickersymbol = req.params.tickersymbol.toUpperCase();
    let APIurl ='https://finnhub.io/api/v1/search?q=' + tickersymbol + '&token=' + APIkey;
    let response = await fetch(APIurl, {method: 'GET', headers: {'Content-Type': 'application/json'}});
    let resjson = await response.json();
    let result = resjson['result'];
    let filteredresult = [];
    let curr = {};
    for (let i = 0; i < result.length; i++) {
        curr = result[i];
        if (curr['type'] === 'Common Stock' && !curr['symbol'].includes('.')) {
            filteredresult.push(curr)
        }
    }
    return res.send(filteredresult);
})

app.get('/api/description/:tickersymbol', async function (req, res) {
    let tickersymbol = req.params.tickersymbol.toUpperCase();
    let APIurl ='https://finnhub.io/api/v1/stock/profile2?symbol=' + tickersymbol + '&token=' + APIkey;
    let response = await fetch(APIurl, {method: 'GET', headers: {'Content-Type': 'application/json'}});
    let resjson = await response.json();
    return res.send(resjson);
})

app.get('/api/latestPrice/:tickersymbol', async function (req, res) {
    let tickersymbol = req.params.tickersymbol.toUpperCase();
    let APIurl ='https://finnhub.io/api/v1/quote?symbol=' + tickersymbol + '&token=' + APIkey;
    let response = await fetch(APIurl, {method: 'GET', headers: {'Content-Type': 'application/json'}});
    let resjson = await response.json();
    return res.send(resjson);
})

app.get('/api/peers/:tickersymbol', async function (req, res) {
    let tickersymbol = req.params.tickersymbol.toUpperCase();
    let APIurl ='https://finnhub.io/api/v1/stock/peers?symbol=' + tickersymbol + '&token=' + APIkey;
    let response = await fetch(APIurl, {method: 'GET', headers: {'Content-Type': 'application/json'}});
    let resjson = await response.json();
    return res.send(resjson);
})

app.get('/api/hourlyChart/:tickersymbol/:to', async function (req, res) {
    let tickersymbol = req.params.tickersymbol.toUpperCase();
    let endTime = req.params.to;
    let startTimeVal = Number(endTime) - 21600;
    let startTime = startTimeVal.toString();
    let APIurl ='https://finnhub.io/api/v1/stock/candle?symbol=' + tickersymbol + '&resolution=5&from=' + startTime + '&to=' + endTime + '&token=' + APIkey;
    let response = await fetch(APIurl, {method: 'GET', headers: {'Content-Type': 'application/json'}});
    let resjson = await response.json();
    return res.send(resjson);
})

app.get('/api/news/:tickersymbol', async function (req, res) {
    let tickersymbol = req.params.tickersymbol.toUpperCase();
    let currentDate = new Date();
    let previousDate = new Date();
    previousDate.setDate(previousDate.getDate() - 7);
    let to = currentDate.toISOString().slice(0, 10);
    let from = previousDate.toISOString().slice(0, 10);
    let APIurl ='https://finnhub.io/api/v1/company-news?symbol=' + tickersymbol + '&from=' + from + '&to=' + to + '&token=' + APIkey;
    let response = await fetch(APIurl, {method: 'GET', headers: {'Content-Type': 'application/json'}});
    let resjson = await response.json();
    let filteredResult = [];
    let newsLength = resjson.length;
    let curr = {};
    let currIndex = 0;
    let count = 20;
    while (count > 0) {
        if (currIndex < newsLength) {
            curr = resjson[currIndex];
            if (curr['image'] !== '' && curr['title'] !== '') {
                filteredResult.push(curr);
                count -= 1;
            }
            currIndex += 1;
        } else {
            break;
        }
    }
    return res.send(filteredResult);
})

app.get('/api/historicalChart/:tickersymbol/', async function (req, res) {
    let tickersymbol = req.params.tickersymbol.toUpperCase();
    let endTimeVal = Math.round(new Date().getTime() / 1000);
    let startTimeVal = new Date();
    startTimeVal.setDate(startTimeVal.getDate() - 2 * 365);
    startTimeVal = Math.round(startTimeVal.getTime() / 1000);
    let startTime = startTimeVal.toString();
    let endTime = endTimeVal.toString();
    let APIurl ='https://finnhub.io/api/v1/stock/candle?symbol=' + tickersymbol + '&resolution=D&from=' + startTime + '&to=' + endTime + '&token=' + APIkey;
    let response = await fetch(APIurl, {method: 'GET', headers: {'Content-Type': 'application/json'}});
    let resjson = await response.json();
    return res.send(resjson);
})

app.get('/api/socialSentiment/:tickersymbol/', async function (req, res) {
    let tickersymbol = req.params.tickersymbol.toUpperCase();
    let APIurl ='https://finnhub.io/api/v1/stock/social-sentiment?symbol=' + tickersymbol + '&from=2022-01-01&token=' + APIkey;
    let response = await fetch(APIurl, {method: 'GET', headers: {'Content-Type': 'application/json'}});
    let resjson = await response.json();
    let reddit = resjson['reddit'];
    let twitter = resjson['twitter'];
    let redditM = 0, redditPM = 0, redditNM = 0;
    for (let i = 0; i < reddit.length; i += 1) {
        redditM += reddit[i]['mention'];
        redditPM += reddit[i]['positiveMention'];
        redditNM += reddit[i]['negativeMention'];
    }
    let twitterM = 0, twitterPM = 0, twitterNM = 0;
    for (let i = 0; i < twitter.length; i += 1) {
        twitterM += twitter[i]['mention'];
        twitterPM += twitter[i]['positiveMention'];
        twitterNM += twitter[i]['negativeMention'];
    }
    let socialSentiment = {
        'redditM': redditM,
        'redditPM': redditPM,
        'redditNM': redditNM,
        'twitterM': twitterM,
        'twitterPM': twitterPM,
        'twitterNM': twitterNM
    };
    return res.send(socialSentiment);
})

app.get('/api/recommendation/:tickersymbol/', async function (req, res) {
    let tickersymbol = req.params.tickersymbol.toUpperCase();
    let APIurl ='https://finnhub.io/api/v1/stock/recommendation?symbol=' + tickersymbol + '&token=' + APIkey;
    let response = await fetch(APIurl, {method: 'GET', headers: {'Content-Type': 'application/json'}});
    let resjson = await response.json();
    let period = [], strongSell = [], sell = [], hold = [], buy = [], strongBuy = [];
    for (let i = 0; i < resjson.length; i += 1) {
        period.push(resjson[i]['period']);
        strongSell.push(resjson[i]['strongSell']);
        sell.push(resjson[i]['sell']);
        hold.push(resjson[i]['hold']);
        buy.push(resjson[i]['buy'])
        strongBuy.push(resjson[i]['strongBuy']);
    }
    let recommendation = {
        'period': period,
        'strongSell': strongSell,
        'sell': sell,
        'hold': hold,
        'buy': buy,
        'strongBuy': strongBuy
    };
    return res.send(recommendation);
})

app.get('/api/companyEarnings/:tickersymbol/', async function (req, res) {
    let tickersymbol = req.params.tickersymbol.toUpperCase();
    let APIurl ='https://finnhub.io/api/v1/stock/earnings?symbol=' + tickersymbol + '&token=' + APIkey;
    let response = await fetch(APIurl, {method: 'GET', headers: {'Content-Type': 'application/json'}});
    let resjson = await response.json();
    let actual = [], estimate = [], period = [], surprise = [];
    for (let i = 0; i < resjson.length; i += 1) {
        if (resjson[i]['actual'] === null) {
            actual.push(0);
        } else {
            actual.push(resjson[i]['actual']);
        }
        if (resjson[i]['surprise'] === null) {
            surprise.push(0);
        } else {
            surprise.push(resjson[i]['surprise']);
        }
        estimate.push(resjson[i]['estimate']);
        period.push(resjson[i]['period']);
    }
    let earnings = {
        'period': period,
        'actual': actual,
        'estimate': estimate,
        'surprise': surprise
    };
    return res.send(earnings);
})

app.listen(port, () => {
   console.log('My server listening on the port::${port}');
});

