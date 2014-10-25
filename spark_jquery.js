var spark = {
	baseUrl : "https://api.spark.io/",
	access_token : null, 
	test : function (data) {
		alert(data);
	},
	login : function(user, pass) {
			$.post(this.baseUrl+"oauth/token", {
	            username: user,
	            password: pass,
	            access_token: null,
	            grant_type: 'password',
	            client_id: 'spark-cli',
	            client_secret: "client_secret_here"
	        })
	        .done(function(data) {
	        	console.log("Loaded "+data);
	        	access_token = data.access_token;
	        })
	        .error(function(e) {
	        	alert("Error"+e);
	        });
	},
	getDevices : function(token) {
		$.get(this.baseUrl + "v1/devices", {
			access_token : token
		}, function(data, textStatus) {
			alert("Response from server: " + data);
		});
	}
};