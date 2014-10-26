var spark = {
	baseUrl : "https://api.spark.io/",
	access_token : localStorage.sparkAccessToken,
	devices : localStorage.devices,
	device : [ ], 
	username : "none",
	login : function(user, pass, callback) {
			$("#results").html("Logging in...");
			spark.username = user;
			$.post(this.baseUrl+"oauth/token", {
	            username: user,
	            password: pass,
	            access_token: null,
	            grant_type: 'password',
	            client_id: 'spark-cli',
	            client_secret: "client_secret_here"
	        })
	        .done(function(data) {
	        	console.log("Loaded "+data.responseText);
	        	spark.access_token = data.access_token;
	        	localStorage.sparkAccessToken = data.access_token;
	        	$("#results").html("User: "+ spark.username + " logged in.<br>"+spark.access_token);
	        	callback();
	        })
	        .fail(function(e) {
	        	$("#results").html(e.responseText);
	        });
	},
	getDevices : function( callback) {
		$.get(spark.baseUrl + "v1/devices", { access_token : spark.access_token }, 
		function(data, textStatus) {
			$("#results").html("Got Devices: " + textStatus);
			spark.devices = data;
			localStorage.devices = spark.devices;
			callback();
		});
	},
	getDevice : function(id, callback) {
		$.get(spark.baseUrl+"v1/devices/"+id, { access_token: spark.access_token 
		})
		.done(function(data, textStatus) {
			spark.device[data.name] = data;
			callback(data);
		})
		.fail(function(e) {
			$("#results").html(e.responseText);
		});
	},
	getVariable : function(devName, vname, callback) {
		$.get(spark.baseUrl+"v1/devices/"+spark.device[devName].id+"/"+vname, { access_token: spark.access_token 
		})
		.done(function(data, textStatus) {
			callback(devName, data);
		})
		.fail(function(e) {
			$("#results").html(e.responseText);
		});		
	},
	callFunction : function(devName, vname, argString, callback) {
		$.post(spark.baseUrl+"v1/devices/"+spark.device[devName].id+"/"+vname, { 
			access_token: spark.access_token,
			args : argString
		})
		.done(function(data, textStatus) {
			callback(devName, vname, textStatus);
		})
		.fail(function(e) {
			$("#results").html(e.responseText);
		});		
	}
};








