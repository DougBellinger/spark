var spark_mods = {
	loaded : 0,  
	mods : null, 
	currentMod: "#mod_Animator",
	currentCore: "Animator",
	loadedCallBack : function() {
		console.log("Loaded a module");
	},
	makeSelector: function(where, name, items, cfunc) {
		var s = "<select name='"+name+"' class='spark-select-"+name+"'>";
		var l = items.length;
		if (l==0) {
			s+= "<option class='pending'>Login to spark.io</option>";
		}
		for (var i = 0; i < l; i++) {
			s += "<option value='"+items[i]+"'>"+items[i]+"</option>";
		}
		s += "</select>";
		$(where).html(s);
		$(where+" select").selectmenu({ change : cfunc });
		$(where+" .ui-selectmenu-button").width("95%");
	},
	getCoreSelector : function(where, update) {
		var names = [];
		for (var key in spark.deviceName) {
			names.push(spark.deviceName[key]);
		} 
		spark_mods.makeSelector(where, "Core", names, update);
	},
	getFnSelector : function(where, core) {
		spark_mods.makeSelector(where, "Function", spark.device[core].functions, function() { console.log("fnSelector"); });
	},
	getSelectorVal : function (where) {
		return($(where).find(":selected").text());
	},
	setSelectorVal: function(where, name) {
		$(where + " select").val(name);
		$(where + " select").selectmenu("refresh");
		$(where + ' .ui-selectmenu-button').width("95%");
	},
	loadCurrent: function() {
		var content = localStorage.getItem(spark_mods.currentMod);
		if (content != undefined) {
			$(spark_mods.currentMod).html(content);
			spark_mods.refreshControls(true);
			$("#mod-mode-edit").prop("checked", true);
			$("#mod-mode-test").prop("checked", false);
			$("#mod-mode").buttonset("refresh");
		}
	},
	saveCurrent: function() {
		localStorage.setItem(spark_mods.currentMod, $(spark_mods.currentMod).html());
	},
	loadModFile : function(core) {
		$.get(core.options.file, { "_": $.now()}, function( data ) {
			console.log("loaded mod file:"+core.options.file);
			var item = "<li><a href='#mod_"+core.name+"'>"+core.name+"</a></li>";
			$("div#modules ul").append(item);
			$("div#modules").append("<div class=spark-mod-edit id='mod_"+core.name+"'>" +
								data +
								"</div>");
			$("div#modules").tabs("refresh");
			$("div#modules").tabs({active:1});
			spark_mods.loaded += 1;
		})
		.done(function(data) {
			console.log("loaded mod file:"+core.options.file);
			spark_mods.loadedCallback();
		})
		.fail(function(data) {
			console.log("failed loading mod file:"+core.options.file);
		});	
	},
	refreshControls: function (editMode) {
		spark_function_tool.refresh();
		spark_checkbox_tool.refresh();
		spark_slider_tool.refresh();
		$(".spark-move").addClass("ui-widget-content ui-corner-all ui-icon ui-icon-arrow-4");
		$(".spark-edit").addClass("ui-widget-content ui-corner-all ui-icon ui-icon-pencil");
		$(".spark-resize").addClass("ui-widget-content ui-corner-all ui-icon ui-icon-arrow-4-diag ui-resizable-handle ui-resizable-e");
		$(".spark-move").each(function(index) {
			$(this).css({position: "absolute", top: $(this).parent().height()+8+"px", left: "-8px"	});
		});
		$(".spark-edit").each(function(index) {
			$(this).css({position: "absolute", top: $(this).parent().height()+8+"px", left: $(this).parent().width()-8+"px"	});
		});
		$(".spark-resize").each(function(index) {
			$(this).css({position: "absolute", top: "-8px", left: $(this).parent().width()-8+"px"	});
		});
		$(".spark-control").draggable({
			handle : ".spark-move",
			grid: [ 20, 20 ],
			snap: true,
			snapMode: "outer",
			drag : function(event, ui) {
				$("#results").html("Move: "+ui.position.top+","+ui.position.left+"("+ui.offset.top+","+ui.offset.left+")");
			}
		});
		$(".spark-control.ui-resizable").resizable({
			handles:{"e":".spark-resize"}
		});
		$(".ui-resizable").on("resize", function(event, ui) {
				$(".spark-edit").each(function(index) {
				$(this).css({position: "absolute", top: $(this).parent().height()+8+"px", left: $(this).parent().width()-8+"px"	});
			});
			$(".spark-resize").each(function(index) {
				$(this).css({position: "absolute", top: "-8px", left: $(this).parent().width()-8+"px"	});
			});			
		});
		if (editMode) {
	    	 $(".spark-move").show();
	    	 $(".spark-edit").show();
	    	 $(".spark-resize").show();
	    	 if ($(".spark-control").draggable("instance")) {
	    		 $(".spark-control").draggable("enable");
	    		 $(".spark-button").attr("disabled", true);
	    	 } 
	    	 $("div.spark-slider").slider("disable");
	     }  
	     else {
	    	 $(".spark-move").hide();
	    	 $(".spark-edit").hide();	
	    	 $(".spark-resize").hide();
	    	 if ($(".spark-control").draggable("instance")) {
	    		 $(".spark-control").draggable("disable");
	    		 $(".spark-button").attr("disabled", false);
	    	 } 
	    	 $("div.spark-slider").slider("enable");
	    }
	},
	load : function(callback) {
		spark_mods.loadedCallback = callback;
		$("div#modules").tabs({ activate : function(event, ui) {
	        var active = $('div#modules').tabs('option', 'active');
	        spark_mods.currentMod =  $("div#modules ul>li a").eq(active).attr("href");
			$("#results").html('the tab id is ' + spark_mods.currentMod);	
	        }
		});
		$('#mod-save').on("click", spark_mods.saveCurrent);
		$('#mod-load').on("click", spark_mods.loadCurrent);
		$("#mod-mode" ).buttonset();
		$('#mod-mode input[type=radio]').change(function() {
			spark_mods.refreshControls(this.value == "edit");
		});
		$.getJSON( "mods/mods.json", { "_": $.now()},  function( data ) {
			spark_mods.mods = data;
			$.each( data.cores, function(index, core ) {
				console.log("mod for core:"+core.name);
				spark_mods.loadModFile(core);
			});

		})
		.done(function(data) {
			console.log("loaded mods");
		})
		.fail(function(data) {
			console.log("failed loading mods");
		});
	}
};