$(document).ready(function() {
    initExam();
});

var __TEMP_QUIZ_INFO_KEY = '';
var __TEMP_QUIZ_INFO = { type: 'a', answers: [], index: 0, remaining: 600 }
var __quiz_length = 20;
var __time_id = 0;

function initExam() {
    // __TEMP_QUIZ_INFO_KEY = 'quiz_' + $('#member_id').val() + '_' + getToday();
    __TEMP_QUIZ_INFO_KEY = 'quiz_' + 'dev' + '_' + getToday();
    var temp_info = decodeURIComponent(getCookie(__TEMP_QUIZ_INFO_KEY));
    if (temp_info) {
        __TEMP_QUIZ_INFO = JSON.parse(temp_info);
    } else {
        for (let i = 0; i < __quiz_length; i++) {
            __TEMP_QUIZ_INFO.answers[i] = 0;
        }
        __TEMP_QUIZ_INFO.type = generateQuizType();
        __TEMP_QUIZ_INFO.remaining = 600;
    }

    getQuizView(__TEMP_QUIZ_INFO.type, __TEMP_QUIZ_INFO.index);
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
    var hour = parseInt(seconds / 3600);
    var min = parseInt((seconds % 3600) / 60);
    var sec = seconds % 60;

    if (hour.toString().length == 1) hour = '0' + hour;
    if (min.toString().length == 1) min = '0' + min;
    if (sec.toString().length == 1) sec = '0' + sec;

    return min + ':' + sec;
}

function getQuizView(type, index) {
    __TEMP_QUIZ_INFO.index = index;
    type = (type + '').toLocaleUpperCase();
    if(type == 'a') {
        getQuizView_a(index);
    }
    else {
        getQuizView_b(index);
    }

    $('#quiz-prev-btn').show();
    $('#quiz-next-btn').show();
    $('#quiz-questions').empty();
}

function getQuizView_a(index) {
    switch(index) {
        case  0: { getQuizView_a_0(); } break;
        case  1: { getQuizView_a_1(); } break;
        case  2: { getQuizView_a_2(); } break;
        case  3: { getQuizView_a_3(); } break;
        case  4: { getQuizView_a_4(); } break;
        case  5: { getQuizView_a_5(); } break;
        case  6: { getQuizView_a_6(); } break;
        case  7: { getQuizView_a_7(); } break;
        case  8: { getQuizView_a_8(); } break;
        case  9: { getQuizView_a_9(); } break;
        case 10: { getQuizView_a_10(); } break;
        case 11: { getQuizView_a_11(); } break;
        case 12: { getQuizView_a_12(); } break;
        case 13: { getQuizView_a_13(); } break;
        case 14: { getQuizView_a_14(); } break;
        case 15: { getQuizView_a_15(); } break;
        case 16: { getQuizView_a_16(); } break;
        case 17: { getQuizView_a_17(); } break;
        case 18: { getQuizView_a_18(); } break;
        case 19: { getQuizView_a_19(); } break;
    }
}

function getQuizView_b(index) {
    switch(index) {
        case  0: { getQuizView_b_0(); } break;
        case  1: { getQuizView_b_1(); } break;
        case  2: { getQuizView_b_2(); } break;
        case  3: { getQuizView_b_3(); } break;
        case  4: { getQuizView_b_4(); } break;
        case  5: { getQuizView_b_5(); } break;
        case  6: { getQuizView_b_6(); } break;
        case  7: { getQuizView_b_7(); } break;
        case  8: { getQuizView_b_8(); } break;
        case  9: { getQuizView_b_9(); } break;
        case 10: { getQuizView_b_10(); } break;
        case 11: { getQuizView_b_11(); } break;
        case 12: { getQuizView_b_12(); } break;
        case 13: { getQuizView_b_13(); } break;
        case 14: { getQuizView_b_14(); } break;
        case 15: { getQuizView_b_15(); } break;
        case 16: { getQuizView_b_16(); } break;
        case 17: { getQuizView_b_17(); } break;
        case 18: { getQuizView_b_18(); } break;
        case 19: { getQuizView_b_19(); } break;
    }
}

function getQuizView_a_0() {
    $('#quiz-prev-btn').hide();

    var quiz_list_title = '<strong class="quiz_list_title"><span>1.</span> 다음 중 한돈에 대한 설명으로 옳은 것을 고르시오.</strong>';
    var quiz_list_items = '';
    quiz_list_items += '<ul class="quiz_list">';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(1);">';
    quiz_list_items += '            <span class="qlb_num">1.</span>한돈은 돼지고기 무게를 의미하는 것이다.';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(2);">';
    quiz_list_items += '            <span class="qlb_num">2.</span>한돈은 우리나라 진짜 돼지고기의 브랜드명이다.';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(3);">';
    quiz_list_items += '            <span class="qlb_num">3.</span>한돈은 우리나라 재래돼지로 아직도 많은 수가 길러지고 있다.';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(4);">';
    quiz_list_items += '            <span class="qlb_num">4.</span>한돈은 우리나라에서 사육된 국산 돼지고기를 일컫는 말이다.';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '</ul>';

    $('#quiz-number').text(1);
    $('#quiz-questions').append(quiz_list_title);
    $('#quiz-questions').append(quiz_list_items);
}

function getQuizView_a_1() { }
function getQuizView_a_2() { }
function getQuizView_a_3() { }
function getQuizView_a_4() { }
function getQuizView_a_5() { }
function getQuizView_a_6() { }
function getQuizView_a_7() { }
function getQuizView_a_8() { }
function getQuizView_a_9() { }
function getQuizView_a_10() { }
function getQuizView_a_11() { }
function getQuizView_a_12() { }
function getQuizView_a_13() { }
function getQuizView_a_14() { }
function getQuizView_a_15() { }
function getQuizView_a_16() { }
function getQuizView_a_17() { }
function getQuizView_a_18() { }
function getQuizView_a_19() { }

function getQuizView_b_0() { }
function getQuizView_b_1() { }
function getQuizView_b_2() { }
function getQuizView_b_3() { }
function getQuizView_b_4() { }
function getQuizView_b_5() { }
function getQuizView_b_6() { }
function getQuizView_b_7() { }
function getQuizView_b_8() { }
function getQuizView_b_9() { }
function getQuizView_b_10() { }
function getQuizView_b_11() { }
function getQuizView_b_12() { }
function getQuizView_b_13() { }
function getQuizView_b_14() { }
function getQuizView_b_15() { }
function getQuizView_b_16() { }
function getQuizView_b_17() { }
function getQuizView_b_18() { }
function getQuizView_b_19() { }