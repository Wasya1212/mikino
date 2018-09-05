var $editForm = $('#edit-form');

$editForm.on('submit', function(e) {
    e.preventDefault();
        
    // registrate new user
    $.ajax({
        url: '/edit',
        method: 'POST',
        dataType: 'json',
        data: $editForm.serialize(),
        beforeSend: function() {
            $('input[type="submit"]', $editForm).addClass('disabled');
        },
        success: function(data) {
            $('input[type="submit"]', $editForm).removeClass('disabled');
        },
        complete: function() {
            console.log('complete');
        }
    });
    
});