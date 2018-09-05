// ********************** message box class
function WriteBox() {   
    // main box
    this.main_layout = $('<div class="box-layout"></div>');
    
    // title box
    this.title_wrap = $('<div class="box-title-wrap"></div>');
    this.box_title = $('<div class="box-title"></div>');
    this.box_title_controls = $('<div class="box-title-controls"></div>');
    
    // body box
    this.box_body = $('<div class="box-body"></div>');
    this.box_profile = $('<div class="main-box-profile"></div>');
    this.box_text_wrap = $('<div class="main-box-text-wrap"></div>');
    this.box_controls = $('<div class="main-box-controls"></div>');
    
    // main controls box
    this.edit_table = $('<div class="main-box-edit-table" contenteditable></div>');
    this.send_btn = $('<button class="main-box-send-button"></button>');
}

WriteBox.prototype.MessageBoxElement = function(user, message, mainClasses = '') {
    return $('<div class="messageBox ' + mainClasses + '">' + 
                '<div class="message-user-img"><a class="avatar" style="background-image: url(uploads/' + user.avatar + ')" href="/' + user._id + '"><img src="uploads/' + user.avatar + '" class="avatar print-only"></a></div>' + 
                '<div class="user-message-container"><p>' + message + '</p></div>' + 
             '</div>');
}

WriteBox.prototype.NoticeBoxElement = function(user, message) {
    return $('<div class="notice-message-box clearfix">' + 
                '<div class="notice-message-user-img"><a href="/' + user._id + '" class="avatar notice-avatar-block" style="background-image: url(\'uploads/' + user.avatar + '\')"><img class="print-only" src="uploads/' + user.avatar + '"></div></a>' + 
                '<div class="notice-message-content">' + 
                    '<a href="/messages?sel=' + user._id + '">' + user.name.fName + ' ' + user.name.lName + '</a>' + 
                    '<p>' + message + '</p>' + 
                '</div>' + 
             '</div>');
}

WriteBox.prototype.send = function(orderId, callback) {
    $.ajax({
        url: '/message',
        method: 'POST',
        dataType: 'json',
        data: { 
            message: this.edit_table.text(),
            order: orderId
        },
        success: function(result) {
            if (result.error) {
                callback(result.error, null);
            }
            callback(null, result.data);
        }
    });
}

WriteBox.prototype.clear = function() {
    this.main_layout.empty();
    this.title_wrap.empty();
    this.box_title.empty();
    this.box_title_controls.empty();
    this.box_body.empty();
    this.box_profile.empty();
    this.box_text_wrap.empty();
    this.box_controls.empty();
    this.edit_table.empty();
    this.send_btn.empty();
}

WriteBox.prototype.setClases = function(clasesObj) {
    this.main_layout.addClass(clasesObj.main_layout || '');
    this.title_wrap.addClass(clasesObj.title_wrap || '');
    this.box_title.addClass(clasesObj.box_title || '');
    this.box_title_controls.addClass(clasesObj.box_title_controls || '');
    this.box_body.addClass(clasesObj.box_body || '');
    this.box_profile.addClass(clasesObj.box_profile || '');
    this.box_text_wrap.addClass(clasesObj.box_text_wrap || '');
    this.box_controls.addClass(clasesObj.box_controls || '');
    this.edit_table.addClass(clasesObj.edit_table || '');
    this.send_btn.addClass(clasesObj.send_btn || '');
}

WriteBox.prototype.create = function(params = { data: null }, strategy) {
    if (params.clear != false) {
        console.log('clear');
        this.clear();
    } else {
        console.log('no clear');
    }
    
    strategy(this, params.data);
}

WriteBox.prototype.getContent = function() {
    var contentBox = this.main_layout;
    var contentTitle = this.title_wrap;
    var contentBody = this.box_body;
    
    contentTitle.append(this.box_title);
    contentTitle.append(this.box_title_controls);
    
    contentBox.append(contentTitle);
    
    contentBody.append(this.box_profile);
    contentBody.append(this.box_text_wrap);
    contentBody.append(this.box_controls);
    
    contentBox.append(contentBody);
    
    return contentBox;
}