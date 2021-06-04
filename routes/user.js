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
router.get('/',async function (req, res, next) {
  let user = req.session.user
  let cartCount = null
  if(user)
    cartCount =await userHelper.getCartCount(req.session.user._id)
  productHelper.getAllProducts().then((products) => {
    res.render('user/view-products', { products, user, cartCount});

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
    req.session.loggedIn = true       //saving the login details to session
    req.session.user = response
    res.redirect('/')
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
router.get('/cart', verifyLogin, async (req, res) => {    //verifyLogin is a middleware
  let user = req.session.user
  let cartCount = null
  if(user)
    cartCount =await userHelper.getCartCount(req.session.user._id)

  let products =await userHelper.getCartProducts(req.session.user._id)
  res.render('user/cart',{products,user:req.session.user, cartCount})
})
router.get('/add-to-cart/:id', (req, res) => {    //we are using ajax in the coming function so no need to use middleware = verifyLogin
  userHelper.addToCart(req.params.id, req.session.user._id).then(() => {
    res.json({status:true})
  })
})
router.post('/change-product-quantity', (req, res,next) => {
  userHelper.changeProductQuantity(req.body).then(()=>{
    res.json({status:true})
  })
})
module.exports = router;
