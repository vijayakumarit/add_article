$(document).ready(function(){
  $('.delete-employee').on('click', function(e){
    $target = $(e.target);
    const id = $target.attr('data-id');
    $.ajax({
      type:'DELETE',
      url: '/employees/'+id,
      success: function(response){
        alert('Deleting Employee');
        window.location.href='/';
      },
      error: function(err){
        console.log(err);
      }
    });
  });
});
