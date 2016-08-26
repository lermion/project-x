//functions

function getRegion(that){
	$.get("get_region/" + parseInt(that.value), function(data){
		if(data !== ""){
			$("tbody.regions").html(data);
			$("p.no-results").text("");
		}else{
			$("tbody.regions").html("");
			$("p.no-results").text("нет результатов");
		}
	});
}

function getCountry(that){
	console.log(parseInt(that.value));
}

function genderFilter(that){
	console.log(parseInt(that.value));
}

//handlers

$("select.get-region").change(function(event){
	var that = this;
	getRegion(that);
});

$("select.get-country").change(function(event){
	var that = this;
	getCountry(that);
});

$("select.gender").change(function(event){
	var that = this;
	genderFilter(that);
});