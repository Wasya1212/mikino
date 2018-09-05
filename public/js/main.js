var $sendMsgBtn = $('#write-message-to');
var $reedPerson = $('#reed-person');
var $subscribedPerson = $('#subscribed-person');

function friendship(e, userId) {
    friendshipRequest(e, userId, function(data) {
        $('.reed-person-btn').attr({
            id: 'cancel-reed-person',
            onclick: 'cancelFriendship(event, "' + userId + '")'
        }).text('friendship cancel');

        socket.emit('friendship', userId, data.currentUser, function(result) {
            console.log(result);
        });

        console.log(data);
    });
}

function confirmFriendship(e, userId) {
    confirmFriendshipRequest(e, userId, function(data) {
        $('.reed-person-btn').attr({
            id: 'end-reed-person',
            onclick: 'endFriendship(event, "' + userId + '")'
        }).text('remove from friends');

        socket.emit('confirm friendship', userId, data.currentUser, function(result) {
            console.log(result);
        });

        console.log(data); 
    });
}

function cancelFriendship(e, userId) {
    cancelFriendshipRequest(e, userId, function(data) {
        $('.reed-person-btn').attr({
            id: 'start-reed-person',
            onclick: 'friendship(event, "' + userId + '")'
        }).text('friendship');

        socket.emit('cancel friendship', userId, data.currentUser, function(result) {
            console.log(result);
        });

        console.log(data);
    });
}

function endFriendship(e, userId) {
    endFriendshipRequest(e, userId, function(data) {
        $('.reed-person-btn').attr({
            id: 'subscribed-person',
            onclick: 'confirmFriendship(event, "' + userId + '")'
        }).text('Subscribed');

        socket.emit('end friendship', userId, data.currentUser, function(result) {
            console.log(result);
        });

        console.log(data);
    });
}

//$('.parallax-container').parallax({imageSrc: 'http://chemistry-chemists.com/N4_2011/S1/Snow_51.jpg'});