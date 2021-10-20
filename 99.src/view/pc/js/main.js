$(document).ready(function() {
    if($('#hiddenIsLogin').val() == '1') {
        $('#navi-menu-login').hide();
    }
    else {
        $('#navi-menu-mypage').hide();
    }
});

function popupOpen_registerDonmmelier() {
    if (!$('#oathAgree').is(":checked")) {
        alert('한돈에 진심이어야 합니다.');
        return false;
    }

    $('.wrap').addClass('popup_open');
}

function registerDonmmelier(event) {
    if(event) {
        event.preventDefault();
        event.stopPropagation();
    }

    if (!$('#studyAgree').is(":checked")) {
        alert('개인정보 수집, 이용 및 SMS 수신에 동의하셔야 합니다.');
        return false;
    }
    
}