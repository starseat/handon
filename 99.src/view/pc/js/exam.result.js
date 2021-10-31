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