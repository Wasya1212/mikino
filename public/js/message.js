var $chat = $('#chat');
var $sendMessageForm = $('#send-message');
var $messageInput = $('#message');

var chatMessageBox = new WriteBox();

$sendMessageForm.on('submit', function(e) {
    e.preventDefault();
    
    var text = $messageInput.val();
    var orderId = window.location.search.substring(5);
    
    chatMessageBox.edit_table.text(text);    
    
    chatMessageBox.send(orderId, function(err, results) {
        if (err) {
            alert(err);
            return;
        }        
        
        $messageInput.val('');
        chatMessageBox.clear();
        
        emitNewMessage(orderId, text, function(data) {
            console.log(data.results);
        });
    });
});

// on message from recipient
socket.on('user message', function(data) {
    if (window.location.search == '?sel=' + data.user._id) {
        $chat.append(chatMessageBox.MessageBoxElement(data.user, data.message, 'recipient-message clearfix'));
        scrollChat(500);
    } else {
        console.log('ne ta stora');
    }
    
});

// on message from selfe
socket.on('new message', function(data) {
    $chat.append(chatMessageBox.MessageBoxElement(data.user, data.message, 'user-message clearfix'));
    scrollChat(500);
});

function scrollChat(delay = 0) {
    var chat = $("#chat");
    //chat.scrollTop(chat.prop('scrollHeight')).animate({}, 3000);
    chat.animate({
        scrollTop: chat.prop('scrollHeight')
    }, delay);
}

scrollChat();