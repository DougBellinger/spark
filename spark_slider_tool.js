var spark_slider_tool = {
	edit : undefined,
	fn : undefined,
	label : undefined,
	args : undefined, 
	core :undefined,
	form : "<div id='spark-sl-dialog' class='spark-dialog' title='Slider'>" 
			+ "<div class='spark-dialog-container'>"
			+ "<div class='spark-dialog-main'>"
			+ "<label>Label</label>" 
			+ "<input class='label' type='text'/>"
			+ "<label>Core</label>"
			+ "<div class='spark-select' id='spark-sl-core-selector'></div>"
      	+ "<label>Function</label>"
			+ "<div class='spark-select' id='spark-sl-fn-selector'></div>"
			+ "<label>Arugments</label>"  
			+ "<input class='args' type='text'/>"
			+ "<label>Min</label>"  
			+ "<input class='min' type='text'/>"
			+ "<label>Max</label>"  
			+ "<input class='max' type='text'/>"
			+ "<label>Step</label>"  
			+ "<input class='step' type='text'/>"
			+ "</div></div></div>",
	tool_button : "<div class='spark-tool'><button id='spark-add-slider'>Slider</button></div>",
	setSliderAttributes : function(b) {
		$(b).attr("spark-core", spark_slider_tool.core);		
		$(b).attr("spark-function", spark_slider_tool.fn);
		$(b).attr("spark-label", spark_slider_tool.label);
		$(b).attr("spark-args", spark_slider_tool.args);
		$(b).slider("option", "min", spark_slider_tool.min);
		$(b).slider("option", "max", spark_slider_tool.max);
		$(b).slider("option", "step", spark_slider_tool.step);
		$(b).parent().find("label.spark-slider:first").text(spark_slider_tool.label);
	},
	getSliderAttributes : function(b) {
		spark_slider_tool.core = $(b).attr("spark-core");		
		spark_slider_tool.fn = $(b).attr("spark-function");
		spark_slider_tool.label = $(b).attr("spark-label");
		spark_slider_tool.args = $(b).attr("spark-args");
		spark_slider_tool.min = $(b).slider("option", "min");
		spark_slider_tool.max = $(b).slider("option", "max");
		spark_slider_tool.step = $(b).slider("option", "step");
	},
	getDialogAttributes : function() {
		spark_slider_tool.label = $("#spark-sl-dialog .label").val();
		spark_slider_tool.core  = spark_mods.getSelectorVal("#spark-sl-core-selector");
		spark_slider_tool.fn  = spark_mods.getSelectorVal("#spark-sl-fn-selector");
		spark_slider_tool.args  = $("#spark-sl-dialog .args").val();
		spark_slider_tool.min = parseInt($("#spark-sl-dialog .min").val());
		spark_slider_tool.max = parseInt($("#spark-sl-dialog .max").val());
		spark_slider_tool.step = parseInt($("#spark-sl-dialog .step").val());
	},
	setDialogAttributes : function() {
		console.log("editing..."+spark_slider_tool.label+":"+spark_slider_tool.fn+"("+spark_slider_tool.args+")");
		spark_mods.setSelectorVal("#spark-sl-core-selector", spark_slider_tool.core);
		spark_mods.getFnSelector("#spark-sl-fn-selector", spark_slider_tool.core);
		spark_mods.setSelectorVal("#spark-sl-fn-selector", spark_slider_tool.fn);
		$("#spark-sl-dialog .label").val(spark_slider_tool.label);
		$("#spark-sl-dialog .args").val(spark_slider_tool.args);
		$("#spark-sl-dialog .min").val(spark_slider_tool.min);
		$("#spark-sl-dialog .max").val(spark_slider_tool.max);
		$("#spark-sl-dialog .step").val(spark_slider_tool.step);
	},
	initialize : function(target_div, toolbar_div) {
		$(target_div).append(this.form);
		$("#spark-sl-dialog").dialog(
				{
					autoOpen : false,
					height : "auto",
					buttons : [
							{
								text : "Add",
								id : "add-sl-add",
								click : function() {
									spark_slider_tool.getDialogAttributes();
									var newSlider = "<div class='spark-control spark-control-slider ui-resizable'>"
											+ "<div class='spark-slider-wrapper'>"
												+ "<div id='spark-slider-"+spark_slider_tool.label+"' class='spark-editing spark-slider'/>"
												+ "<label class='spark-slider spark-slider-core-function' for='spark-slider-"+spark_slider_tool.label+"'>"
												+ spark_slider_tool.label+"</label>"
											+ "</div>"
											+ "<div class='spark-move'></div><div class='spark-edit'></div>"
											+ "<div class='spark-resize'></div></div></div>";
									$(spark_mods.currentMod).append(newSlider);
									$(".spark-editing").slider({ 	min : spark_slider_tool.min,
																			max : spark_slider_tool.max, 
																			step : spark_slider_tool.step});
									spark_slider_tool.setSliderAttributes($(".spark-editing"));
									spark_mods.refreshControls(true);
									$(".spark-editing").removeClass("spark-editing");
									$(this).dialog("close");
								} }, 
							{ 
								text : "Edit", 
								id : "add-sl-edit",
								click : function() {
									spark_slider_tool.getDialogAttributes();
									spark_slider_tool.setSliderAttributes(spark_slider_tool.edit);
									spark_mods.refreshControls(true);
									$(this).dialog("close");
								}
							},
							{ 
								text : "Delete", 
								id : "add-sl-delete",
								click : function() {
									$(spark_slider_tool.edit).parent().parent().remove();
									$(this).dialog("close");
								}
							}] });
		$("select").selectmenu();
		$("#spark-sl-dialog .ui-selectmenu-button").width("95%");
		$(toolbar_div).append(this.tool_button);
		$("button").button();
		$("#spark-add-slider").on("click", function(e) {
			spark_mods.getCoreSelector("#spark-sl-core-selector", function() {
				spark_mods.getFnSelector("#spark-sl-fn-selector", spark_mods.getSelectorVal("#spark-sl-core-selector")) 
			});
			spark_mods.getFnSelector("#spark-sl-fn-selector", spark_mods.getSelectorVal("#spark-sl-core-selector"));
			$("#add-sl-edit").button("disable");
			$("#add-sl-delete").button("disable");
			$("#add-sl-add").button("enable");
			$("#spark-sl-dialog").dialog("option", "position", { my : "left-10 top-10", of : e, collision : "fit" });
			$("#spark-sl-dialog").dialog("open");
		});
	},
	refresh: function() {
		spark_mods.getCoreSelector("#spark-sl-core-selector", function() {
			spark_mods.getFnSelector("#spark-sl-fn-selector", spark_mods.getSelectorVal("#spark-sl-core-selector")) 
		});
		spark_mods.getFnSelector("#spark-sl-fn-selector", spark_mods.getSelectorVal("#spark-sl-core-selector"));
		$("div.spark-slider").unbind("slidechange");
		$("div.spark-slider").slider();
		$("div.spark-slider").on("slidechange", function(e, ui) {
			var b = $(this).parent().find(".spark-slider:first");
			$(b).parent().find("label.spark-slider:first").addClass('pending');
			var args = $(b).attr("spark-args");	
			args = args.replace("{}", $(b).slider("values", 0));
			var fn = $(b).attr("spark-function");
			var core = $(b).attr("spark-core")
			var message = "Calling function "+fn+"("+args+") on "+core;
			$("#results").html(message);	
			$(b).addClass('pending');
			spark.callFunction(core, fn, args, function (dname, vname, value, status) {
				$(b).parent().find("label.spark-slider:first").removeClass('pending');
				$("#results").html("Done:"+message);
			});

		});
		$('div.spark-control-slider').find('.spark-edit').each(function (index) {
			$(this).unbind();
			$(this).click(function(e) {
				spark_slider_tool.edit = $(this).parent().find(".spark-slider:first");
				spark_slider_tool.getSliderAttributes(spark_slider_tool.edit);
				spark_slider_tool.setDialogAttributes();
				$("#add-sl-edit").button("enable");
				$("#add-sl-delete").button("enable");
				$("#add-sl-add").button("disable");
				$("#spark-sl-dialog").dialog("option", "position", { my : "left-100 top-100", of : e, collision : "fit" });
				$("#spark-sl-dialog").dialog("open");
			});
		});
	}
};