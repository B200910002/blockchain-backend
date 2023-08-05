const express = require('express');
const router = express.Router();
const userCtrl = require("../controller/user.controller")

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('user');
});

router.post('/setcookie', userCtrl.setCookie);

router.get('/getcookies', userCtrl.getCookies);

router.delete('/clearcookie', userCtrl.clearCookie);

module.exports = router;
