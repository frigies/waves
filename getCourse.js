const axios = require("axios");
const math = require("mathjs");

// ссылки, которые нам понадобятся для запросов:
const PRICE_API0 = `https://course.frigies.finance/read.php`;
const PRICE_API1 = "https://api.coingecko.com/api/v3/simple/price";
const PRICE_API2 = "https://api.wavesplatform.com/v0/transactions/exchange"


const MATCHER = "3PEjHv3JGjcWNpYEEkif2w8NXV4kbhnoGgu"; // адрес матчера - берётся из документации

// количество секунд в одном часе, дне и неделе:
const SEC_IN_HOUR = 3600;
const SEC_IN_DAY = 24 * SEC_IN_HOUR;
const SEC_IN_WEEK = 7 * SEC_IN_DAY;
const SEC_IN_MONTH = 30 * SEC_IN_DAY;
const SEC_IN_YEAR = 365 * SEC_IN_DAY;

const { fromSatoshi } = require("./helpers");
const { time } = require("./helpers");

async function getAssetWavesCourse(assetId, kind = "buy", period = SEC_IN_DAY){ // функция для получения курса Frigies к Waves
    const PRICE_API0 = `https://matcher.waves.exchange/matcher/orderbook/${assetId}/WAVES`;
    // console.log(PRICE_API0);
    const r = 8; // точность округления
    if (kind !== "avg"){ // не усреднённый курс:
        let response0 = await axios.get(PRICE_API0);
        let data0 = response0.data;
        // let data0 = await axios.get(PRICE_API0);
        let price0;
        if (kind === "sell"){    
            let asks = data0["asks"]; // получаем список ордеров на продажу
            if (!asks.length){
                return 0;
            }
            price0 = asks[0]["price"]; // берём цену 1-го из них
            price0 = fromSatoshi(price0); // делим на 100 миллионов (я написал вспомогательную функцию для этого, но можно и не писать)
            // return price0;
        }
        else {
            let bids = data0["bids"]; // получаем список ордеров на покупку
            if (!bids.length){
                return 0;
            }
            price0 = bids[0]["price"]; // берём цену 1-го из них
            price0 = fromSatoshi(price0);
            // return price0;
        }
        price0 = math.round(price0, r); // и округляем
        return price0;
    }
    else { // считаем усреднённый курс
        let timeEnd = time(true); // получаем количество миллисекунд, прошедших с 1 января 1970 года, с помощью вспомогательной функции time

        let timeStart = timeEnd - period * 1000; // вычисляем время, с которого будем вести отчёт: текущее время минус один день либо неделя

        // console.log(timeStart);

        //определяем список параметров
        let params = {
            "matcher": MATCHER,
            "timeStart": timeStart,
            "timeEnd": timeEnd,
            "amountAsset": assetId, // id ассета
            "priceAsset": "WAVES" // курс к Waves
        };

        let response = await axios.get(PRICE_API2, {params}); // делаем запрос с параметрами
        
        let content = response.data;
        let transactions = content["data"]; // в массиве transactions будет содержаться массив транзакций (сделок на бирже)

        let s = 0; // общая стоимость сделок
        let q = 0; // общее количество монет в сделках

        transactions.forEach(transaction => { // проходимся в цикле по массиву с транзакциями
            let txData = transaction["data"]; // получаем данные о транзакции
            let price = txData["price"]; // получаем цену
            let amount = txData["amount"]; // получаем количество монет
            s += amount * price; // вычисляем стоимость и добавляем к общей стоимости
            q += amount; // добавляем количество к общему количеству
        });

        if ((!q) && (period === SEC_IN_DAY)){ // если у нас не было ни одной проданной монеты за день, то вызываем функцию ещё раз, но за период уже в одну неделю:
            return getAssetWavesCourse(assetId, kind, SEC_IN_WEEK);
        }

        if ((!q) && (period === SEC_IN_WEEK)){ // если у нас не было ни одной проданной монеты за неделю, то вызываем функцию ещё раз, но за период уже в одну неделю:
            return getAssetWavesCourse(assetId, kind, SEC_IN_MONTH);
        }

        if ((!q) && (period === SEC_IN_MONTH)){ // если у нас не было ни одной проданной монеты за месяц, то вызываем функцию ещё раз, но за период уже в одну неделю:
            return getAssetWavesCourse(assetId, kind, SEC_IN_YEAR);
        }

        p = s / q; // делим общую стоимость на общее количество и получаем цену

        p = math.round(p, r); // и округляем

        return p;
    }
}

async function getCourse(assetId, currency = "USD", kind = "avg", only_last=true, r=8){ // основная функция
    if (assetId !== "B3mFpuCTpShBkSNiKaVbKeipktYWufEMAEGvBAdNP6tu"){
        let price0;

        if (!assetId){
            price0 = 1;
        }
        else {
            price0 = await getAssetWavesCourse(assetId, kind);
        }

        let price1; // получаем цену WAVES к нужной нам монете:

        if (currency == "WAVES"){
            price1 = 1;
        }
        else {

            currency = currency.toLowerCase();
        
            let params = {
                "ids": "waves",
                "vs_currencies": currency
            };

            let response = await axios.get(PRICE_API1, {params});
            let result = response.data;

            let courses_waves = result["waves"];

            price1 = courses_waves[currency];
        }

        let price2 = price0 * price1;
        price2 = math.round(price2, r);
        if (only_last){
            return price2;
        }
        else {
            let data = {
                "last": price2
            }
            return data;
        }
    }
    else {
        let params = {currency, kind};
        let response = await axios.get(PRICE_API0, {params});
        let data = response.data;
        if (only_last){
            let price = math.round(data.last, r);
            return price;
        }
        else {
            for (key in data){
                if (data[key]){
                    data[key] = math.round(data[key], r);
                }
            }
            return data;
        }   
    }
}

module.exports = getCourse;