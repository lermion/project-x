$("select.form-control").change(function(event){
	$.get("get_region/" + parseInt(this.value), function(data){
		if(data !== ""){
			$("tbody.regions").html(data);
		}
	});
});