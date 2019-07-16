var express = require('express');
var router = express.Router();
const User = require('./users').blogs;
const Login = require('./users').Login;
const passport = require('passport');
const localStrategy = require('passport-local');


passport.use(new localStrategy(Login.authenticate()));

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

router.get('/create', isLoggedIn , function(req, res){
  res.render('create');
})

router.get('/login', function(req, res){
  res.render('login');
})

router.get('/welcome', isLoggedIn ,function(req,res){
  res.render('welcome');
})

router.post('/login', passport.authenticate('local',{
  successRedirect:'/welcome',
  failureRedirect:'/login'
}), function(req, res){
 })

 router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/login');
})

router.get('/register', function(req,res){
  res.render('register');
})

router.post('/register', function(req, res){
  let data = new Login({
    username: req.body.username,
    email: req.body.email,
  })
  Login.register(data,req.body.password)
  .then(function(createdData){
    passport.authenticate('local')(req,res,function(){
      res.send('successfully logged in!<a href="/logout">log me out</a>');
    })
  })
})

router.post('/createblog',function(req,res){
  const newBlog = new User({
    blog: req.body.msg
  });

  newBlog.save()
    .then( data => res.send(`${data} <a href="/showall">Show All</a>`) )
    .catch( err => console.log(err));
})

router.get('/showall', function(req, res){
  User.find()
      .then(data => res.render('showall', {data:data}))
      .catch(err => console.log(err));
})

router.get('/delete/:id', isLoggedIn, function(req,res){
  User.findOneAndRemove({_id: req.params.id})
          .then(data => res.redirect('/showall'))
          .catch( err => console.log(err));
})

router.get('/update/:id', isLoggedIn, function(req,res){
  res.render('update', {id: req.params.id})
})

router.post('/update/:id', isLoggedIn, function(req,res){
  User.findOneAndUpdate({_id: req.params.id},{$set:{blog: req.body.updateBlog}}, {new: true})
    .then( data => res.redirect('/showall'))
    .catch( err => console.log(err));
})

function isLoggedIn(req,res,next){
if(req.isAuthenticated()) return next();
res.redirect('/login');
}

module.exports = router;
