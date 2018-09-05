$('#audioUpload').change(function() {
    readAudioURL(this);
});

function readAudioURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        
        $('#upload-audio-btn').hide();
        $('.loading').show();
        
        reader.onload = function (e) {
            console.log(input.files[0]);
            setTimeout(function() {
                $('#cancelAudioUpload').show();
                $('#cancelAudioUpload').before($('<div class="uploaded-value"></div>').text(input.files[0].name));
                $('#send-uploaded-audio-btn').show();
                $('.loading').hide();
            }, 3000);
        };

        reader.readAsDataURL(input.files[0]);
    }
}

$('#cancelAudioUpload').on('click', function(e) {
    reset_form_element($('#audioUpload'));
    $('#upload-audio-btn').show();
    $('#cancelAudioUpload').hide();
    $('#send-uploaded-audio-btn').hide();
    $('.uploaded-value').remove();
    e.preventDefault();
});

function AudioBox() {
    this.container = $('<div class="audioBox clearfix"></div>');
    this.picture = $('<div class="audio-picture"></div>');
    this.audioSwgIcon = $('<svg id="audio-image" class="audio-icon-picture" version="1.0" xmlns="http://www.w3.org/2000/svg" width="512.000000pt" height="512.000000pt" viewBox="0 0 512.000000 512.000000" preserveAspectRatio="xMidYMid meet"><metadata>Created by potrace 1.14, written by Peter Selinger 2001-2017</metadata><g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" fill="#c1bfbf" stroke="none"><path class="audio-icon" d="M3203 5039 c-10 -10 -13 -101 -13 -384 l0 -371 -64 4 c-83 5 -150 -17 -209 -69 -85 -74 -98 -169 -32 -228 85 -74 238 -59 333 32 63 60 62 54 62 418 l0 332 57 -6 c156 -16 327 -159 435 -361 l37 -71 1 48 c0 138 -75 334 -171 440 -69 77 -173 149 -269 186 -96 38 -151 47 -167 30z"/> <path class="audio-icon" d="M4133 3669 c-350 -298 -383 -328 -383 -348 0 -10 95 -179 210 -376 116 -197 210 -359 210 -360 0 -1 -19 -8 -42 -16 -59 -19 -150 -107 -179 -171 -30 -69 -32 -159 -4 -206 22 -37 86 -72 131 -72 91 0 202 79 251 178 37 75 40 175 6 219 -12 15 -96 156 -188 312 -139 236 -165 286 -153 297 40 38 504 444 508 444 3 -1 67 -107 142 -237 l138 -237 -49 -18 c-113 -43 -201 -166 -201 -283 0 -191 203 -222 353 -55 25 27 52 71 61 97 19 57 21 139 2 173 -41 77 -491 838 -504 853 -8 9 -25 17 -38 17 -14 0 -107 -72 -271 -211z m291 35 c14 -26 26 -50 26 -54 0 -8 -481 -437 -507 -453 -12 -7 -78 95 -71 112 4 11 511 441 520 441 3 0 18 -21 32 -46z"/> <path class="audio-icon" d="M2230 3351 c-547 -97 -1005 -182 -1017 -189 -13 -7 -31 -27 -40 -45 -17 -30 -18 -101 -21 -1069 l-2 -1036 -58 16 c-85 23 -266 20 -367 -7 -342 -91 -584 -369 -544 -624 25 -159 147 -275 339 -323 50 -13 94 -15 190 -12 107 4 139 10 222 38 170 57 320 165 401 288 86 132 80 40 78 1080 -2 507 -1 922 1 922 2 0 381 74 843 164 462 90 843 162 848 159 8 -5 10 -1356 2 -1365 -3 -2 -35 4 -72 13 -85 22 -237 24 -333 4 -200 -42 -386 -159 -490 -307 -200 -284 -68 -591 280 -654 249 -45 548 57 723 245 66 72 99 126 127 206 20 57 20 83 20 1313 0 1411 6 1307 -74 1343 -23 10 -45 18 -51 18 -5 -1 -458 -81 -1005 -178z m880 -261 c0 -112 -3 -152 -12 -155 -20 -7 -1658 -325 -1674 -325 -11 0 -14 30 -14 169 l0 169 68 12 c37 6 405 71 817 145 413 73 765 133 783 134 l32 1 0 -150z"/> </g> </svg>');
    this.audioImgIcon = $('<div id="audio-image" class="audio-icon-picture"></div>');
    this.info = $('<div class="audio-info"></div>');
    this.infoTitle = $('<div class="audio-title"></div>');
}

function startPlay(e, audioElement, path, mime) {
    var $audio = audioElement
    
    $('.audio-title-info h1').text($('.audio-info .audio-title span', $audio).text());
    $('.audio-title-info h3').text($('.audio-info .audio-artist span', $audio).text());
    
    var audioIcon = $('.audio-icon-picture', $audio).attr('src'); 
    
    if (audioIcon) {
        var $newIcon = $('<a class="cover"></a>');
        
        $newIcon.attr('style', 'background-image: url(' + audioIcon + ')');
        $('.cover').replaceWith($newIcon);
        $('.cover').append($('<img src="' + audioIcon + '"/>').addClass('print-only'));
        
        $('.bgimg img').attr('style', 'background-image: url(' + audioIcon + ')');
    } else {
        var $newIcon = new AudioBox().audioSwgIcon.addClass('cover');
        var svg = new AudioBox().audioSwgIcon;
        
        $newIcon.attr('style', 'background-image: url(' + svg + ')');
        $('.cover').replaceWith($newIcon);
        
        $('.bgimg img').attr('style', 'background-image: url(' + svg + ')');
    }    
    
    $('.mejs__container #audio-player-main audio').attr({
        'src' : 'uploads/' + path + '.' + mime,
        'type' : 'audio/' + mime,
        'autoplay': 'true'
    })
}

AudioBox.prototype.get = function(audio) {
    if (audio.metadata.picture.length > 0) {
        this.audioImgIcon.attr('src', audio.metadata.picture[0].base64String);
        this.picture.append(this.audioImgIcon);
    } else {
        this.picture.append(this.audioSwgIcon);
    }
    this.container.append(this.picture);
    
    this.infoTitle.text(audio.title);
    this.info.append(this.infoTitle);
    this.container.append(this.info);
    this.container.attr('id', 'audio-' + audio._id);
    
    return this.container;
}

$('#upload-audio-form').on('submit', function(e) {
    e.preventDefault();
    
    var formData = new FormData();
    var file = $('#audioUpload')[0].files[0];
    formData.append('uploadFile', file);
    
    $.ajax({
        url: '/audios/upload',
        method: 'POST',
        contentType: false,
        processData: false,
        data: formData,
        beforeSend: function() {
            $('#cancelAudioUpload').hide();
            $('#send-uploaded-audio-btn').hide();
            $('.loading').show();
        },
        success: function(results) {
            if (results.error) return;
            
            var audio = results.audio;
            audio.metadata.duration = secondsToHms(audio.metadata.duration);
            var box = new AudioBox();
                        
            $('#audios').append(box.get(audio));
            window.location.reload(true);
        }
    });
});

//$('g', svg).attr('fill', '#622f2f');