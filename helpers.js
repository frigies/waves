const math = require("mathjs");

const SATOSHI = 100000000; // в одной монете 100 миллионов сатоши

function fromSatoshi(value, round = false){ // вспомогательная функция для перевода сатошей в монету. Можно обойтись и без неё
    let result = value / SATOSHI;
    if (round === false){
        return result;
    }
    else {
        return math.round(result, round);
    }
}

function toSatoshi(value){
    let result = parseInt(value * SATOSHI);
    return result;
}

// вспомогательная функция для получения текушего времени в секундах или миллисекундах, прошедших с 1 января 1970 года:
function time(milliseconds = false){ // по умолчанию в секундах. Если передать true, то в миллисекундах
    let date = new Date(); // создаём объект с текущей датой и при помощи функции getTime вытаскиваем количество миллисекунд
    let time = date.getTime();
    if (milliseconds){ // если нам нужны миллисекунды, то так и возвращаем
        return time;
    }
    else { // иначе делим на 1000
        return parseInt(time / 1000);
    }
}

module.exports.fromSatoshi = fromSatoshi;
module.exports.toSatoshi = toSatoshi;
module.exports.time = time;