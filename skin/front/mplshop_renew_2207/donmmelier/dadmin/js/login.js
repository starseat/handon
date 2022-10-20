$(document).ready(function() {});

function loginSubmit(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    if ($('#login_id').val() == '') {
        alert('아이디를 입력해 주세요.');
        $('#login_id').focus();
        return false;
    }

    if ($('#login_pw').val() == '') {
        alert('비밀번호를 입력해 주세요.');
        $('#login_pw').focus();
        return false;
    }

    $('#donmmLoginForm').attr('action', './login_action.php')
    $('#donmmLoginForm').submit();

    // $.post('./login_action.php', $('#donmmLoginForm').serializeObject()).done(function(data, textStatus, jqXhr) {
    //     console.log('[loginSubmit] data: ', data);
    // });

    // var req_param = {
    //     login_id: $('#login_id').val(),
    //     login_pw: $('#login_pw').val()
    // };

    // $.ajax({
    //     type: 'post',
    //     url: './login_action.php',
    //     data: req_param,
    //     // dataType: 'json',
    //     success: function(resultData) {
    //         console.log('[loginSubmit] ajax success. result data: ', resultData);

    //     },
    //     error: function(xhr, status, error) {
    //         console.error('[loginSubmit] ajax error:: ', error);
    //     },
    // });
}