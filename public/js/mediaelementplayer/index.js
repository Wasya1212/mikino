$(document).ready(function() {
    $('#audio-player-main').mediaelementplayer({
        alwaysShowControls: true,
        features: ['current', 'playpause','volume', 'duration' ,'progress'],
        audioVolume: 'horizontal',
        audioWidth: 400,
        audioHeight: 120,
        success: function(mediaelement, originalNode) {
            $('.mejs__time-float').hide();
        }
    });
    
    $('.mejs__time-total').on('mouseleave', function() {
        $('.mejs__time-hovered').css('transform', 'scaleX(0)');
    });
    
    $('.mejs__time-rail').on('mousedown', function() {
        $('.mejs__time-handle').addClass('active-slider');
    });
    
    $('.mejs__time-rail').on('mouseup', function() {
        $('.mejs__time-handle').removeClass('active-slider');
    });
});