var express = require('express');
var router = express.Router();
var productHelper = require('../helper/product-helper');
var userHelper = require('../helper/user-helper');

const verifyLogin = (req, res, next) => {     //middleware - validity check
  if (req.session.loggedIn) {
    next()
  } else {
    res.redirect('/login')
  }
}

/* GET home page. */
router.get('/', function (req, res, next) {
  let user = req.session.user
  console.log(user);
  productHelper.getAllProducts().then((products) => {
    res.render('user/view-products', { products, user });

  })
});
router.get('/login', function (req, res) {
  if (req.session.loggedIn) {
    res.redirect('/')
  }
  else {
    res.render('user/login', { "loginErr": req.session.loginErr });
    req.session.loginErr = false
  }
});
router.get('/signup', function (req, res) {
  res.render('user/signup');
});
router.post('/signup', (req, res) => {
  userHelper.doSignup(req.body).then((response) => {
    console.log(response);
  })
})
router.post('/login', (req, res) => {
  userHelper.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.loggedIn = true       //saving the login details to session
      req.session.user = response.user
      res.redirect('/')
    } else {
      req.session.loginErr = "Invalid Login Attempt"       //saving the login details to session
      res.redirect('/login')
    }
  })
})
router.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})
router.get('/cart',verifyLogin,  (req, res) => {    //verifyLogin is a middleware
  res.render('user/cart')
})

module.exports = router;
