const express = require("express");
const router = express.Router();
const userCtrl = require("../controller/user.controller")
const blockchainCtrl = require("../controller/blockchain.controller");

//get
router.get("/", blockchainCtrl.initialize);
router.get("/blocks", blockchainCtrl.getAllBlocks);
router.get("/balance", userCtrl.protect ,blockchainCtrl.getBalanceOfAddress);

// post
router.post("/create/transaction", userCtrl.protect, blockchainCtrl.createNewTransaction);
router.post("/create/block", userCtrl.protect, blockchainCtrl.createNewBlock);

//put
// router.put("/update_name", blockchainCtrl.updateName);

//delete
router.delete("/delete/all", blockchainCtrl.deleteAll);

module.exports = router;
