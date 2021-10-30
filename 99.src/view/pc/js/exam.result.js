$(document).ready(function() {
    var isPass = $('#hiddenIsPass').val();
    if (isPass == '1') {
        $('#donmm-quiz-result-box-succ').show();
    } else {
        var examNum = parseInt($('#hiddenExamNum').val(), 10);
        if (examNum > 1) {
            $('#donmm-quiz-result-box-fail-all').show();
        } else {
            $('#donmm-quiz-result-box-fail').show();
        }
    }
    $('#donmm-quiz-result-box').show();
});

function movePage(pageName) {
    var _link = './mypage.php';
    if (pageName == 'quiz') {
        _link = 'exam_init.php';
    } else if (pageName == 'license') {
        _link = 'license.php';
    }

    location.href = _link;
}