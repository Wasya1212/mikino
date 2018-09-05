var $registrationForm = $('#registration-form'),
    $nameForm = $('#name-form'),
    $avatarForm = $('#avatar-form'),
    $aboutForm = $('#about-form'),
    $infoForm = $('#info-form'),
    $secretForm = $('#secret-form');

var $progressBar = $('.progress');

//$registrationForm.hide();
$('#to-login').hide();
$nameForm.hide();
$avatarForm.hide();
$aboutForm.hide(); 
$infoForm.hide();
$secretForm.hide();

$registrationForm.on('submit', function(e) {
    e.preventDefault();
        
    // registrate new user
    $.ajax({
        url: '/registration',
        method: 'POST',
        dataType: 'json',
        data: $registrationForm.serialize(),
        beforeSend: function() {
            $('input[type="submit"]', $registrationForm).addClass('disabled');
        },
        success: function(data) {
            if (data.errors) {
                showErrors($('.errorBox', $registrationForm), data.errors);
                
                return;
            }

            clearErrors($('.errorBox', $registrationForm));
            
            $('main').append('<div id="my_id"></div>');
            $('#my_id').hide();
            $('#my_id').html(data.userId);
            
            console.log('Success registration');

            // show next form
            showNameForm();
        },
        complete: function() {
            $('input[type="submit"]', $registrationForm).removeClass('disabled');
        }
    });
    
});

$nameForm.on('submit', function(e) {
    e.preventDefault();
    
    // set user name
    $.ajax({
        url: '/registration/name',
        method: 'POST',
        dataType: 'json',
        data: { 
            fName: $('#first-name-input').val(), 
            mName: $('#middle-name-input').val(), 
            lName: $('#last-name-input').val(),
            userId: $('#my_id').html() 
        },
        beforeSend: function() {
            $('input[type="submit"]', $nameForm).addClass('disabled');
        },
        success: function(data) {
            if (data.errors) {
                showErrors($('.errorBox', $nameForm), data.errors);
                
                return;
            }

            clearErrors($('.errorBox', $nameForm));
            
            console.log('Success name registration...');

            // show next form
            showAvatarForm();
        },
        complete: function() {
            $('input[type="submit"]', $nameForm).removeClass('disabled');
        }
    });
    
});

$('#imageUpload').change(function() {
    readURL(this)
});

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('.avatar-image', $avatarForm).css({
                'background-image' : 'url("' + e.target.result + '")'
            });
        };

        reader.readAsDataURL(input.files[0]);
    }
}

$avatarForm.on('submit', function(e) {
    e.preventDefault();
    
    var formData = new FormData();
            
    var file = $('#imageUpload')[0].files[0];
    formData.append('uploadFile', file);
    formData.append('userId', $('#my_id').html());
        
    // set avatar
    $.ajax({
        url: '/registration/avatar',
        method: 'POST',
        contentType: false,
        processData: false,
        data: formData,
        beforeSend: function() {
            $('input[type="submit"]', $avatarForm).addClass('disabled');
        },
        success: function(data) {
            if (data.errors) {
                showErrors($('.errorBox', $avatarForm), data.errors);
                
                return;
            }

            clearErrors($('.errorBox', $avatarForm));
            
            console.log('Success avatar registration...');

            // show next form
            showAboutInfoForm();
        },
        complete: function() {
            $('input[type="submit"]', $avatarForm).removeClass('disabled');
        }
    });
    
});

$aboutForm.on('submit', function(e) {
    e.preventDefault();
    
    var formData = new FormData();
    var aboutData = $aboutForm.serializeArray();
    var dataObjects = [];
    
    $.each(aboutData, function(key, value) {
        dataObjects[value.name] = value.value;
    });
    
    var birth = dataObjects['birth'];
    var sex = dataObjects['sex'];
    var about = dataObjects['about'];
    
    // set own data
    $.ajax({
        url: '/registration/about',
        method: 'POST',
        dataType: 'json',
        data: {
            birth: birth,
            sex: sex,
            about: about,
            userId: $('#my_id').html(),
        },
        beforeSend: function() {
            $('input[type="submit"]', $aboutForm).addClass('disabled');
        },
        success: function(data) {
            if (data.errors) {
                showErrors($('.errorBox', $aboutForm), data.errors);
                
                return;
            }

            clearErrors($('.errorBox', $aboutForm));
            
            console.log('Success own data registration...');

            // show next form
            showContactsForm();
        },
        complete: function() {
            $('input[type="submit"]', $aboutForm).removeClass('disabled');
        }
    });
    
});

