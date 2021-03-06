var spark = {
	baseUrl : "https://api.spark.io/",
	access_token : localStorage.sparkAccessToken,
	devices : (localStorage.devices == undefined) ? [] : localStorage.devices,
	device : [], //(localStorage.device == undefined) ? [] : localStorage.device,
	deviceName : [], // (localStorage.deviceName == undefined) ? [] : localStorage.deviceName,
	username : "none",
	source : null,
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
	        	$("#results").html("Error:"+e.responseText);
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
			$("#results").html("Got Device:"+data.name);
			spark.device[data.name] = data;
			spark.deviceName[id] = data.name;
			localStorage.device = spark.device;
			localStorage.deviceName = spark.deviceName;
			callback(data);
		})
		.fail(function(e) {
			$("#results").html("Error: "+e.responseText);
		});
	},
	getVariable : function(devName, vname, callback) {
		$.get(spark.baseUrl+"v1/devices/"+spark.device[devName].id+"/"+vname, { access_token: spark.access_token 
		})
		.done(function(data, textStatus) {
			$("#results").html("Variable "+vname+" returned "+data.result);
			callback(devName, data);
		})
		.fail(function(e) {
			$("#results").html("Error:"+e.responseText);
		});		
	},
	callFunction : function(devName, vname, argString, callback) {
		$.post(spark.baseUrl+"v1/devices/"+spark.device[devName].id+"/"+vname, { 
			access_token: spark.access_token,
			args : argString
		})
		.done(function(data, textStatus) {
			$("#results").html("Function "+vname+" returned "+textStatus);
			callback(devName, vname, data.return_value, textStatus);
		})
		.fail(function(e) {
			$("#results").html(e.responseText);
		});		
	},
	subscribeEvents : function(callback) {
		if (typeof(EventSource) == "undefined") {
		    $("#results").html("Events disabled.")
		    return;
		}
		var url = spark.baseUrl+"v1/devices/events/?access_token="+spark.access_token;
		spark.source = new EventSource(url);
		spark.source.addEventListener("message", callback);
	}
};








