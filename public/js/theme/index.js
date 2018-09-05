var color_pallete = $('<div id="color-picker" class="cp-default"><div class="picker-wrapper"><div id="picker" class="picker"></div><div id="picker-indicator" class="picker-indicator"></div></div><div class="pcr-wrapper"><div id="pcr" class="pcr"></div><div id="pcr-indicator" class="pcr-indicator"></div></div><ul id="color-values"><li><label>RGB:</label><span id="rgb"></span></li><li><label>HSV:</label><span id="hsv"></span></li><li><label>HEX:</label><span id="hex"></span></li><li><div id="pcr_bg"></div></li></ul></div>');

function hexc(colorval) {
    var parts = colorval.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    delete(parts[0]);
    for (var i = 1; i <= 3; ++i) {
        parts[i] = parseInt(parts[i]).toString(16);
        if (parts[i].length == 1) parts[i] = '0' + parts[i];
    }
    return '#' + parts.join('');
}

var colorCounter = 0;

// color CSS
function createPallete(colorVal) {
    try {
        cp = new ColorPicker(document.getElementById('pcr'), document.getElementById('picker'), 
        function(hex, hsv, rgb, mousePicker, mousepcr) {
            currentColor = hex;
            new ColorPicker.positionIndicators(
            document.getElementById('pcr-indicator'),
            document.getElementById('picker-indicator'),
            mousepcr, mousePicker);

            document.getElementById('hex').innerHTML = hex;
            document.getElementById('rgb').innerHTML = 'rgb(' + rgb.r.toFixed() + ',' + rgb.g.toFixed() + ',' + rgb.b.toFixed() + ')';
            document.getElementById('hsv').innerHTML = 'hsv(' + hsv.h.toFixed() + ',' + hsv.s.toFixed(2) + ',' + hsv.v.toFixed(2) + ')';
            document.getElementById('pcr_bg').style.backgroundColor = hex;
        });
        cp.setHex(colorVal);
        colorCounter++;
    } catch(err) {
        console.log(err);
    }
}

function ThemeBox() {
    this.container = $('<div id="theme_container" class="theme-container expanded row"></div>');
    this.menu = $('<div id="theme_edit" class="theme-edit-menu theme-menu small-6 medium-4 large-4 column"></div>');
    this.introduction = $('<div class="theme-introduction-block theme-introduction">Theme settings</div>');
    this.mainEdit = $('<div class="edit-main-style"></div>');
    this.uploadBackground = $('<div class="change-background-image"><label for="backgroundUpload" class="button">Upload background</label><input type="file" accept="image/*" id="backgroundUpload" class="show-for-sr"><div>');
    this.uploadAvatar = $('<div class="change-avatar-image"><label for="avatarUpload" class="button">Upload avatar</label><input type="file" accept="image/*" id="avatarUpload" class="show-for-sr"><div>');
    this.titleColor = $('<div class="change-title-color"><button type="button" class="button theme_title-color-btn btn-disabled">Change title color</button><div class="current-color_container current-title-color-box"></div></div>');
    this.textColor = $('<div class="change-text-color"><button type="button" class="button theme_text-color-btn btn-disabled">Change text color</button><div class="current-color_container current-text-color-box"></div></div>');
    this.descriptionColor = $('<div class="change-description-color"><button type="button" class="button theme_description-color-btn btn-disabled">Change description color</button><div class="current-color_container current-description-color-box"></div></div>');
    this.backgroundColor = $('<div class="change-background-color"><button type="button" class="button theme_background-color-btn btn-disabled">Change background color</button><div class="current-color_container current-background-color-box"></div></div>');
    this.secondaryEdit = $('<div class="edit-secondary-style">Some must be...</div>');
    this.save = $('<button id="save_theme" class="save-theme-btn large success button" type="button">Save</button>');
    this.background = $('<div class="main-background-area clearfix"></div>');
    this.avatar = $('<div class="avatar-container"><a href="/"><img class="print-only" alt=""></a></div>');
    this.name = $('<h3 class="name-article" id="main-name-article"></h3>');
    this.about = $('<p class="description user-about" id="user-description"></p>');
    this.mainInfo = $('<article class="full-width"><h4 class="user-description">Info</h4></article>');
    this.preview = $('<div id="theme_preview" class="theme-preview theme-preview-conrainer small-6 medium-8 large-8 column"></div>');
}

