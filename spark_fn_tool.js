var spark_function_tool = {
	edit : undefined,
	fn : undefined,
	label : undefined,
	args : undefined, 
	form : "<div id='spark-fn-dialog' title='Function Call Button'>" + "<div class='jtable'>" 
			+ "<div class='row'>"
			+ "<div class='cell'>Label</div>" + "<div class='cell'><input class='label' type='text'></div>" + "</div>"
			+ "<div class='row'>"
			+ "<div class='cell'>Core</div>" + "<div class='cell'>"
			+ "<div id='spark-fn-core-selector'></div>"
      	+ "</div></div>"
			+ "<div class='row'>" 
			+ "<div class='cell'>Function</div>"
			+ "<div class='cell'><div id='spark-fn-fn-selector'></div></div>" + "</div>" 
			+ "<div class='row'>"
			+ "<div class='cell'>Arguments</div>" + "<div class='cell'><input class='args' type='text'></div>" + "</div>"
			+ "</div>" + "</div>",
	tool_button : "<div class='spark-tool'><button id='spark-add-function'>Function</button></div>",
	setButtonAttributes : function(b) {
		$(b).attr("spark-function", spark_function_tool.fn);
		$(b).attr("spark-label", spark_function_tool.label);
		$(b).attr("spark-args", spark_function_tool.args);
		$(b).find(".ui-button-text").text(spark_function_tool.label);
	},
	getDialogAttributes : function() {
		spark_function_tool.label = $("#spark-fn-dialog .label").val();
		spark_function_tool.fn  = $("#spark-fn-dialog .name").val();
		spark_function_tool.args  = $("#spark-fn-dialog .args").val();
	},
	setDialogAttributes : function(label, fn, args) {
		console.log("editing..."+label+":"+fn+"("+args+")");
		$("#spark-fn-dialog .label").val(label);
		$("#spark-fn-dialog .name").val(fn);
		$("#spark-fn-dialog .args").val(args);
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
									var newButton = "<div class='spark-control spark-call-core-function'>"
											+ "<button class='spark-editing spark-button spark-call-core-function'>"+spark_function_tool.label+"</button>"
											+ "<div class='spark-move'></div><div class='spark-edit'></div></div>";
									$(spark_mods.currentMod).append(newButton);
									spark_function_tool.setButtonAttributes($(".spark-editing"));
									$(".spark-editing").removeClass("spark-editing");
									$("button").button();
									$(spark_mods.currentMod + " button[spark-label=" + spark_function_tool.label + "]").button();
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
							} ] });
		$("select").selectmenu();
		$("#spark-fn-dialog .ui-selectmenu-button").width("95%");
		$(toolbar_div).append(this.tool_button);
		$("button").button();
		$("#spark-add-function").on("click", function(e) {
			spark_mods.getCoreSelector("#spark-fn-core-selector");
			spark_mods.getFnSelector("#spark-fn-fn-selector", "MIA");
			$("#add-fn-edit").button("disable");
			$("#add-fn-add").button("enable");
			$("#spark-fn-dialog").dialog("option", "position", { my : "left-10 top-10", of : e, collision : "fit" });
			$("#spark-fn-dialog").dialog("open");
		});
	},
	refresh: function() {
		spark_mods.getCoreSelector("#spark-fn-core-selector");
		spark_mods.getFnSelector("#spark-fn-fn-selector", "MIA");
		$("button.spark-call-core-function").click(function() {
			var args = $(this).attr("spark-args");
			var fn = $(this).attr("spark-function");
			var message = "Calling function "+fn+"("+args+") on "+spark_mods.currentCore;
			$("#results").html(message);
			
		});
		$('div.spark-call-core-function').find('.spark-edit').each(function (index) {
			$(this).click(function(e) {
				spark_mods.getCoreSelector("#spark-fn-core-selector");
				spark_mods.getFnSelector("#spark-fn-fn-selector", "MIA");
				spark_function_tool.edit = $(this).prevAll("button.spark-button:first");
				spark_function_tool.setDialogAttributes(
						$(spark_function_tool.edit).attr("spark-label"),
						$(spark_function_tool.edit).attr("spark-function"),
						$(spark_function_tool.edit).attr("spark-args")
				);
				$("#add-fn-edit").button("enable");
				$("#add-fn-add").button("disable");
				$("#spark-fn-dialog").dialog("option", "position", { my : "left-100 top-100", of : e, collision : "fit" });
				$("#spark-fn-dialog").dialog("open");
			});
		});
	}
};