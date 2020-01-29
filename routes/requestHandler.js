const fs = require('fs');
const config = require('../config');
const twitter = require('../lib/twitter');

/*checking from session weather user is looged in or not*/
function isLoggedIn(req, res, next) {

    if (req.isAuthenticated())
        return next();

    res.redirect('/app');
}


module.exports=function(app,express,passport){
  var api=express.Router();

/*landing page api*/
  api.get('/app',async function(req,res){
    try {
  	res.render('index');
    }catch (err) {
         res.header("Content-Type",'application/json');
         res.send(JSON.stringify({'message':'something went wrong'}, null, 4));
    }
  })

  /*intiating request to twiiter for login*/
  api.get('/auth/twitter', passport.authenticate('twitter'))

  /*callback from twitter*/
  api.get('/auth/twitter/callback',
        passport.authenticate('twitter', {
            failureRedirect : '/app'
        }), async function(req, res){
          try {
          /*getting followers from twitter api and storing into a json file*/
          await twitter.getFollowers(req.user);
          return res.redirect('/app/followers');
          }catch (err) {
         res.header("Content-Type",'application/json');
        res.send(JSON.stringify({'message':'something went wrong'}, null, 4));
      }
        });

  /*followers page api*/
  api.get('/app/followers', isLoggedIn, async function(req,res){
    try {
    var followers = JSON.parse(fs.readFileSync('./result/'+req.user+'/followers.json'));
    res.render('followers', {followers: followers.users});
    }catch (err) {
         res.header("Content-Type",'application/json');
         res.send(JSON.stringify({'message':'something went wrong'}, null, 4));
    }
  })

  /*rendring calculated json file*/
  api.get('/app/followers/*/*', isLoggedIn, async function(req,res){
    
  try {

  var twubric = JSON.parse(fs.readFileSync('./result/'+req.params[0]+'/twubric.json'));

    if(twubric){

        res.header("Content-Type",'application/json');
        res.send(JSON.stringify(twubric, null, 4));
    }else{
      res.header("Content-Type",'application/json');
      res.send(JSON.stringify({'message':'invalid parameters'}, null, 4));
      
    }
  	
    }catch (err) {
      res.header("Content-Type",'application/json');
      res.send(JSON.stringify({'message':'something went wrong'}, null, 4));
    }

  })

  return api;


}