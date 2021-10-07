<p>Данная библиотека используется для отправки криптовалют Waves, Frigies и других ассетов на блокчейне Waves, а также получения последних транзакций и курсов криптовалют на блокчейне Waves, получения баланса кошелька.</p>
<p>Библиотека использует функции библиотеки @wavesplatform/waves-transactions, но делает более красивую обёртку над ними для более простого использования, а также в библиотеку добавлен ряд других полезных функций.</p>
<h1>Отправка транзакций:</h1>
<h2>Отправка Waves:</h2>
<pre>
sendWaves(seed, recipient, amount, attachment = "", feeAssetId = null, fee = 100000).then(tx => {
    console.log(tx);
});
</pre>
<p>seed (string) - ваша seed-фраза от кошелька Waves.Exchange</p>
<p>recipient (string) - адрес получателя</p>
<p>amount (int) - значение в сатошах</p>
<p>attachment (string) - описание к транзакции. Поддерживаются только латинские буквы, цифры, знаки подчёркивания и препинания.</p>
<p>feeAssetId (string) - id ассета, в котором будет оплачиваться комиссия. null - для оплаты в Waves.</p>
<p>fee (int) - значение комиссии в сатошах. По умолчанию 0.001 WAVES</p>
<br>
<p>tx (Object) - объект транзакции в случае успешной отправки следующего вида:</p>
<pre>
{
    type: 4,
    id: 'string', /* txid транзакции */
    sender: 'string', /* адрес отправителя */
    senderPublicKey: 'string', /* публичный ключ отправителя */
    fee: int, /* комиссия */
    feeAssetId: 'string' | null, /* ID ассета, в котором оплачивается комиссия */
    timestamp: int, /* время отправки - количество секунд, прошедших с 1 января 1970 года */
    proofs: [
      'Array of string'
    ],
    version: 2,
    recipient: 'string', /* получатель транзакции */
    assetId: 'string', /* ID ассета */
    amount: int, /* сумма */
    attachment: 'string', /* описание к транзакции в кодировке Base58 */
    height: int, /* высота блока */
    applicationStatus: 'string', /* статус транзакции */
}
</pre>
<h2>Отправка Frigies:</h2>
<pre>
sendFrigies(seed, recipient, amount, attachment = "", feeAssetId = null, fee = 100000).then(tx => {
    console.log(tx);
});
</pre>
<h2>Отправка другого ассета:</h2>
<pre>
sendAsset(seed, recipient, assetId, amount, attachment = "", feeAssetId = null, fee = 100000).then(tx => {
    console.log(tx);
});
</pre>
<p>assetId (string) - ID отправляемого ассета</p>
<h1>Получения последних 1000 транзакций:</h1>
<h2>Всех ассетов, включая Waves:</h2>
<pre>
getLastTransactions(address).then(transactions => {
    console.log(transactions);
});
</pre>
<p>address (string) - адрес кошелька</p>
<p>transactions (Array of Object) - массив объектов транзакции:</p>
<pre>
[
	{
	    type: 4,
	    id: 'string', /* txid транзакции */
	    sender: 'string', /* адрес отправителя */
	    senderPublicKey: 'string', /* публичный ключ отправителя */
	    fee: int, /* комиссия */
	    feeAssetId: 'string' | null, /* ID ассета, в котором оплачивается комиссия */
	    timestamp: int, /* время отправки - количество секунд, прошедших с 1 января 1970 года */
	    proofs: [
	      'Array of string'
	    ],
	    version: 2,
	    recipient: 'string', /* получатель транзакции */
	    assetId: 'string', /* ID ассета */
	    amount: int, /* сумма */
	    attachment: 'string', /* описание к транзакции в кодировке Base58 */
	    height: int, /* высота блока */
	    applicationStatus: 'succeeded', /* статус транзакции */
	    description: 'string' /* описание к транзакции в кодировке UTF8 (человекопонятное) */
	}
]
</pre>
<h2>Получить из последних 1000 транзакций только транзакции Waves:</h2>
<pre>
getLastTransactionsWaves(address).then(transactions => {
    console.log(transactions);
});
</pre>
<h2>Получить из последних 1000 транзакций только транзакции Frigies:</h2>
<pre>
getLastTransactionsFrigies(address).then(transactions => {
    console.log(transactions);
});
</pre>
<h2>Получить из последних 1000 транзакций только транзакции определённого ассета:</h2>
<pre>
getLastTransactionsAsset(address, assetId).then(transactions => {
    console.log(transactions);
});
</pre>
<p>assetId (string) - ID нужного ассета</p>
<h1>Получение балансов кошелька:</h1>
<h2>Получение баланса Waves:</h2>
<pre>
getWavesBalance(address).then(balance => {
    console.log(balance);
});
</pre>
<p>address (string) - адрес кошелька</p>
<p>balance (int) - баланс в сатошах</p>
<h2>Получение баланса Frigies:</h2>
<pre>
getFrigiesBalance(address).then(balance => {
    console.log(balance);
});
</pre>
<h2>Получение баланса другого ассета:</h2>
<pre>
getAssetBalance(assetId, address).then(balance => {
    console.log(balance);
});
</pre>
<p>assetId (string) - ID нужного ассета</p>
<h1>Получение курсов монет:</h1>
<h2>Получение средневзвешенного курса Waves по данным Cryptonator:</h2>
<pre>
getWavesCourse(currency).then(course => {
    console.log(course);
});
</pre>
<p>currency (string) - валюта, к которой нужно получить курс. Доступные варианты: "USD", "EUR", "RUB", "BTC", "XRP".</p>
<p>course (float) - текущий курс WAVES к USD, EUR, RUB, BTC или XRP.</p>
<h2>Получение курса Frigies:</h2>
<pre>
getFrigiesCourse(currency, kind).then(course => {
    console.log(course);
});
</pre>
<p>currency (string) - валюта, к которой нужно получить курс. Доступные варианты: "WAVES", "USD", "EUR", "RUB", "BTC", "XRP".</p>
<p>kind (string) - вид курса: "buy" - курс покупки, берётся из нижнего стакана; "sell" - курс продажи, берётся из верхнего стакана; "avg" - усредённый курс с учётом объёмов торгов.
<p>course (float) - текущий курс Frigies к WAVES, USD, EUR, RUB, BTC или XRP.</p>
<h2>Получение курса другого ассета:</h2>
<pre>
getAssetCourse(assetId, currency, kind).then(course => {
    console.log(course);
});
</pre>
<p>Если вы хотите поддержать автора данной библиотеки, вы можете отправить любое количество Frigies или Waves на следуюший адрес: <strong>3PMRMWbh5ZvEgdb8xw4LW1UZSAKq6v9sJ9W</strong></p>