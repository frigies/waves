const axios = require("axios");
const Base58 = require("@interop/base58-universal");
const wavesTransactions = require('@waves/waves-transactions');

const { transfer } = wavesTransactions;
const { broadcast } = wavesTransactions;

const nodeURL = 'https://nodes.wavesplatform.com';

const getCourse = require("./getCourse");
const { fromSatoshi } = require('./helpers');
const { toSatoshi } = require('./helpers');

function Base58toUTF8(text) {
    const decoded = Base58.decode(text);
    const output = new TextDecoder().decode(decoded);
    return output;
}

function UTF8toBase58(text) {
    const input = new TextEncoder().encode(text);
    const encoded = Base58.encode(input);
    return encoded;
}

async function getLastTransactions(address){
    let urlRequest = `https://nodes.wavesplatform.com/transactions/address/${address}/limit/1000`;

    let response = await axios.get(urlRequest);

    let data = response.data;

    let result = [];

    data.forEach(transactions => {
        transactions.forEach(transaction => {
            if ((transaction.type === 4) && (transaction.recipient === address)){
                if (transaction.attachment){
                    let description = Base58toUTF8(transaction.attachment);
                    transaction.description = description;
                }
                else {
                    transaction.description = "";
                }
                result.push(transaction);
            }
        });
    });

    return result;    
}

async function getLastTransactionsWaves(address){
    let transactions = await getLastTransactions(address);
    let result = transactions.filter(transaction => (!transaction.assetId));
    return result;
}

async function getLastTransactionsFrigies(address){
    const assetId = "B3mFpuCTpShBkSNiKaVbKeipktYWufEMAEGvBAdNP6tu";
    let transactions = await getLastTransactions(address);
    let result = transactions.filter(transaction => (transaction.assetId === assetId));
    return result;
}

async function getLastTransactionsAsset(address, assetId){
    let transactions = await getLastTransactions(address);
    let result = transactions.filter(transaction => (transaction.assetId === assetId));
    return result;
}


async function sendWaves(seed, recipient, amount, attachment = "", feeAssetId = null, fee = 100000){
    const tx = {
        amount: amount,
        recipient: recipient,
        assetId: null,
        feeAssetId: feeAssetId,
        fee: fee,
    };
    if (attachment){
        tx.attachment = UTF8toBase58(attachment);
    }
    
    const signedTransferTx = transfer(tx, seed);

    let response = await broadcast(signedTransferTx, nodeURL);
    
    return response;
    
}

async function sendFrigies(seed, recipient, amount, attachment = "", feeAssetId = null, fee = 100000){
    const assetId = "B3mFpuCTpShBkSNiKaVbKeipktYWufEMAEGvBAdNP6tu";
    return await sendAsset(seed, recipient, assetId, amount, attachment, feeAssetId, fee);   
}

async function sendAsset(seed, recipient, assetId, amount, attachment = "", feeAssetId = null, fee = 100000){
    const tx = {
        amount: amount,
        recipient: recipient,
        assetId: assetId,
        feeAssetId: feeAssetId,
        fee: fee,
    };
    if (attachment){
        tx.attachment = UTF8toBase58(attachment);
    }
    
    const signedTransferTx = transfer(tx, seed);

    let response = await broadcast(signedTransferTx, nodeURL);
    
    return response;
}

async function getWavesCourse(currency){
    return await getCourse(null, currency);
}

async function getFrigiesCourse(currency, kind, only_last=true, r=4){
    const assetId = "B3mFpuCTpShBkSNiKaVbKeipktYWufEMAEGvBAdNP6tu";
    return await getCourse(assetId, currency, kind, only_last, r);    
}

async function getWavesBalance(address) {
    let url = `https://nodes.wavesplatform.com/addresses/balance/${address}`;
    let response = await axios.get(url);
    let data = response.data;
    let balance = data.balance;
    return balance;
}

async function getFrigiesBalance(address){
    const assetId = "B3mFpuCTpShBkSNiKaVbKeipktYWufEMAEGvBAdNP6tu";
    let balance = await getAssetBalance(assetId, address);
    return balance;
}

async function getAssetBalance(assetId, address){
    let url = `https://nodes.wavesplatform.com/assets/balance/${address}/${assetId}`;
    let response = await axios.get(url);
    let data = response.data;
    let balance = data.balance;
    return balance;
}

module.exports.getLastTransactions = getLastTransactions;
module.exports.getLastTransactionsWaves = getLastTransactionsWaves;
module.exports.getLastTransactionsFrigies = getLastTransactionsFrigies;
module.exports.getLastTransactionsAsset = getLastTransactionsAsset;

module.exports.sendWaves = sendWaves;
module.exports.sendFrigies = sendFrigies;
module.exports.sendAsset = sendAsset;

module.exports.getAssetCourse = getCourse;
module.exports.getWavesCourse = getWavesCourse;
module.exports.getFrigiesCourse = getFrigiesCourse;

module.exports.getAssetBalance = getAssetBalance;
module.exports.getWavesBalance = getWavesBalance;
module.exports.getFrigiesBalance = getFrigiesBalance;