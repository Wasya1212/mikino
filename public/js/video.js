$('#videoUpload').change(function() {
    readVideoURL(this);
});

function readVideoURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        
        $('#upload-video-btn').hide();
        $('.loading').show();
        
        reader.onload = function (e) {
            console.log(input.files[0]);
            setTimeout(function() {
                $('#cancelVideoUpload').show();
                $('#cancelVideoUpload').before($('<div class="uploaded-value"></div>').text(input.files[0].name));
                $('#send-uploaded-video-btn').show();
                $('.loading').hide();
            }, 3000);
        };

        reader.readAsDataURL(input.files[0]);
    }
}

$('#cancelVideoUpload').on('click', function(e) {
    reset_form_element($('#videoUpload'));
    $('#upload-video-btn').show();
    $('#cancelVideoUpload').hide();
    $('#send-uploaded-video-btn').hide();
    $('.uploaded-value').remove();
    e.preventDefault();
});

$('#upload-video-form').on('submit', function(e) {
    e.preventDefault();
    
    var formData = new FormData();
    var file = $('#videoUpload')[0].files[0];
    formData.append('uploadFile', file);
    
    $.ajax({
        url: '/videos/upload',
        method: 'POST',
        contentType: false,
        processData: false,
        data: formData,
        beforeSend: function() {
            $('#cancelVideoUpload').hide();
            $('#send-uploaded-video-btn').hide();
            $('.loading').show();
        },
        success: function(results) {
            if (results.error) return;
            console.log('done video uploading');
            $('.uploaded-value').remove();
            $('.loading').hide();
            $('#upload-video-btn').show();
            
            // show new video
            window.location.reload(true);
        }
    });
});

function setPreviewImage(element, src) {
    element.css('background-image', 'url("uploads/screenshots/' + src + '")');
}

function getScreenshotSrc(play_background_element, index) {
    return play_background_element.parent('.preview-screenshots').children('#video-screenshot-' + index).attr('src');
}

function showVideoPlayer(video_owner, filename, mime, videoElem) {
    //alert(video_owner);
    var posters = $('.video-screenshot', videoElem.parent('.preview-screenshots'));
    var posterSrc = posters.length > 0 ? posters[0].src : 'http://localhost:5000/img/assets/video_background.jpg';
    
    $reveal.addClass('large');
    $reveal.append($('<video autoplay="true" id="video_player" poster="' + posterSrc + '"><source src="uploads/' + filename + '.' + mime + '" type="video/' + mime + '"/></video>'));
    $reveal.append('<h3 class="video-title main-video-title video-title-for-videoplayer">' + 'Some title' + '</h3>');
    $reveal.append('<div class="video-description-text">Some video description...</div>')
    $('#video_player').mediaelementplayer({
        alwaysShowControls: true,
        videoVolume: 'horizontal',
        features: ['playpause','progress','volume','fullscreen', 'duration', 'current'],
        success: function(mediaelement, originalNode) {
            var timeInterval = 5000;
            var timer; 
            
            $('.mejs__time-total').on('mouseleave', function() {
                $('.mejs__time-hovered').css('transform', 'scaleX(0)');
            });

            $('.mejs__time-rail').on('mousedown', function() {
                $('.mejs__time-handle').addClass('active-slider');
            });

            $('.mejs__time-rail').on('mouseup', function() {
                $('.mejs__time-handle').removeClass('active-slider');
            });
            
            $('.mejs__container').on('mouseleave', function() {
                $('.mejs__controls').hide();
            });
            
            $('.mejs__container').on('mouseenter', function() {
                timer = showContainerOnInterval($('.mejs__controls'), timeInterval);
            });
            
            $('.mejs__container').on('mousemove', function() {
                clearTimeout(timer);
                timer = showContainerOnInterval($('.mejs__controls'), timeInterval);
            });
            
            function showContainerOnInterval(container, interval) {
                container.show();
                return setTimeout(function() {
                    container.hide();   
                }, interval);
            }
        }
    });
    $reveal.foundation('open');
}

$(document).ready(function() {
    $('div[onload]').trigger('onload');
    
    var timer;
    
    $('.play-background')
        .bind('mouseenter', function() {
            var element = $(this),
                index = 2,
                imagesCount = $('.video-screenshot', element.parent('.preview-screenshots')).length,
                startImage = getScreenshotSrc(element, index);
                    
            timer = setInterval(function() {
                element.parent('.preview-screenshots').css('background-image', 'url("' + startImage + '")');
                index < imagesCount ? index++ : index = 1;
                startImage = getScreenshotSrc(element, index);
            }, 800)
        })
        .bind('mouseleave', function() {
            clearInterval(timer);
            $(this).parent('.preview-screenshots').css('background-image', 'url("' + getScreenshotSrc($(this), 1) + '")');
        });
});