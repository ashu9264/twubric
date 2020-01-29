const fs = require('fs');


/*geeting max value of friends, followers, favourites, listed, statuses among the all followers*/

async function getBaseValues(data){

	var object = {};

	var internal = {};

	object.max_friends_count = Math.max.apply(Math, 
		data.users.map(function(values) { 
			return values.friends_count; 
		}));

	object.max_followers_count = Math.max.apply(Math, 
		data.users.map(function(values) { 
			return values.followers_count; 
		}));

	object.max_favourites_count = Math.max.apply(Math, 
		data.users.map(function(values) { 
			return values.favourites_count; 
		}));
	object.max_listed_count = Math.max.apply(Math, 
		data.users.map(function(values) { 
			return values.listed_count; 
		}));

	object.max_statuses_count = Math.max.apply(Math, 
		data.users.map(function(values) { 
			return values.statuses_count; 
		}));

	return object;
	
}


var twubric = {
    	/*twubric calculation */
		calculateTwubric: async function (data) {
			
			var base_values = await getBaseValues(data);
			var object = {};
			
			Promise.all(data.users.map(async values => {

				object.id = values.id;
				object.name = values.name;
				object.screen_name = values.screen_name;
				object.location = values.location;
				object.followers_count = values.followers_count;
				object.friends_count = values.friends_count;
				object.listed_count = values.listed_count;
				object.favourites_count = values.favourites_count;
				object.statuses_count = values.statuses_count;
				object.created_at = values.created_at;
				object.verified = values.verified;

				/* influence and friends calculation using linear equation


				(minimum of weightage-maximum of weightage) / (minimum of count among all followers - maximum of count among all followers)*actual count of follower


				*/

				var followers_influence = base_values.max_followers_count == 0 && values.followers_count == 0 ? 0 : ((0-4)/(0-base_values.max_followers_count)*values.followers_count);

				var favourites_influence = base_values.max_favourites_count == 0 && values.favourites_count == 0 ? 0 : ((0-4)/(0-base_values.max_favourites_count)*values.favourites_count);

				var listed_influence = base_values.max_listed_count == 0 && values.listed_count == 0 ? 0 : ((0-4)/(0-base_values.max_listed_count)*values.listed_count);

				var statuses_influence = base_values.max_statuses_count == 0 && values.statuses_count == 0 ? 0 : ((0-4)/(0-base_values.max_statuses_count)*values.statuses_count);

				var isVerified = values.verified ? 4 : 0;

				object.twubric = {};

				object.twubric.friends = base_values.max_friends_count == 0 && values.friends_count == 0 ? 0 : parseFloat(((0-2)/(0-base_values.max_friends_count))*values.friends_count).toFixed(2);

				object.twubric.influence = parseFloat((followers_influence + favourites_influence + listed_influence + statuses_influence + isVerified)/5).toFixed(2);

				object.twubric.total = (parseFloat(object.twubric.friends) + parseFloat(object.twubric.influence)).toFixed(2);

				
				var dir = './result/'+values.id+'/';
				if (!fs.existsSync(dir)){
				    fs.mkdirSync(dir);

				}
               
               	var string = JSON.stringify(object);
				fs.writeFileSync(''+dir+'twubric.json', string);

                })).then(() => {

                return true;
                    
              });
            
        }

};
module.exports = twubric;