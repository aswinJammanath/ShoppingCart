var express = require('express');
var router = express.Router();
var productHelper = require('../helper/product-helper');

/* GET home page. */
router.get('/', function (req, res, next) {
  
  productHelper.getAllProducts().then((products)=>{
    res.render('user/view-products', { admin: false, products });

  })
});
router.get('/login', function (req, res) {
    res.render('user/login');
});
router.get('/signup', function (req, res) {
  res.render('user/signup');
});

module.exports = router;
