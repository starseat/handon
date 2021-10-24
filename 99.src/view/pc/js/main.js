$(document).ready(function() {
    if ($('#hiddenIsLogin').val() == '1') {
        $('#navi-menu-login').hide();
    }
});

function moveMyPage(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    var isLogin = $('#hiddenIsLogin').val();
    var isRegistered = $('#hiddenIsRegistered').val();

    if (isLogin == '1' && isRegistered == '1') {
        location.href = './mypage.php';
    } else if (isRegistered == '0') {
        location.href = './index.php#section_10';
    } else { // if (isLogin == '0') {
        alert('로그인이 필요합니다.');
        return false;
    }
}

function popupOpen_registerDonmmelier() {
    if (!$('#oathAgree').is(":checked")) {
        alert('한돈에 진심이어야 합니다.');
        return false;
    }

    if ($('#hiddenIsLogin').val() != '1') {
        alert('로그인이 필요합니다.');
        return false;
    }

    $('.wrap').addClass('popup_open');
}

function registerDonmmelier(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    if (!$('#studyAgree').is(":checked")) {
        alert('개인정보 수집, 이용 및 SMS 수신에 동의하셔야 합니다.');
        return false;
    }

    var name = $('#regi-name').val();
    var phone = $('#regi-phone1').val() + $('#regi-phone2').val() + $('#regi-phone3').val();

    var regx_name = /^[가-힣a-zA-Z]+$/;
    if (!regx_name.test(name)) {
        alert('성함 형식이 올바르지 않습니다.');
        return false;
    }

    var regx_phone = /^01([0|1|6|7|8|9])?([0-9]{3,4})?([0-9]{4})$/;
    if (!regx_phone.test(phone)) {
        alert('연락처 형식이 올바르지 않습니다.');
        return false;
    }

    var req_param = {
        regi_name: name,
        regi_phone: phone
    };

    $.ajax({
        type: 'post',
        url: './api_registration.php',
        data: req_param,
        dataType: 'json',
        success: function(resultData) {
            // console.log('[registerDonmmelier] ajax success. result:: ', result);
            if (resultData.result) {
                if (confirm(resultData.message + '\n마이페이지로 이동하시겠습니까?')) {
                    location.href = './mypage.php';
                }
            } else {
                alert('수강 신청에 실패하였습니다.');
                console.log('[registerDonmmelier] ajax success. result fail.. data: ', resultData);
                return false;
            }
        },
        error: function(xhr, status, error) {
            console.error('[registerDonmmelier] ajax error:: ', error);
        },
    });
}