$("input[name='phone']").mask("+380 (99) 999-9999"); 

$infoForm.on('submit', function(e) {
    e.preventDefault();
        
    // contacts info
    $.ajax({
        url: '/registration/info',
        method: 'POST',
        dataType: 'json',
        data: {
            phone: $('#phone-input').val(),
            country: $('#country-select').val(),
            city: $('#city-input').val(),
            userId: $('#my_id').html()
        },
        beforeSend: function() {
            $('input[type="submit"]', $infoForm).addClass('disabled');
        },
        success: function(data) {
            if (data.errors) {
                showErrors($('.errorBox', $infoForm), data.errors);
                
                return;
            }

            clearErrors($('.errorBox', $infoForm));
            
            console.log('Success contact data registration...');

            // show next form
            showSecretForm();
        },
        complete: function() {
            $('input[type="submit"]', $infoForm).removeClass('disabled');
        }
    });
    
});

$secretForm.on('submit', function(e) {
    e.preventDefault();
    
    $.ajax({
        url: '/registration/secret',
        method: 'POST',
        dataType: 'json',
        data: {
            secretQuestion: $('#secret-type-select').val(),
            secretAnswer: $('#secret-word-input').val(),
            userId: $('#my_id').html()
        },
        beforeSend: function() {
            $('input[type="submit"]', $secretForm).addClass('disabled');
        },
        success: function(data) {
            if (data.errors) {
                showErrors($('.errorBox', $secretForm), data.errors);
                
                return;
            }

            clearErrors($('.errorBox', $secretForm));
            
            console.log('Success...');

            // end registration
            showEndRegistrationReveal();
        },
        complete: function() {
            $('input[type="submit"]', $secretForm).removeClass('disabled');
        }
    });
    
});

function showNameForm() {
    $registrationForm.animateCss('fadeOutLeft', function() {
        $registrationForm.hide();
        $nameForm.show();
        $('.progress-meter', $progressBar).animate({'width' : '30%'}, 1000);
        $progressBar.show();
        $nameForm.animateCss('fadeInRight');
    });
}

function showAvatarForm() {
    $nameForm.animateCss('fadeOutLeft', function() {
        $nameForm.hide();
        $avatarForm.show();
        $('.progress-meter', $progressBar).animate({'width' : '50%'}, 1000);
        $avatarForm.animateCss('fadeInRight');
    });
}

function showAboutInfoForm() {
    $avatarForm.animateCss('fadeOutLeft', function() {
        $avatarForm.hide();
        $aboutForm.show();
        $('.progress-meter', $progressBar).animate({'width' : '65%'}, 1000);
        $aboutForm.animateCss('fadeInRight');
    });
}

function showContactsForm() {
    $aboutForm.animateCss('fadeOutLeft', function() {
        $aboutForm.hide();
        $infoForm.show();
        $('.progress-meter', $progressBar).animate({'width' : '80%'}, 1000);
        $infoForm.animateCss('fadeInRight');
    });
}

function showSecretForm() {
    $infoForm.animateCss('fadeOutLeft', function() {
        $infoForm.hide();
        $secretForm.show();
        $('.progress-meter', $progressBar).animate({'width' : '90%'}, 1000);
        $secretForm.animateCss('fadeInRight');
    });
}

function showEndRegistrationReveal() {
    $('.progress-meter', $progressBar).animate({'width' : '100%'}, 1000);
    
    $('#registration-container').animateCss('fadeOut', function() {
        $('#registration-container').hide();
        $('#to-login').show();
        $('#to-login').animateCss('fadeIn');
    });
    
    setTimeout(function() {
        $('#reveal h1').text('You are registrated and can now login');
        $('#reveal h1').after('<a class="expanded button success" href="/login">Sign in</a>');
        $('#reveal').foundation('open');
    }, 2000);
}

function showErrors(errorBox, errors = []) {
    errorBox.show();
    
    var err = '<p><i class="fi-alert"></i> There are some errors in your form:</p>';

    errors.forEach(function(error) {
        err += '<p class="error-message">' + error.msg + '</p>';
    });
    errorBox.html(err);
}

function clearErrors(errorBox) {
    errorBox.html('');
    errorBox.hide();
}