const config=require('../config');
const twubric = require('./twubric');
const httpRequest = require('request');
const fs = require('fs');



var twitterQueries = {
    	/*getting followers from twiiter*/
		getFollowers: function (user) {

            return new Promise((resolve, reject) => {
            
            httpRequest({
			  url: 'https://api.twitter.com/1.1/followers/list.json?user_id='+user.id+'',
			  headers: {
			     'Authorization': 'Bearer '+config.twitter_access_token+''
			  }
			}, function(err, res) {
			      if(err) {
			        return reject(err);
			      } else {

			      	var followers = JSON.parse(res.body);
			      	/*function for calculatiing twubric*/
			      	twubric.calculateTwubric(followers);

			      	var dir = './result/'+user.id+'/';
					if (!fs.existsSync(dir)){
					    fs.mkdirSync(dir);

					}
	               
	               	var string = JSON.stringify(followers);
					fs.writeFileSync(''+dir+'followers.json', string);
					return resolve(true);
			      }

			});
			             
		})
        }

};
module.exports = twitterQueries;