$("select.form-control").change(function(event){
	$.get("get_region/" + parseInt(this.value), function(data){
		if(data !== ""){
			$("tbody.regions").html(data);
			$("p.no-results").text("");
		}else{
			$("tbody.regions").html("");
			$("p.no-results").text("нет результатов");
		}
	});
});