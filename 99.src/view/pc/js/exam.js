$(document).ready(function() {
    initExam();
});

var __TEMP_QUIZ_INFO_KEY = '';
var __TEMP_QUIZ_INFO = { type: 'a', answers: [], index: 0, remaining: 600 }
var __quiz_length = 20;
var __time_id = 0;

function initExam() {
    __TEMP_QUIZ_INFO_KEY = 'quiz_' + $('#member_id').val() + '_' + getToday();
    var temp_info = getCookie(__TEMP_QUIZ_INFO_KEY);
    if (temp_info) {
        __TEMP_QUIZ_INFO = JSON.parse(temp_info);
    } else {
        for (let i = 0; i < __quiz_length; i++) {
            __TEMP_QUIZ_INFO.answers[i] = 0;
        }
        __TEMP_QUIZ_INFO.type = generateQuizType();
        __TEMP_QUIZ_INFO.remaining = 600;
    }

    startTimer();
}

function generateQuizType() {
    var temp_num = Math.floor(Math.random() * 100) + 1;
    return ((temp_num % 2) == 0) ? 'a' : 'b';
}

function selectQuizList(index) {
    $('.quiz-list-item').removeClass('quiz_select');
    $($('.quiz-list-item')[(index - 1)]).addClass('quiz_select');
}

function getToday() {
    const today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth() + 1;
    let date = today.getDate();
    return year + month + date;
}

function startTimer() {
    __time_id = setInterval(function() {
        __TEMP_QUIZ_INFO.remaining -= 1;
        setCookie(__TEMP_QUIZ_INFO_KEY, JSON.stringify(__TEMP_QUIZ_INFO), 1);
        viewRemainingTime();

        if (__TEMP_QUIZ_INFO.remaining <= 0) {
            clearInterval(__time_id);

            // 시간 다된거 처리
        }
    }, 1000);
}

function viewRemainingTime() {
    $('#quiz-remaining-time').text(getTimeStringSeconds(__TEMP_QUIZ_INFO.remaining));
}

function getTimeStringSeconds(seconds) {
    var hour, min, sec;

    hour = parseInt(seconds / 3600);
    min = parseInt((seconds % 3600) / 60);
    sec = seconds % 60;

    if (hour.toString().length == 1) hour = '0' + hour;
    if (min.toString().length == 1) min = '0' + min;
    if (sec.toString().length == 1) sec = '0' + sec;

    return min + ':' + sec;
}