ThemeBox.prototype.create = function() {
    this.menu.append(this.introduction);
    this.mainEdit.append(this.uploadBackground);
    this.mainEdit.append(this.uploadAvatar);
    this.mainEdit.append(this.titleColor);
    this.mainEdit.append(this.textColor);
    this.mainEdit.append(this.descriptionColor);
    this.mainEdit.append(this.backgroundColor);
    this.menu.append(this.mainEdit);
    this.menu.append(this.secondaryEdit);
    this.menu.append(this.save);
    this.container.append(this.menu);
    this.preview.append(this.background);
    this.preview.append(this.avatar);
    this.preview.append(this.name);
    this.preview.append(this.about);
    this.preview.append(this.mainInfo);
    this.container.append(this.preview);
}

function checkUserInfo(info) {
    var info_block = $('<ul id="main-info-block"></ul>');
    
    for (var key in info) {
        if (info[key] != '') {
            info_block.append($('<li><strong class="description">' + key + '</strong><span>' + info[key] + '</span></li>'));
        }
    }
    
    return info_block;
}

function bindDisabled(element, beforeEnable, done, enabledBefore, enabledDone) {
    if (beforeEnable && typeof beforeEnable === "function")
        beforeEnable();
    element.removeClass('btn-disabled');
    element.addClass('btn-enabled');
    element.unbind('click');
    element.on('click', function() {
        if (done && typeof done === "function")
            done();
        bindEnabled(element, enabledBefore, enabledDone, beforeEnable, done);
    });
}

function bindEnabled(element, beforeDisable, done, disabledBefore, disabledDone) {
    if (beforeDisable && typeof beforeDisable === "function")
        beforeDisable();
    element.removeClass('btn-enabled');
    element.addClass('btn-disabled');
    element.unbind('click');
    element.on('click', function() {
        if (done && typeof done === "function")
            done();
        bindDisabled(element, disabledBefore, disabledDone, beforeDisable, done);
    });
}

function addPallete(color = '#FFFFFF', onSave) {
    createPallete(color);
    
    let pickerSVG = $('#picker svg')[0];
    $('#picker').empty();
    $('#picker').append(pickerSVG);
    
    let pcrSVG = $('#pcr svg')[0];
    //$('#pcr').empty();
    try { $('#pcr svg')[1].remove(); } catch (err) { console.log('YES'); }
    //$('#pcr').append(pickerSVG);
    
    $('#color-picker').append($('<button class="button confirm_color_btn" type="button">Confirm</button>'));
    $('.confirm_color_btn').on('click', function() {
        onSave($('#hex').text());
    });
}

function changeImage(uploadBtn, callback) {
    uploadBtn.change(function() {
        if (this.files && this.files[0]) {
            var reader = new FileReader();
            
            reader.onload = function(e) {
                callback(e);
            };
            
            reader.readAsDataURL(this.files[0]);
        }
    });
}

