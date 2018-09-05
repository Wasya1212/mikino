// animate CSS
$.fn.extend({
    animateCss: function (animationName, callback = function() {}) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        this.addClass('animated ' + animationName).one(animationEnd, function() {
            $(this).removeClass('animated ' + animationName);
            callback();
        });
    }
});

function systemContentElement(message) {
    return $('<div></div>').html('<i>' + message + '</i>');
}

function escapedContentElement(message) {
    return $('<div></div>').text(message);
}

function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? (h > 9 ? ":" : "" + h) : "";
    var mDisplay = m > 0 ? m + ":" : "0";
    var sDisplay = s > 0 ? (s > 9 ? s : "0" + s) : "00";
    return hDisplay + mDisplay + sDisplay; 
}

function reset_form_element (e) {
    e.wrap('<form>').parent('form').trigger('reset');
    e.unwrap();
}

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!                                  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!                                  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!          ERROR HANDLING          !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!                                  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!                                  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

function handleLoad(e) { 
    console.log('Import success: ' + e.target.href);
}

function handleError(e) { 
    console.log('Error input: ' + e.target.href);
}

function imgError(image, src) {
    image.onerror = "";
    image.src = src;
    return true;
}

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!                                  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!                                  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!       DOCUMENT OPERATIONS        !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!                                  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!                                  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

function hideMenu() {
    $('#main-menu-wrapper').addClass('hidden-wrapper');
}

function showMenu() {
    $('#main-menu-wrapper').removeClass('hidden-wrapper');
}

$('#toggleMenu button').bind('click', function() {
    if ($(this).hasClass('activated')) {
        $(this).removeClass('activated');
        showMenu();
    } else {
        $(this).addClass('activated');
        hideMenu();
    }
});

// create drill down
var $topProfileDropdown = new Foundation.DropdownMenu($('#top-profile'), {});

// reveal
var $reveal = $('#reveal');
// create reveal
new Foundation.Reveal($('#reveal'), {});

$('#reveal').bind('closed.zf.reveal', function() {
    $('#reveal').removeClass('full');
    $('#reveal').removeClass('large');
    $('#reveal').empty();
});

function revealCloseBtn() {
    return $('<button class="close-button shrink" type="button" aria-label="Close modal" data-close=""><span aria-hidden="true">&times</span></button>');
}

$('.inform-accordion').on('click', function() {
    $('i', $(this)).removeClass('pulse-button');
});

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!                                  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!                                  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!           MESSAGE BOX            !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!                                  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!                                  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

var messageBox = new WriteBox();

socket.on('user message', function(data) {
    // not message directory
    if (data.user._id != window.location.search.substring(5)) {
        $('#inform-menu .fi-mail').addClass('pulse-button');
        $('#messages-accordion').append($('<li></li>').html(messageBox.NoticeBoxElement(data.user, data.message)));
    }
});

messageBox.setClases({
    title_wrap: 'row align-justify',
    box_title: 'columns large-4',
    box_title_controls: 'columns large-4',
    box_body: 'clearfix',
    box_profile: 'column row',
    box_text_wrap: 'column row',
    edit_table: 'edit_table',
    box_controls: 'column row',
    send_btn: 'button'
});

function buildWriteMessage(box, data) {
    // title
    box.title_wrap.append(revealCloseBtn());
    box.box_title.text('New message');
    box.title_wrap.append(this.box_title);
    box.box_title_controls.append('<a class="mail-box-header-link" href="/messages?sel=' + data.user._id + '"> to messaging</a>');
    box.title_wrap.append(this.box_title_controls);
    
    // body
    box.box_profile.append('<div class="mail-box-avatar"><a class="avatar" style="background-image: url(uploads/' + data.user.avatar + ');" href="/' + data.user._id + '"><img class="mail-box-avatar-image print-only" alt="' + data.user.name.fName + ' ' + data.user.name.lName + '" src="uploads/' + data.user.avatar + '"></a></div>');
    box.box_profile.append('<div class="mail-box-recepient-info"><a href="/' + data.user._id + '">' + data.user.name.fName + ' ' + data.user.name.lName + '</a><p><span>' + data.user.privateInfo.about + '</span></p></div>');
    box.box_text_wrap.append(box.edit_table);
    
    // control
    box.send_btn.text('Send');
    box.send_btn.attr("onclick", data.sendFuncName);
    box.box_controls.append(box.send_btn);  
}

function checkSendMessage(err, message) {
    if (err) {
        alert(err);
    } else {
        emitNewMessage(message.to, message.text, function(data) {
            console.log(data.results);
            $reveal.foundation('close');
        });
    }
}

