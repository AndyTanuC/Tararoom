$(document).ready(function(){
    $('#acceptRequest').click(function () {
		var request_id = $(this).data('id');

		swal({
            title: "Are you sure?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
  			cancelButtonColor: '#DD6B55',
            confirmButtonText: "Yes confirm it!",
            closeOnConfirm: false
        }).then((result) => {
        	if(result.value) {
        		$.ajax({
	                type    : "POST",   
	                url     : "/admin/confirm",
	                data    : {"request_id": request_id},
	                success: function(response){
	                   handleResult(response);
	                }
            	});
        	}
        });
	});

	$('#declineRequest').click(function () {
		var request_id = $(this).data('id');

		swal({
            title: "Are you sure?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
  			cancelButtonColor: '#DD6B55',
            confirmButtonText: "Yes decline it!",
            closeOnConfirm: false
        }).then((result) => {
        	if(result.value) {
        		$.ajax({
	                type    : "POST",   
	                url     : "/admin/decline",
	                data    : {"request_id": request_id},
	                success: function(response){
	                   handleResult(response);
	                }
            	});
        	}
        });
	});
});

function handleResult(result)
{
	if(result == 'success')
	{
		swal({
            title: "Request has been accepted",
            type: "success",
            showConfirmButton: false,
            timer: 1500
        });
	}
	else
	{
		swal({
            title: "Request has been declined",
            type: "success",
            showConfirmButton: false,
            timer: 1500
        });
	}
	setTimeout(function(){ location.reload(); }, 2000);
}