ThemeBox.prototype.initialize = function(user) {    
    changeImage($('input[type="file"]', this.uploadBackground), function(e) {
        $('#theme_preview .main-background-area').css('background-image', 'url("' + e.target.result + '")');
    });
    
    changeImage($('input[type="file"]', this.uploadAvatar), function(e) {
        $('#theme_preview .avatar-container a').css('background-image', 'url("' + e.target.result + '")');
    });
    
    this.preview.css('background-color', user.theme.backgroundColor || '#ffffff');
    
    this.background.css({
        'background-image' : 'url("uploads/' + user.backgroundImage + '")',
        'width' : '100%',
        'height' : '300px'
    });
        
    $('img', this.avatar).attr('src', 'uploads/' + user.avatar);
    $('a', this.avatar).css({
        'background-image': 'url("uploads/' + user.avatar + '")',
        'border':  '7px solid ' + user.theme.backgroundColor
    });
    
    this.name.text(user.name.fName + ' ' + user.name.mName + ' ' + user.name.lName);
    this.about.text(user.privateInfo.about);
    
    let userInfo = checkUserInfo({email: user.email, phone: user.contactsInfo.phone, country: user.contactsInfo.country, city: user.contactsInfo.city, birth: user.privateInfo.birth, sex: user.privateInfo.sex});
    
    this.mainInfo.append(userInfo);
    
    $('*.description', this.mainInfo).css({
        'color' : user.theme.descriptionColor,
        'margin-left' : '5%'
    });
    $('.user-description', this.mainInfo).css({
        'margin-left' : '5%',
        'color' : user.theme.textColor
    });
    $('*span', this.mainInfo).css('color', user.theme.textColor);
    this.about.css('color', user.theme.descriptionColor);
    this.name.css('color', user.theme.articleColor);
        
    $('.current-color_container', this.backgroundColor).css('background-color', user.theme.backgroundColor);
    $('.current-color_container', this.textColor).css('background-color', user.theme.textColor);
    $('.current-color_container', this.titleColor).css('background-color', user.theme.articleColor);
    $('.current-color_container', this.descriptionColor).css('background-color', user.theme.descriptionColor);
    
    $('.btn-disabled', this.titleColor).on('click', function() {
        bindDisabled($(this), function() {
            $('.change-title-color').append(color_pallete);
            addPallete(hexc($('.current-title-color-box').css("background-color")), function(color) {
                $('.current-title-color-box').css('background-color', color);
                $('#theme_preview .name-article').css('color', color);
            });
        }, null, function() {
            $('.cp-default').remove();
        }, null);
    });
    $('.btn-enabled', this.titleColor).on('click', function() {
        bindEnabled($(this), function() {
            $('.cp-default').remove();
        }, null, function() {
            $('.change-title-color').append(color_pallete);
            addPallete(hexc($('.current-title-color-box').css("background-color")), function(color) {
                $('.current-title-color-box').css('background-color', color);
                $('#theme_preview .name-article').css('color', color);
            });
        }, null);
    });
    
    $('.btn-disabled', this.textColor).on('click', function() {
        bindDisabled($(this), function() {
            $('.change-text-color').append(color_pallete);
            addPallete(hexc($('.current-text-color-box').css("background-color")), function(color) {
                $('.current-text-color-box').css('background-color', color);
                $('#theme_preview span, #theme_preview .user-description').css('color', color);
            });
        }, null, function() {
            $('.cp-default').remove();
        }, null);
    });
    $('.btn-enabled', this.textColor).on('click', function() {
        bindEnabled($(this), function() {
            $('.cp-default').remove();
        }, null, function() {
            $('.change-text-color').append(color_pallete);
            addPallete(hexc($('.current-text-color-box').css("background-color")), function(color) {
                $('.current-text-color-box').css('background-color', color);
                $('#theme_preview span, #theme_preview .user-description').css('color', color);
            });
        }, null);
    });
    
    $('.btn-disabled', this.descriptionColor).on('click', function() {
        bindDisabled($(this), function() {
            $('.change-description-color').append(color_pallete);
            addPallete(hexc($('.current-description-color-box').css("background-color")), function(color) {
                $('.current-description-color-box').css('background-color', color);
                $('#theme_preview .description').css('color', color);
            });
        }, null, function() {
            $('.cp-default').remove();
        }, null);
    });
    $('.btn-enabled', this.descriptionColor).on('click', function() {
        bindEnabled($(this), function() {
            $('.cp-default').remove();
        }, null, function() {
            $('.change-description-color').append(color_pallete);
            addPallete(hexc($('.current-description-color-box').css("background-color")), function(color) {
                $('.current-description-color-box').css('background-color', color);
                $('#theme_preview .description').css('color', color);
            });
        }, null);
    });
    
    $('.btn-disabled', this.backgroundColor).on('click', function() {
        bindDisabled($(this), function() {
            $('.change-background-color').append(color_pallete);
            addPallete(hexc($('.current-background-color-box').css("background-color")), function(color) {
                $('.current-background-color-box').css('background-color', color);
                $('#theme_preview').css('background-color', color);
                $('#theme_preview .avatar-container a').css('border-color', color);
            });
        }, null, function() {
            $('.cp-default').remove();
        }, null);
    });
    $('.btn-enabled', this.backgroundColor).on('click', function() {
        bindEnabled($(this), function() {
            $('.cp-default').remove();
        }, null, function() {
            $('.change-background-color').append(color_pallete);
            addPallete(hexc($('.current-background-color-box').css("background-color")), function(color) {
                $('.current-background-color-box').css('background-color', color);
                $('#theme_preview').css('background-color', color);
                $('#theme_preview .avatar-container a').css('border-color', color);
            });
        }, null);
    });
    
    let s = this.save,
        stu = this.saveToUser;
    
    this.save.on('click', function() {
        stu(s);
    });
}

