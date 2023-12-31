const SHA256 = require("crypto-js/sha256");
const EC = require("elliptic").ec;
const ec = new EC("secp256k1");

class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
    this.timestamp = Date.now();
  }

  calcHash() {
    return SHA256(
      this.fromAddress + this.toAddress + this.amount + this.timestamp
    ).toString();
  }

  signTransaction(signingKey) {
    if (signingKey.getPublic("hex") !== this.fromAddress) {
      throw new Error("You cannot sign transactions for other wallets!");
    }

    if (this.fromAddress === this.toAddress) {
      throw new Error("You cannot transactions for our wallet!");
    }

    const hashTx = this.calcHash();
    const sig = signingKey.sign(hashTx, "base64");
    this.signature = sig.toDER("hex");
  }

  isValid() {
    if (this.fromAddress === null) return true;

    if (!this.signature || this.signature.length === 0) {
      throw new Error("No signature in this transaction");
    }

    const publicKey = ec.keyFromPublic(this.fromAddress, "hex");
    return publicKey.verify(this.calcHash(), this.signature);
  }
}

class Block {
  constructor(timestamp, transactions, previosHash = "") {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previosHash = previosHash;
    this.hash = this.calcHash();
    this.nonce = 0;
  }

  calcHash() {
    return SHA256(
      this.timestamp +
        JSON.stringify(this.transactions) +
        this.previosHash +
        this.nonce
    ).toString();wallet
  }

  mineBlock(difficulty) {
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
    ) {
      this.nonce++;
      this.hash = this.calcHash();
    }
    for (const trans of this.transactions) {
      let from = trans.fromAddress + "";
      let to = trans.toAddress + "";
      let amount = trans.amount + "";
      console.log(
        "    Time: " + this.timestamp,
        "    From: " + from.slice(0, 10),
        "    To: " + to.slice(0, 10),
        "    Amount: " + amount.slice(0, 10)
      );
    }
    let hash = this.hash + "";
    let pre = this.previosHash + "";
    let nonce = this.nonce + "";
    console.log(
      "Block: " + hash.slice(0, 10),
      "\nPrevios: " + pre.slice(0, 10),
      "\nNonce: " + nonce.slice(0, 10)
    );
  }

  hasValidTransactions() {
    for (const tx of this.transactions) {
      console.log(tx.isValid());
      if (!tx.isValid()) {
        return false;
      }
    }
    return true;
  }
}

class BlockChain {
  constructor() {
    this.chain = [this.createGenBlock()];
    this.difficulty = 2;
    this.pendingTransactions = [];
    this.miningReward = 100;
  }

  createGenBlock() {
    return new Block(Date.now(), [], "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  minePendingTransactions(miningRewardAddress) {
    const rewardTx = new Transaction(
      null,
      miningRewardAddress,
      this.miningReward
    );
    this.pendingTransactions.push(rewardTx);

    let block = new Block(
      Date.now(),
      this.pendingTransactions,
      this.getLatestBlock().hash
    );
    block.mineBlock(this.difficulty);

    console.log("Block successfully mined!");
    this.chain.push(block);

    this.pendingTransactions = [];
  }

  addTransaction(transaction) {
    if (!transaction.fromAddress || !transaction.toAddress) {
      throw new Error("Transaction must be include from and to address");
    }

    if (!transaction.isValid()) {
      throw new Error("Cannot add invalid transaction to chain");
    }

    const walletBalance = this.getBalanceOfAddress(transaction.fromAddress);
    if (walletBalance < transaction.amount) {
      throw new Error("Not enough balance");
    }

    const walletBalanceOfPendingTransactions = this.getBalanceOfPendingTransactions(transaction.fromAddress, this.pendingTransactions);
    if (walletBalanceOfPendingTransactions < transaction.amount) {
      throw new Error("Not enough balance");
    }

    this.pendingTransactions.push(transaction);
    // this.miningReward = this.calcPercent();
  }

  getBalanceOfAddress(address) {
    let balance = 0;

    for (const block of this.chain) {
      for (const trans of block.transactions) {
        if (trans.fromAddress === address) {
          balance -= trans.amount;
        }

        if (trans.toAddress === address) {
          balance += trans.amount;
        }
      }
    }

    return balance;
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previosBlock = this.chain[i - 1];

      if (!currentBlock.hasValidTransactions()) {
        return false;
      }

      if (currentBlock.hash !== currentBlock.calcHash()) {
        return false;
      }

      if (currentBlock.previosHash !== previosBlock.hash) {
        return false;
      }
      return true;
    }
  }

  calcPercent() {
    let result = 0;
    for (const trans of this.pendingTransactions) {
      result = result + trans.amount * 0.0000001;
    }
    return result;
  }

  getBalanceOfPendingTransactions(address, transactions){
    let balance = this.getBalanceOfAddress(address);

    for(const trans of transactions) {
      if(trans.fromAddress == address) {
        balance -= trans.amount;
      }
    }

    return balance;
  }
}

module.exports.Block = Block;
module.exports.BlockChain = BlockChain;
module.exports.Transaction = Transaction;
