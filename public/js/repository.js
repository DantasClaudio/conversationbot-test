exports.saveConversation = function(userID,conversationID,input,output) {
	
	var Cloudant = require('cloudant');
	 
	var username = process.env.cloudant_username;
	var password = process.env.cloudant_password;

	// Initialize the library with my account. 
	var cloudant = Cloudant({account:username, password:password});

		// Specify the database we are going to use (alice)... 
		var conversation = cloudant.db.use('conversations')
		
		
		// find conversation with user ID
		  conversation.get(userID, function(err, data) {
			
			// no conversation found for this user ID so create one
			 if (!data){ 
				var data = { _id: userID, conversations : [] }
				data.conversations.push({conversationID : conversationID, output : output, input : input });
				conversation.insert( data ,function(err, body, header) {
				  if (err) {
					return console.log('[saveConversation.insert] ', err.message);
				  }
				  console.log('*****************You have inserted the conversation.*****************');
				  console.log(body);
				});				
			}
			// conversation was founded so we must do the update			
			else {                 
				console.log("Data:", data);
				// keep a copy of the doc so we know its revision token
				doc = data;
				data.conversations.unshift({conversationID : conversationID,  output : output , input : input});
				conversation.insert( data ,function(err, body, header) {
				  if (err) {
					return console.log('[saveConversation.update] ', err.message);
				  }
				  console.log('*****************You have updated the conversation.*****************');
				  console.log(body);
				});
			}
			
		  });
};


