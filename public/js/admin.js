//functions

function getRegion(that){
	$.get("get_region/" + parseInt(that.value), function(data){
		if(data.length > 0){
			data.forEach(function(value){
				$("select.get-regions").replaceWith("<select class='form-control get-regions'><option value='" + value.id + "'>" + value.name + "</option></select>");
			});
		}
	});
}

//handlers

$("select.get-region").change(function(event){
	var that = this;
	getRegion(that);
});