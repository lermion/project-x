//functions

function getRegion(that){
	$.get("get_region/" + parseInt(that.value), function(data){
		var output = [];
		if(data.length > 0){
			$.each(data, function(key, value) {
				$("select.get-regions").append($("<option/>", {
					value: value.id,
					text: value.name
				}));
			});
			$('.select.get-regions').html(output.join(''));
			$("select.get-regions").change(function(event){
				$.get("get_area/" + parseInt(this.value), function(response){
					if(data.length > 0){
						
					}
				});
			});
		}else{
			$("select.get-regions").replaceWith("<select class='form-control get-regions'><option></option></select>");
		}
	});
}
function readURL(input){
	if(input.files && input.files[0]){
		var reader = new FileReader();
		reader.onload = function (e) {
			$('.admin-moderator-avatar img').attr('src', e.target.result).width(150).height(200);
		};
		reader.readAsDataURL(input.files[0]);
	}
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