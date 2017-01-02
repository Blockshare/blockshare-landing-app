$(document).ready(function(){
	$(document).on("click","#btn_applySettings",function(){
		if($("#p_mode").val() == "element" && $("#p_radius").val() > 58)
			$("#p_radius").val(58);
		var settings = {
			mode:$("#p_mode").val(),
			backgroundColor:$("#p_backgroundColor").val(),
			tileStrokeColor:$("#p_tileStrokeColor").val(),
			tileFillColor:$("#p_tileFillColor").val(),
			sparklingColor:$("#p_sparklingColor").val(),
			speed:$("#p_speed").val(),
			intensity:$("#p_intensity").val(),
			radius:$("#p_radius").val()
		};

		bg.sparklingHexagons("settings",settings);
	});
})
