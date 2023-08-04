const { Block, Transaction, BlockChain } = require("../model/Blockchain.model");
const EC = require("elliptic").ec;
const ec = new EC("secp256k1");
let coin = new BlockChain();
const myKey = ec.keyFromPrivate(
  "9d2ae321496d68f58ee47a046a4d17419cbe480f109cb7f6f9644412f4a5895c"
);
const myWallet = myKey.getPublic("hex");
coin.minePendingTransactions(myWallet);

exports.initialize = async (req, res, next) => {
  try {
    res.status(200).json(coin);
  } catch (err) {
    // next(err);
    res.status(201).json(err.message);
  }
};

exports.getAllBlocks = async (req, res, next) => {
  try {
    res.status(200).json(coin.chain);
  } catch (err) {
    // next(err);
    res.status(201).json(err.message);
  }
};

exports.createNewTransaction = async (req, res, next) => {
  try {
    const { fromAddress, toAddress, amount } = req.body;

    const key1 = ec.keyFromPrivate(fromAddress);
    const wallet1 = key1.getPublic("hex");

    const key2 = ec.keyFromPrivate(toAddress);
    const wallet2 = key2.getPublic("hex");

    const tx = new Transaction(wallet1, wallet2, amount);
    tx.signTransaction(key1);
    coin.addTransaction(tx);

    res.status(200).json("transaction successfully!");
  } catch (err) {
    // next(err);
    res.status(201).json(err.message);
  }
};

exports.createNewBlock = async (req, res, next) => {
  try {
    coin.minePendingTransactions(myWallet);
    res.status(200).json("block mine successfully!");
  } catch (err) {
    // next(err);
    res.status(201).json(err.message);
  }
};

exports.transactionIsValid = async (req, res, next) => {
  try {
    if (coin.chain) res.status(200).json(1);
    else res.status(200).json(0);
  } catch (err) {
    next(err);
  }
};

exports.blockchainIsValid = async (req, res, next) => {
  try {
    if (coin.isChainValid) res.status(200).json(1);
    else res.status(200).json(0);
  } catch (err) {
    next(err);
  }
};

exports.getBalanceOfAddress = async (req, res, next) => {
  try {
    const { address } = req.body;

    // const key = ec.keyFromPrivate(address);
    // const wallet = key.getPublic("hex");

    const balance = coin.getBalanceOfAddress(address);

    res.status(200).json(balance);
  } catch (err) {
    next(err);
  }
};

exports.deleteAll = async (req, res, next) => {
  try {
    coin = new BlockChain();
    coin.minePendingTransactions(myWallet);
    res.status(200).json("block chain all deleted!");
  } catch (err) {
    next(err);
  }
};
