var spark_function_tool = {
	edit : undefined,
	fn : undefined,
	label : undefined,
	args : undefined, 
	core :undefined,
	form : "<div id='spark-fn-dialog' class='spark-dialog' title='Function Call'>" 
			+ "<div class='spark-dialog-container'>"
			+ "<div class='spark-dialog-main'>"
			+ "<label>Label</label>" 
			+ "<input class='label' type='text'/>"
			+ "<label>Core</label>"
			+ "<div class='spark-select' id='spark-fn-core-selector'></div>"
      	+ "<label>Function</label>"
			+ "<div class='spark-select' id='spark-fn-fn-selector'></div>"  
			+ "<label>Arguments</label>"  
			+ "<input class='args' type='text'/>"
			+ "</div></div></div>",
	tool_button : "<div class='spark-tool'><button id='spark-add-function'>Function</button></div>",
	setButtonAttributes : function(b) {
		$(b).attr("spark-core", spark_function_tool.core);		
		$(b).attr("spark-function", spark_function_tool.fn);
		$(b).attr("spark-label", spark_function_tool.label);
		$(b).attr("spark-args", spark_function_tool.args);
		$(b).find(".ui-button-text").text(spark_function_tool.label);
	},
	getButtonAttributes : function(b) {
		spark_function_tool.core = $(b).attr("spark-core");		
		spark_function_tool.fn = $(b).attr("spark-function");
		spark_function_tool.label = $(b).attr("spark-label");
		spark_function_tool.args = $(b).attr("spark-args");
	},
	getDialogAttributes : function() {
		spark_function_tool.label = $("#spark-fn-dialog .label").val();
		spark_function_tool.core  = spark_mods.getSelectorVal("#spark-fn-core-selector");
		spark_function_tool.fn  = spark_mods.getSelectorVal("#spark-fn-fn-selector");
		spark_function_tool.args  = $("#spark-fn-dialog .args").val();
	},
	setDialogAttributes : function() {
		console.log("editing..."+spark_function_tool.label+":"+spark_function_tool.fn+"("+spark_function_tool.args+")");
		spark_mods.setSelectorVal("#spark-fn-core-selector", spark_function_tool.core);
		spark_mods.getFnSelector("#spark-fn-fn-selector", spark_function_tool.core);
		spark_mods.setSelectorVal("#spark-fn-fn-selector", spark_function_tool.fn);
		$("#spark-fn-dialog .label").val(spark_function_tool.label);
		$("#spark-fn-dialog .args").val(spark_function_tool.args);
	},
	initialize : function(target_div, toolbar_div) {
		$(target_div).append(this.form);
		$("#spark-fn-dialog").dialog(
				{
					autoOpen : false,
					width : "auto",
					height : "auto",
					buttons : [
							{
								text : "Add",
								id : "add-fn-add",
								click : function() {
									spark_function_tool.getDialogAttributes();
									var newButton = "<div class='spark-control spark-control-function'>"
											+ "<button class='spark-editing spark-button spark-call-core-function'>"+spark_function_tool.label+"</button>"
											+ "<div class='spark-move'></div><div class='spark-edit'></div></div>";
									$(spark_mods.currentMod).append(newButton);
									spark_function_tool.setButtonAttributes($(".spark-editing"));
									$(".spark-editing").button();
									$(".spark-editing").removeClass("spark-editing");
									spark_mods.refreshControls(true);
									$(this).dialog("close");
								} }, 
							{ 
								text : "Edit", 
								id : "add-fn-edit",
								click : function() {
									spark_function_tool.getDialogAttributes();
									spark_function_tool.setButtonAttributes(spark_function_tool.edit);
									spark_mods.refreshControls(true);
									$(this).dialog("close");
								}
							},
							{ 
								text : "Delete", 
								id : "add-fn-delete",
								click : function() {
									$(spark_function_tool.edit).parent().remove();
									$(this).dialog("close");
								}
							}] });
		$("select").selectmenu();
		$("#spark-fn-dialog .ui-selectmenu-button").width("95%");
		$(toolbar_div).append(this.tool_button);
		$("button").button();
		$("#spark-add-function").on("click", function(e) {
			spark_mods.getCoreSelector("#spark-fn-core-selector", function() {
				spark_mods.getFnSelector("#spark-fn-fn-selector", spark_mods.getSelectorVal("#spark-fn-core-selector")); 
			});
			spark_mods.getFnSelector("#spark-fn-fn-selector", spark_mods.getSelectorVal("#spark-fn-core-selector"));
			$("#add-fn-edit").button("disable");
			$("#add-fn-delete").button("disable");
			$("#add-fn-add").button("enable");
			$("#spark-fn-dialog").dialog("option", "position", { my : "left-10 top-10", of : e, collision : "fit" });
			$("#spark-fn-dialog").dialog("open");
		});
	},
	refresh: function() {
		spark_mods.getCoreSelector("#spark-fn-core-selector", function() {
			spark_mods.getFnSelector("#spark-fn-fn-selector", spark_mods.getSelectorVal("#spark-fn-core-selector")) 
		});
		spark_mods.getFnSelector("#spark-fn-fn-selector", spark_mods.getSelectorVal("#spark-fn-core-selector"));
		$("button.spark-call-core-function").unbind();
		$("button.spark-call-core-function").click(function() {
			var b = this;
			$(this).addClass('pending');
			var args = $(this).attr("spark-args");
			var fn = $(this).attr("spark-function");
			var core = $(this).attr("spark-core")
			var message = "Calling function "+fn+"("+args+") on "+core;
			$("#results").html(message);	
			spark.callFunction(core, fn, args, function (dname, vname, value, status) {
				$(b).removeClass('pending');
				$("#results").html("Done:"+message);
			});

		});
		$('div.spark-control-function').find('.spark-edit').each(function (index) {
			$(this).unbind();
			$(this).click(function(e) {
				spark_function_tool.edit = $(this).prevAll("button.spark-button:first");
				spark_function_tool.getButtonAttributes(spark_function_tool.edit);
				spark_function_tool.setDialogAttributes();
				$("#add-fn-edit").button("enable");
				$("#add-fn-delete").button("enable");
				$("#add-fn-add").button("disable");
				$("#spark-fn-dialog").dialog("option", "position", { my : "left-100 top-100", of : e, collision : "fit" });
				$("#spark-fn-dialog").dialog("open");
			});
		});
	}
};