ThemeBox.prototype.clear = function() {
    this.container = $('<div id="theme_container" class="theme-container expanded row"></div>');
    this.menu = $('<div id="theme_edit" class="theme-edit-menu theme-menu small-6 medium-4 large-4 column"></div>');
    this.introduction = $('<div class="theme-introduction-block theme-introduction">Theme settings</div>');
    this.mainEdit = $('<div class="edit-main-style"></div>');
    this.uploadBackground = $('<div class="change-background-image"><label for="backgroundUpload" class="button">Upload background</label><input type="file" accept="image/*" id="backgroundUpload" class="show-for-sr"><div>');
    this.uploadAvatar = $('<div class="change-avatar-image"><label for="avatarUpload" class="button">Upload avatar</label><input type="file" accept="image/*" id="avatarUpload" class="show-for-sr"><div>');
    this.titleColor = $('<div class="change-title-color"><button type="button" class="button theme_title-color-btn btn-disabled">Change title color</button><div class="current-color_container current-title-color-box"></div></div>');
    this.textColor = $('<div class="change-text-color"><button type="button" class="button theme_text-color-btn btn-disabled">Change text color</button><div class="current-color_container current-text-color-box"></div></div>');
    this.descriptionColor = $('<div class="change-description-color"><button type="button" class="button theme_description-color-btn btn-disabled">Change description color</button><div class="current-color_container current-description-color-box"></div></div>');
    this.backgroundColor = $('<div class="change-background-color"><button type="button" class="button theme_background-color-btn btn-disabled">Change background color</button><div class="current-color_container current-background-color-box"></div></div>');
    this.secondaryEdit = $('<div class="edit-secondary-style">Some must be...</div>');
    this.save = $('<button id="save_theme" class="save-theme-btn large success button" type="button">Save</button>');
    this.background = $('<div class="main-background-area clearfix"></div>');
    this.avatar = $('<div class="avatar-container"><a href="/"><img class="print-only" alt=""></a></div>');
    this.name = $('<h3 class="name-article" id="main-name-article"></h3>');
    this.about = $('<p class="description user-about" id="user-description"></p>');
    this.mainInfo = $('<article class="full-width"><h4 class="user-description">Info</h4></article>');
    this.preview = $('<div id="theme_preview" class="theme-preview theme-preview-conrainer small-6 medium-8 large-8 column"></div>');
}

ThemeBox.prototype.build = function() {
    return this.container;
}

ThemeBox.prototype.saveToUser = function(elem) {
    var data = {
        backgroundFile: $('#backgroundUpload')[0].files[0],
        avatarFile: $('#avatarUpload')[0].files[0],
        textColor: hexc($('.current-text-color-box').css("background-color")),
        nameColor: hexc($('.current-title-color-box').css("background-color")),
        descriptionColor: hexc($('.current-description-color-box').css("background-color")),
        backgroundColor: hexc($('.current-background-color-box').css("background-color"))
    };
    
    var formData = new FormData();
    formData.append('uploadedBackground', data.backgroundFile);
    formData.append('uploadedAvatar', data.avatarFile);
    formData.append('textColor', data.textColor);
    formData.append('nameColor', data.nameColor);
    formData.append('descriptionColor', data.descriptionColor);
    formData.append('backgroundColor', data.backgroundColor);
    
    $.ajax({
        url: '/theme/save',
        dataType: 'json',
        method: 'POST',
        contentType: false,
        processData: false,
        data: formData,
        beforeSend: function() {
            elem.attr('disabled', '');
        },
        success: function(data) {
            elem.removeAttr('disabled');
            console.log('success send new theme');
            if (!data.error) {
                window.location.reload();
            } else {
                alert(data.error);
            }
        }
    });
}