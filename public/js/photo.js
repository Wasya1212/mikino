$('#photoUpload').change(function() {
    readPhotoURL(this)
});

function readPhotoURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        
        $('#upload-photo-btn').hide();
        $('.loading').show();
        
        reader.onload = function (e) {
            console.log(input.files[0]);
            setTimeout(function() {
                $('#cancelPhotoUpload').show();
                $('#cancelPhotoUpload').before($('<div class="uploaded-value"></div>').text(input.files[0].name));
                $('#send-uploaded-photo-btn').show();
                $('.loading').hide();
            }, 3000);
        };

        reader.readAsDataURL(input.files[0]);
    }
}

$('#cancelPhotoUpload').on('click', function(e) {
    reset_form_element($('#photoUpload'));
    $('#upload-photo-btn').show();
    $('#cancelPhotoUpload').hide();
    $('#send-uploaded-photo-btn').hide();
    $('.uploaded-value').remove();
    e.preventDefault();
});

$('#upload-photo-form').on('submit', function(e) {
    e.preventDefault();
    
    var formData = new FormData();
    var file = $('#photoUpload')[0].files[0];
    formData.append('uploadFile', file);
    
    $.ajax({
        url: '/photo/upload',
        method: 'POST',
        contentType: false,
        processData: false,
        data: formData,
        beforeSend: function() {
            $('#cancelPhotoUpload').hide();
            $('#send-uploaded-photo-btn').hide();
            $('.loading').show();
        },
        success: function(results) {
            if (results.error) return;
            console.log('success photo upload');
            $('.uploaded-value').remove();
            $('.loading').hide();
            $('#upload-photo-btn').show();
            window.location.reload(true);
        }
    });
});

function showFullPicture(imagePath) {
    $reveal.append('<button class="close-button" data-close aria-label="Close modal" type="button"><span aria-hidden="true">&times;</span></button>'); 
    $reveal.append($('<img class="fullImage" src="uploads/' + imagePath + '"/>'));
    $reveal.foundation('open');
}