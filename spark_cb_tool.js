var spark_checkbox_tool = {
	edit : undefined,
	fn : undefined,
	label : undefined,
	argsT : undefined, 
	argsF : undefined, 
	core :undefined,
	form : "<div id='spark-cb-dialog' class='spark-dialog' title='Checkbox'>" 
			+ "<div class='spark-dialog-container'>"
			+ "<div class='spark-dialog-main'>"
			+ "<label>Label</label>" 
			+ "<input class='label' type='text'/>"
			+ "<label>Core</label>"
			+ "<div class='spark-select' id='spark-cb-core-selector'></div>"
      	+ "<label>Function</label>"
			+ "<div class='spark-select' id='spark-cb-fn-selector'></div>"
			+ "<label>Checked</label>"  
			+ "<input class='argsT' type='text'/>"
			+ "<label>Cleared</label>"  
			+ "<input class='argsF' type='text'/>"
			+ "</div></div></div>",
	tool_button : "<div class='spark-tool'><button id='spark-add-checkbox'>Checkbox</button></div>",
	setCheckboxAttributes : function(b) {
		$(b).attr("spark-core", spark_checkbox_tool.core);		
		$(b).attr("spark-function", spark_checkbox_tool.fn);
		$(b).attr("spark-label", spark_checkbox_tool.label);
		$(b).attr("spark-argsT", spark_checkbox_tool.argsT);
		$(b).attr("spark-argsF", spark_checkbox_tool.argsF);
		$(b).find(".ui-button-text").text(spark_checkbox_tool.label);
	},
	getCheckboxAttributes : function(b) {
		spark_checkbox_tool.core = $(b).attr("spark-core");		
		spark_checkbox_tool.fn = $(b).attr("spark-function");
		spark_checkbox_tool.label = $(b).attr("spark-label");
		spark_checkbox_tool.argsT = $(b).attr("spark-argsT");
		spark_checkbox_tool.argsF = $(b).attr("spark-argsF");
	},
	getDialogAttributes : function() {
		spark_checkbox_tool.label = $("#spark-cb-dialog .label").val();
		spark_checkbox_tool.core  = spark_mods.getSelectorVal("#spark-cb-core-selector");
		spark_checkbox_tool.fn  = spark_mods.getSelectorVal("#spark-cb-fn-selector");
		spark_checkbox_tool.argsT  = $("#spark-cb-dialog .argsT").val();
		spark_checkbox_tool.argsF  = $("#spark-cb-dialog .argsF").val();
	},
	setDialogAttributes : function() {
		console.log("editing..."+spark_checkbox_tool.label+":"+spark_checkbox_tool.fn+"("+spark_checkbox_tool.args+")");
		spark_mods.setSelectorVal("#spark-cb-core-selector", spark_checkbox_tool.core);
		spark_mods.getFnSelector("#spark-cb-fn-selector", spark_checkbox_tool.core);
		spark_mods.setSelectorVal("#spark-cb-fn-selector", spark_checkbox_tool.fn);
		$("#spark-cb-dialog .label").val(spark_checkbox_tool.label);
		$("#spark-cb-dialog .argsT").val(spark_checkbox_tool.argsT);
		$("#spark-cb-dialog .argsF").val(spark_checkbox_tool.argsF);
	},
	initialize : function(target_div, toolbar_div) {
		$(target_div).append(this.form);
		$("#spark-cb-dialog").dialog(
				{
					autoOpen : false,
					height : "auto",
					buttons : [
							{
								text : "Add",
								id : "add-cb-add",
								click : function() {
									spark_checkbox_tool.getDialogAttributes();
									var newCheckbox = "<div class='spark-control spark-control-checkbox'>"
											+ "<input id='spark-checkbox-"+spark_checkbox_tool.label+"'type='checkbox' class='spark-editing spark-checkbox'/>"
											+ "<label class='spark-checkbox spark-checkbox-core-function' for='spark-checkbox-"+spark_checkbox_tool.label+"'>"
											+ spark_checkbox_tool.label+"</label>"
											+ "<div class='spark-move'></div><div class='spark-edit'></div></div>";
									$(spark_mods.currentMod).append(newCheckbox);
									spark_checkbox_tool.setCheckboxAttributes($(".spark-editing"));
									$(".spark-editing").button();
									$(".spark-editing").removeClass("spark-editing");
									spark_mods.refreshControls(true);
									$(this).dialog("close");
								} }, 
							{ 
								text : "Edit", 
								id : "add-cb-edit",
								click : function() {
									spark_checkbox_tool.getDialogAttributes();
									spark_checkbox_tool.setCheckboxAttributes(spark_checkbox_tool.edit);
									spark_mods.refreshControls(true);
									$(this).dialog("close");
								}
							},
							{ 
								text : "Delete", 
								id : "add-cb-delete",
								click : function() {
									$(spark_checkbox_tool.edit).parent().remove();
									$(this).dialog("close");
								}
							}] });
		$("select").selectmenu();
		$("#spark-cb-dialog .ui-selectmenu-button").width("95%");
		$(toolbar_div).append(this.tool_button);
		$("button").button();
		$("#spark-add-checkbox").on("click", function(e) {
			spark_mods.getCoreSelector("#spark-cb-core-selector", function() {
				spark_mods.getFnSelector("#spark-cb-fn-selector", spark_mods.getSelectorVal("#spark-cb-core-selector")) 
			});
			spark_mods.getFnSelector("#spark-cb-fn-selector", spark_mods.getSelectorVal("#spark-cb-core-selector"));
			$("#add-cb-edit").button("disable");
			$("#add-cb-delete").button("disable");
			$("#add-cb-add").button("enable");
			$("#spark-cb-dialog").dialog("option", "position", { my : "left-10 top-10", of : e, collision : "fit" });
			$("#spark-cb-dialog").dialog("open");
		});
	},
	refresh: function() {
		spark_mods.getCoreSelector("#spark-cb-core-selector", function() {
			spark_mods.getFnSelector("#spark-cb-fn-selector", spark_mods.getSelectorVal("#spark-cb-core-selector")) 
		});
		spark_mods.getFnSelector("#spark-cb-fn-selector", spark_mods.getSelectorVal("#spark-cb-core-selector"));
		$("input:checkbox").button();
		$(".spark-checkbox-core-function").unbind();
		$(".spark-checkbox-core-function").click(function() {
			var b = $(this).prevAll("input:checkbox:first");
			$(b).addClass('pending');
			var args;
			if (!$(b).prop('checked')) {
				args = $(b).attr("spark-argst");	
			}
			else {
				args = $(b).attr("spark-argsf");
			}
			var fn = $(b).attr("spark-function");
			var core = $(b).attr("spark-core")
			var message = "Calling function "+fn+"("+args+") on "+core;
			$("#results").html(message);	
			spark.callFunction(core, fn, args, function (dname, vname, value, status) {
				$(b).removeClass('pending');
				$("#results").html("Done:"+message);
			});

		});
		$('div.spark-control-checkbox').find('.spark-edit').each(function (index) {
			$(this).unbind();
			$(this).click(function(e) {
				spark_checkbox_tool.edit = $(this).prevAll("input.spark-checkbox:first");
				spark_checkbox_tool.getCheckboxAttributes(spark_checkbox_tool.edit);
				spark_checkbox_tool.setDialogAttributes();
				$("#add-cb-edit").button("enable");
				$("#add-cb-delete").button("enable");
				$("#add-cb-add").button("disable");
				$("#spark-cb-dialog").dialog("option", "position", { my : "left-100 top-100", of : e, collision : "fit" });
				$("#spark-cb-dialog").dialog("open");
			});
		});
	}
};