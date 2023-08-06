const SHA256 = require("crypto-js/sha256");
const EC = require("elliptic").ec;
const ec = new EC("secp256k1");

const { Block, Transaction, BlockChain } = require("../service/blockchain.service");

let coin = new BlockChain();
const system = SHA256("system").toString();
const systemKey = ec.keyFromPrivate(system);
const systemWallet = systemKey.getPublic("hex");
coin.minePendingTransactions(systemWallet);
exports.coin = coin

exports.initialize = async (req, res, next) => {
  try {
    res.status(200).json(coin);
  } catch (err) {
    res.status(400).json(err.message);
  }
};

exports.getAllBlocks = async (req, res, next) => {
  try {
    res.status(200).json(coin.chain);
  } catch (err) {
    res.status(400).json(err.message);
  }
};

exports.createNewTransaction = async (req, res, next) => {
  try {
    const { toAddress, amount } = req.body;

    const hashedFromAddress = SHA256(req.cookies.username).toString();
    const key1 = ec.keyFromPrivate(hashedFromAddress);
    const wallet1 = key1.getPublic("hex");

    const hashedToAddress = SHA256(toAddress).toString();
    const key2 = ec.keyFromPrivate(hashedToAddress);
    const wallet2 = key2.getPublic("hex");

    const tx = new Transaction(wallet1, wallet2, amount);
    tx.signTransaction(key1);
    coin.addTransaction(tx);

    res.status(200).json("transaction successfully!");
  } catch (err) {
    // next(err);
    res.status(400).json(err.message);
  }
};

exports.createNewBlock = async (req, res, next) => {
  try {
    const address = req.cookies.username;

    const hashedAddress = SHA256(address).toString();
    const key = ec.keyFromPrivate(hashedAddress);
    const wallet = key.getPublic("hex");

    coin.minePendingTransactions(wallet);
    res.status(200).json("block mine successfully!");
  } catch (err) {
    // next(err);
    res.status(400).json(err.message);
  }
};

exports.transactionIsValid = async (req, res, next) => {
  try {
    if (coin.chain) res.status(200).json(1);
    else res.status(200).json(0);
  } catch (err) {
    res.status(400).json(err.message);
  }
};

exports.blockchainIsValid = async (req, res, next) => {
  try {
    if (coin.isChainValid) res.status(200).json(1);
    else res.status(200).json(0);
  } catch (err) {
    res.status(400).json(err.message);
  }
};

exports.getBalanceOfAddress = async (req, res, next) => {
  try {
    const address = req.cookies.username;

    const hashedAddress = SHA256(address).toString();
    const key = ec.keyFromPrivate(hashedAddress);
    const wallet = key.getPublic("hex");

    const balance = coin.getBalanceOfAddress(wallet);

    res.status(200).json(balance);
  } catch (err) {
    res.status(400).json(err.message);
  }
};

exports.deleteAll = async (req, res, next) => {
  try {
    coin = new BlockChain();
    coin.minePendingTransactions(myWallet);
    res.status(200).json("block chain all deleted!");
  } catch (err) {
    res.status(400).json(err.message);
  }
};