function showWriteMessageBox(e, id) {  
    e.preventDefault();
    
    $.post('/user', { userId: id }).done(function(data) {
        if (data.error) {
            console.log(data.error);
            
            return false;
        }      
        
        messageBox.create({ data: {
            user: data.user, 
            sendFuncName: 'messageBox.send("' + id + '", checkSendMessage);'
        } }, buildWriteMessage);
        
        $reveal.html(messageBox.getContent());
        $reveal.foundation('open');
    });
    
    return false;
}

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!                                  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!                                  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!             FRIENDS              !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!                                  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!                                  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

// get all friends for menu category
$.post('/friends', function(users) {
    users.forEach(function(user) {
        $('#friends-submenu ul').append('<li class="friends-submenu-box" id="friends_submenu_box_' + user._id + '"><a class="clearfix" href="/' + user._id + '"><div class="avatar avatar-box" style="background-image: url(\'uploads/' + user.avatar + '\')"></div><span class="friend-name">' + user.name.fName + ' ' + user.name.lName + '</span></a><button class="button write-message-to-btn" type="button" onclick="showWriteMessageBox(event, \'' + user._id + '\')"></button></li>');
    });
});

socket.on('friendship', function(user) {
    $('#inform-menu .fi-torsos-all').addClass('pulse-button');
    $('#friends-accordion').append($('<li></li>').html(messageBox.NoticeBoxElement(user, 'send friendship')));
    $('.reed-person-btn').attr({
        id: 'subscribed-person',
        onclick: 'confirmFriendship(event, "' + user._id + '")'
    }).text('Subscribed');
});

socket.on('confirm friendship', function(user) {
    $('#inform-menu .fi-torsos-all').addClass('pulse-button');
    $('#friends-accordion').append($('<li></li>').html(messageBox.NoticeBoxElement(user, 'confirm friendship')));
    $('.reed-person-btn').attr({
        id: 'end-reed-person',
        onclick: 'endFriendship(event, "' + user._id + '")'
    }).text('remove from friends');
});

socket.on('cancel friendship', function(user) {
    $('#inform-menu .fi-torsos-all').addClass('pulse-button');
    $('#friends-accordion').append($('<li></li>').html(messageBox.NoticeBoxElement(user, 'cancel friendship')));
    $('.reed-person-btn').attr({
        id: 'start-reed-person',
        onclick: 'friendship(event, "' + user._id + '")'
    }).text('friendship');
});

socket.on('end friendship', function(user) {
    $('#inform-menu .fi-torsos-all').addClass('pulse-button');
    $('#friends-accordion').append($('<li></li>').html(messageBox.NoticeBoxElement(user, 'end friendship')));
    $('.reed-person-btn').attr({
        id: 'cancel-reed-person',
        onclick: 'cancelFriendship(event, "' + user._id + '")'
    }).text('friendship cancel');
});

function friendshipRequest(e, userId, callback) {
    e.preventDefault();
    
    $.ajax({
        url: '/friendship',
        dataType: 'json',
        method: 'POST',
        data: {userId: userId},
        success: function(results) {
            callback(results);
        }
    });
}

function confirmFriendshipRequest(e, userId, callback) {
    e.preventDefault();
    
    $.ajax({
        url: '/confirm-friendship',
        dataType: 'json',
        method: 'POST',
        data: {userId: userId},
        success: function(results) {
            callback(results);
        }
    });
}

function cancelFriendshipRequest(e, userId, callback) {
    e.preventDefault();
    
    $.ajax({
        url: '/cancel-friendship',
        dataType: 'json',
        method: 'POST',
        data: {userId: userId},
        success: function(results) {
            callback(results);
        }
    });
}

function endFriendshipRequest(e, userId, callback) {
    e.preventDefault();
    
    $.ajax({
        url: '/end-friendship',
        dataType: 'json',
        method: 'POST',
        data: {userId: userId},
        success: function(results) {
            callback(results);
        }
    });
}

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!                                  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!                                  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!              THEME               !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!                                  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!                                  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

var themeBox = new ThemeBox();

function changeMainTheme() {
    $reveal.addClass('full');
    $reveal.append('<button class="close-button" data-close aria-label="Close modal" type="button"><span aria-hidden="true">&times;</span></button>');    
    
    $.ajax({
        url: '/user',
        dataType: 'json',
        method: 'POST',
        success: function(data) {
            themeBox.initialize(data.user);
            themeBox.create();
    
            $reveal.append(themeBox.build());  
            $('#reveal').bind('closed.zf.reveal', function() {
                themeBox.clear();
            });
            
            $reveal.foundation('open');
            $('.reveal-modal').animateCss('fadeInLeft');
            //console.log(data);
        }
    });    
}