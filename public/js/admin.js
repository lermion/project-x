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
var url = "user/get_users/0";
function filters(){
	$.get("user/get_users/0", function(data){
		console.log(data);
	});
}

//handlers

$("select.get-region").change(function(event){
	var that = this;
	getRegion(that);
});