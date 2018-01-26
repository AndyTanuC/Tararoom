$(document).ready(function(){
    $('#datetimepicker').datetimepicker({
    	format: 'DD-MM-YYYY HH:mm:ss'
    });

    $(".time_stamp").each(function() {
    	var d = new Date($(this).text());
    	var timestamp = d.toISOString();
	  	$(this).text(moment(timestamp).format('MMMM Do YYYY, h:mm:ss a'));
	});

});