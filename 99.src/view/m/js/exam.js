$(document).ready(function() {
    initExam();
});

var __TEMP_QUIZ_INFO_KEY = '';
var __TEMP_QUIZ_TYPE = 'a';
var __TEMP_QUIZ_INFO = { selectList: [], index: 0, remaining: 600 }
var __quiz_length = 20;
var __time_id = 0;

function initExam() {
    __TEMP_QUIZ_TYPE = $('#exam_type').val();
    if (__TEMP_QUIZ_TYPE) {
        if (__TEMP_QUIZ_TYPE != 'a' || __TEMP_QUIZ_TYPE != 'b') {
            __TEMP_QUIZ_TYPE = 'a';
        }
    } else {
        __TEMP_QUIZ_TYPE = 'a';
    }
    __TEMP_QUIZ_INFO_KEY = 'donmm_quiz_' + $('#member_id').val() + '_' + $('#exam_number').val();
    // __TEMP_QUIZ_INFO_KEY = 'quiz_' + 'dev' + '_' + getToday();
    var temp_info = decodeURIComponent(getCookie(__TEMP_QUIZ_INFO_KEY));
    if (typeof temp_info != 'undefined' && temp_info != null && temp_info != 'null') {
        __TEMP_QUIZ_INFO = JSON.parse(temp_info);
    } else {
        for (let i = 0; i < __quiz_length; i++) {
            __TEMP_QUIZ_INFO.selectList[i] = 0;
        }
        __TEMP_QUIZ_INFO.remaining = 600;
    }

    getQuizView(__TEMP_QUIZ_INFO.index);
    startTimer();
}

function generateQuizType() {
    var temp_num = Math.floor((Math.random() * 2)) + 1;
    return (temp_num == 1) ? 'a' : 'b';
}

function selectQuizList(num) {
    $('.quiz-list-item').removeClass('quiz_select');
    $($('.quiz-list-item')[(num - 1)]).addClass('quiz_select');

    __TEMP_QUIZ_INFO.selectList[__TEMP_QUIZ_INFO.index] = num;
    setCookie(__TEMP_QUIZ_INFO_KEY, JSON.stringify(__TEMP_QUIZ_INFO), 1);
}

function getToday() {
    const today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth() + 1;
    let date = today.getDate();
    return year + month + date;
}

function startTimer() {
    if (__TEMP_QUIZ_INFO.remaining <= 0) {
        __TEMP_QUIZ_INFO.remaining = 0;
        viewRemainingTime();
        return false;
    }

    __time_id = setInterval(function() {
        __TEMP_QUIZ_INFO.remaining -= 1;
        setCookie(__TEMP_QUIZ_INFO_KEY, JSON.stringify(__TEMP_QUIZ_INFO), 1);
        viewRemainingTime();

        if (__TEMP_QUIZ_INFO.remaining <= 0) {
            clearInterval(__time_id);
            __TEMP_QUIZ_INFO.remaining = 0;

            alert('시간이 초가되었습니다. 강제로 제출됩니다.');
            _submitQuiz();
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

function submitQuiz(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    var isSubmit = true;
    for (let i = 0; i < __quiz_length; i++) {
        if (__TEMP_QUIZ_INFO.selectList[i] == 0) {
            if (!confirm(parseInt((i + 1), 10) + '번 문제를 풀지 않으셨습니다. 그래도 제출하시겠습니까?')) {
                isSubmit = false;
            }
            break;
        }
    }

    if (isSubmit) {
        _submitQuiz();
    }
}

function _submitQuiz() {
    var $tempForm = $('<form></form>');
    $tempForm.attr('id', 'temp-submit-form');
    $tempForm.attr('name', 'temp-submit-form');
    $tempForm.attr('method', 'post');
    $tempForm.attr('action', './exam_submit.php');
    $tempForm.appendTo('#hidden-view-box');

    for (let i = 0; i < __quiz_length; i++) {
        $tempForm.append('<input type="hidden" name="select_answer_' + i + '" value="' + __TEMP_QUIZ_INFO.selectList[i] + '">');
    }

    $tempForm.append('<input type="hidden" name="quiz_type" value="' + __TEMP_QUIZ_TYPE + '">');
    delCookie(__TEMP_QUIZ_INFO_KEY)
    $tempForm.submit();
}

function movePrevQuiz(index) {
    if (__TEMP_QUIZ_INFO.selectList[__TEMP_QUIZ_INFO.index] == 0) {
        alert('답변이 선택되지 않았습니다.');
    }
    getQuizView(index);
}

function moveNextQuiz(index) {
    if (__TEMP_QUIZ_INFO.selectList[__TEMP_QUIZ_INFO.index] == 0) {
        alert('답변이 선택되지 않았습니다.');
    }
    getQuizView(index);
}


function getQuizView(index) {
    __TEMP_QUIZ_INFO.index = index;
    $('#quiz-prev-btn').attr('onclick', 'movePrevQuiz(' + parseInt((index - 1), 10) + ')').show();
    $('#quiz-next-btn').attr('onclick', 'movePrevQuiz(' + parseInt((index + 1), 10) + ')').show();
    $('#quiz-questions').empty();

    $('#quiz-submit-btn').hide();

    type = (__TEMP_QUIZ_TYPE + '').toLocaleLowerCase();
    if (type == 'a') {
        getQuizView_a(index);
    } else {
        getQuizView_b(index);
    }

    if (__TEMP_QUIZ_INFO.selectList[__TEMP_QUIZ_INFO.index] > 0) {
        $('.quiz-list-item').eq(__TEMP_QUIZ_INFO.selectList[__TEMP_QUIZ_INFO.index] - 1).addClass('quiz_select');
    }
}

function getQuizView_a(index) {
    switch (index) {
        case 0:
            { getQuizView_a_0(); }
            break;
        case 1:
            { getQuizView_a_1(); }
            break;
        case 2:
            { getQuizView_a_2(); }
            break;
        case 3:
            { getQuizView_a_3(); }
            break;
        case 4:
            { getQuizView_a_4(); }
            break;
        case 5:
            { getQuizView_a_5(); }
            break;
        case 6:
            { getQuizView_a_6(); }
            break;
        case 7:
            { getQuizView_a_7(); }
            break;
        case 8:
            { getQuizView_a_8(); }
            break;
        case 9:
            { getQuizView_a_9(); }
            break;
        case 10:
            { getQuizView_a_10(); }
            break;
        case 11:
            { getQuizView_a_11(); }
            break;
        case 12:
            { getQuizView_a_12(); }
            break;
        case 13:
            { getQuizView_a_13(); }
            break;
        case 14:
            { getQuizView_a_14(); }
            break;
        case 15:
            { getQuizView_a_15(); }
            break;
        case 16:
            { getQuizView_a_16(); }
            break;
        case 17:
            { getQuizView_a_17(); }
            break;
        case 18:
            { getQuizView_a_18(); }
            break;
        case 19:
            { getQuizView_a_19(); }
            break;
    }
}

function getQuizView_b(index) {
    switch (index) {
        case 0:
            { getQuizView_b_0(); }
            break;
        case 1:
            { getQuizView_b_1(); }
            break;
        case 2:
            { getQuizView_b_2(); }
            break;
        case 3:
            { getQuizView_b_3(); }
            break;
        case 4:
            { getQuizView_b_4(); }
            break;
        case 5:
            { getQuizView_b_5(); }
            break;
        case 6:
            { getQuizView_b_6(); }
            break;
        case 7:
            { getQuizView_b_7(); }
            break;
        case 8:
            { getQuizView_b_8(); }
            break;
        case 9:
            { getQuizView_b_9(); }
            break;
        case 10:
            { getQuizView_b_10(); }
            break;
        case 11:
            { getQuizView_b_11(); }
            break;
        case 12:
            { getQuizView_b_12(); }
            break;
        case 13:
            { getQuizView_b_13(); }
            break;
        case 14:
            { getQuizView_b_14(); }
            break;
        case 15:
            { getQuizView_b_15(); }
            break;
        case 16:
            { getQuizView_b_16(); }
            break;
        case 17:
            { getQuizView_b_17(); }
            break;
        case 18:
            { getQuizView_b_18(); }
            break;
        case 19:
            { getQuizView_b_19(); }
            break;
    }
}

// 1 ~ 3
function viewQuizTitleClass1() {
    $('#quiz-class').text('제 1교시');
    $('#quiz-title').text('한돈 그것을 알려드림');
}

// 4 ~ 8
function viewQuizTitleClass2() {
    $('#quiz-class').text('제 2교시');
    $('#quiz-title').text('한돈학개론');
}

// 9 ~ 20
function viewQuizTitleClass3() {
    $('#quiz-class').text('제 3교시');
    $('#quiz-title').text('한돈 굽고 인싸되기!');
}

////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
// Quiz - A
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

    viewQuizTitleClass1();
}

function getQuizView_a_1() {
    var quiz_list_title = '<strong class="quiz_list_title"><span>2.</span>식당에서 삼겹살 로스구이가 유행한 시점은 언제부터인가?</strong>';
    var quiz_list_items = '';
    quiz_list_items += '<ul class="quiz_list">';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(1);">';
    quiz_list_items += '            <span class="qlb_num">1.</span>1930년대 후반';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(2);">';
    quiz_list_items += '            <span class="qlb_num">2.</span>1950년대 초반';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(3);">';
    quiz_list_items += '            <span class="qlb_num">3.</span>1970년대 후반';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(4);">';
    quiz_list_items += '            <span class="qlb_num">4.</span>1990년대 초반';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '</ul>';

    $('#quiz-number').text(2);
    $('#quiz-questions').append(quiz_list_title);
    $('#quiz-questions').append(quiz_list_items);

    viewQuizTitleClass1();
}

function getQuizView_a_2() {
    var quiz_list_title = '<strong class="quiz_list_title"><span>3.</span>[보기] 중 한돈의 특성으로 옳은 것을 모두 고르시오.</strong>';
    var quiz_list_items = '';
    quiz_list_items += '<div class="quiz_ex_box">';
    quiz_list_items += '    <ul class="quiz_ex_list">';
    quiz_list_items += '        <li>가. 돼지고기의 체지방률은 15%이하이다.</li>';
    quiz_list_items += '        <li>나. 돼지고기는 지방율이 높아서 건강에 좋지 않다.</li>';
    quiz_list_items += '        <li>다. 등심, 안심, 뒷다리, 앞다리 등 지방이 적은 부위는 단백질 섭취와 다이어트에 좋다.</li>';
    quiz_list_items += '        <li>라. 돼지고기를 먹으면 청소년들의 두뇌가 둔해진다.</li>';
    quiz_list_items += '        <li>마. 돼지고기를 먹으면 근육 형성에 도움이 된다.</li>';
    quiz_list_items += '    </ul>';
    quiz_list_items += '</div>';
    quiz_list_items += '<ul class="quiz_list quiz_type2">';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(1);">';
    quiz_list_items += '            <span class="qlb_num">1.</span>다, 마';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(2);">';
    quiz_list_items += '            <span class="qlb_num">2.</span>가, 나';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(3);">';
    quiz_list_items += '            <span class="qlb_num">3.</span>나, 다, 라';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(4);">';
    quiz_list_items += '            <span class="qlb_num">4.</span>가, 다, 마';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '</ul>';

    $('#quiz-number').text(3);
    $('#quiz-questions').append(quiz_list_title);
    $('#quiz-questions').append(quiz_list_items);

    viewQuizTitleClass1();
}

function getQuizView_a_3() {
    var quiz_list_title = '<strong class="quiz_list_title"><span>4.</span>다음 중 돼지고기의 특수 부위에 속하는 부위를 고르시오. </strong>';
    var quiz_list_items = '';
    quiz_list_items += '<ul class="quiz_list">';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(1);">';
    quiz_list_items += '            <span class="qlb_num">1.</span>갈비';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(2);">';
    quiz_list_items += '            <span class="qlb_num">2.</span>삼겹살';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(3);">';
    quiz_list_items += '            <span class="qlb_num">3.</span>뒷다리';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(4);">';
    quiz_list_items += '            <span class="qlb_num">4.</span>항정살';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '</ul>';

    $('#quiz-number').text(4);
    $('#quiz-questions').append(quiz_list_title);
    $('#quiz-questions').append(quiz_list_items);

    viewQuizTitleClass2();
}

function getQuizView_a_4() {
    var quiz_list_title = '<strong class="quiz_list_title"><span>5.</span>다음 중 앞다리에 포함되지 않는 부위를 고르시오.</strong>';
    var quiz_list_items = '';
    quiz_list_items += '<ul class="quiz_list">';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(1);">';
    quiz_list_items += '            <span class="qlb_num">1.</span>앞다리살';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(2);">';
    quiz_list_items += '            <span class="qlb_num">2.</span>도가니살';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(3);">';
    quiz_list_items += '            <span class="qlb_num">3.</span>항정살';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(4);">';
    quiz_list_items += '            <span class="qlb_num">4.</span>꾸리살';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '</ul>';

    $('#quiz-number').text(5);
    $('#quiz-questions').append(quiz_list_title);
    $('#quiz-questions').append(quiz_list_items);

    viewQuizTitleClass2();
}

function getQuizView_a_5() {
    var quiz_list_title = '<strong class="quiz_list_title"><span>6.</span>다음 그림의 돼지고기 부위명을 옳게 작성한 것을 고르시오.</strong>';
    var quiz_list_items = '';
    quiz_list_items += '<div class="quiz_ex_box">';
    quiz_list_items += '    <img src="./imgs/pc/quiz_pig.jpg" alt="돼지 부위">';
    quiz_list_items += '</div>';
    quiz_list_items += '<ul class="quiz_list quiz_type2">';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(1);">';
    quiz_list_items += '            <span class="qlb_num">1.</span>가-갈비';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(2);">';
    quiz_list_items += '            <span class="qlb_num">2.</span>나-등심';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(3);">';
    quiz_list_items += '            <span class="qlb_num">3.</span>다-목살';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(4);">';
    quiz_list_items += '            <span class="qlb_num">4.</span>바-안심';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '</ul>';

    $('#quiz-number').text(6);
    $('#quiz-questions').append(quiz_list_title);
    $('#quiz-questions').append(quiz_list_items);

    viewQuizTitleClass2();
}

function getQuizView_a_6() {
    var quiz_list_title = '<strong class="quiz_list_title"><span>7.</span> 한돈에 특히 풍부하며 원기회복과 면역력에 탁월한 영양소는 무엇인가? </strong>';
    var quiz_list_items = '';
    quiz_list_items += '<ul class="quiz_list">';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(1);">';
    quiz_list_items += '            <span class="qlb_num">1.</span>비타민B1';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(2);">';
    quiz_list_items += '            <span class="qlb_num">2.</span>탄수화물';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(3);">';
    quiz_list_items += '            <span class="qlb_num">3.</span>불포화지방';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(4);">';
    quiz_list_items += '            <span class="qlb_num">4.</span>포도당';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '</ul>';

    $('#quiz-number').text(7);
    $('#quiz-questions').append(quiz_list_title);
    $('#quiz-questions').append(quiz_list_items);

    viewQuizTitleClass2();
}

function getQuizView_a_7() {
    var quiz_list_title = '<strong class="quiz_list_title"><span>8.</span> 한돈과 수입육의 차이로 옳지 않은 것은 무엇인가? </strong>';
    var quiz_list_items = '';
    quiz_list_items += '<ul class="quiz_list">';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(1);">';
    quiz_list_items += '            <span class="qlb_num">1.</span>';
    quiz_list_items += '            한돈은 국내유통이므로 유통과정이 투명하나 수입육은<br/>유통과정이 불명확하다.';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(2);">';
    quiz_list_items += '            <span class="qlb_num">2.</span>';
    quiz_list_items += '            한돈은 냉장육 위주로 유통되나 수입육은 냉동육으로<br/> 유통된다.';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(3);">';
    quiz_list_items += '            <span class="qlb_num">3.</span>';
    quiz_list_items += '            한돈은 HACCP 인증을 받아 안전성 검증을 받았다.';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(4);">';
    quiz_list_items += '            <span class="qlb_num">4.</span>';
    quiz_list_items += '            한돈은 국내에서 다양한 사료를 먹여 품종 변이가 많지만<br/> 수입육은 단일 품종으로 수입된다.';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '</ul>';

    $('#quiz-number').text(8);
    $('#quiz-questions').append(quiz_list_title);
    $('#quiz-questions').append(quiz_list_items);

    viewQuizTitleClass2();
}

function getQuizView_a_8() {
    var quiz_list_title = '<strong class="quiz_list_title"><span>9.</span>다음 중 옳지 않은 이야기를 하는 사람을 고르시오.</strong>';
    var quiz_list_items = '';
    quiz_list_items += '<ul class="quiz_list">';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(1);">';
    quiz_list_items += '            <span class="qlb_num">1.</span>';
    quiz_list_items += '            김한돈 : 고단백 저지방 부위인 부위는 한꺼번에 먹지말고<br/>적정량을 나누어 꾸준히 먹는 것이 몸에 더 좋대.';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(2);">';
    quiz_list_items += '            <span class="qlb_num">2.</span>';
    quiz_list_items += '            장산적 : 돼지고기는 크게 7가지 부위육으로 구분되지. 등심, 안심, 갈비살, 삼겹살, 목살, 앞다리살, 그리고 뒷다리살!';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(3);">';
    quiz_list_items += '            <span class="qlb_num">3.</span>';
    quiz_list_items += '            한알바 : 돼지고기 지방이 많은 부위를 먹을 때는 지방을 다<br/>떼내고 먹어야 좋대. 지방은 몸에 좋지 않잖아.';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(4);">';
    quiz_list_items += '            <span class="qlb_num">4.</span>';
    quiz_list_items += '            김하은 : 오늘부터 다이어트야! 한돈 안심과 뒷다리살, 고단백 저지방 부위를 먹으면 다이어트에 아주 효과적일거야!';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '</ul>';

    $('#quiz-number').text(9);
    $('#quiz-questions').append(quiz_list_title);
    $('#quiz-questions').append(quiz_list_items);

    viewQuizTitleClass3();
}

function getQuizView_a_9() {
    var quiz_list_title = '<strong class="quiz_list_title"><span>10.</span>삼겹살을 이루고 있는 소분할육을 올바로 작성한 것을<br/>고르시오.</strong>';
    var quiz_list_items = '';
    quiz_list_items += '<ul class="quiz_list">';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(1);">';
    quiz_list_items += '            <span class="qlb_num">1.</span>삼겹살, 갈비살, 토시살, 갈매기살, 부채살';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(2);">';
    quiz_list_items += '            <span class="qlb_num">2.</span>삼겹살, 토시살, 등갈비, 갈매기살, 오돌삼겹';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(3);">';
    quiz_list_items += '            <span class="qlb_num">3.</span>갈비살, 등갈비, 갈매기살, 오돌삼겹, 항정살';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(4);">';
    quiz_list_items += '            <span class="qlb_num">4.</span>토시살, 등갈비, 부채살, 홍두깨살, 삼겹살';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '</ul>';

    $('#quiz-number').text(10);
    $('#quiz-questions').append(quiz_list_title);
    $('#quiz-questions').append(quiz_list_items);

    viewQuizTitleClass3();
}

function getQuizView_a_10() {
    var quiz_list_title = '<strong class="quiz_list_title"><span>11.</span>다음 중 옳지 않은 설명을 고르시오.</strong>';
    var quiz_list_items = '';
    quiz_list_items += '<ul class="quiz_list">';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(1);">';
    quiz_list_items += '            <span class="qlb_num">1.</span>';
    quiz_list_items += '            갈매기살은 돼지고기 한 마리당 약 300~400g정도만 <br/>얻을 수 있다.';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(2);">';
    quiz_list_items += '            <span class="qlb_num">2.</span>';
    quiz_list_items += '            안심은 고단백 저지방 부위이다.';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(3);">';
    quiz_list_items += '            <span class="qlb_num">3.</span>';
    quiz_list_items += '            앞다리살에 있는 대표적 특수부위는 항정살이다.';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(4);">';
    quiz_list_items += '            <span class="qlb_num">4.</span>';
    quiz_list_items += '            등심은 적색근섬유가 많아서 피로회복에 도움을 준다.';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '</ul>';

    $('#quiz-number').text(11);
    $('#quiz-questions').append(quiz_list_title);
    $('#quiz-questions').append(quiz_list_items);

    viewQuizTitleClass3();
}

function getQuizView_a_11() {
    var quiz_list_title = '<strong class="quiz_list_title"><span>12.</span>뒷다리살의 특징으로 옳은 것을 고르시오. </strong>';
    var quiz_list_items = '';
    quiz_list_items += '<ul class="quiz_list">';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(1);">';
    quiz_list_items += '            <span class="qlb_num">1.</span>주로 불고기나 수육으로 이용된다.';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(2);">';
    quiz_list_items += '            <span class="qlb_num">2.</span>퍽퍽한 맛 때문에 요리하기가 힘들다.';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(3);">';
    quiz_list_items += '            <span class="qlb_num">3.</span>돼지고기 부위 중 양이 많지 않은 부위이다.';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(4);">';
    quiz_list_items += '            <span class="qlb_num">4.</span>지방이 많이 포함된 부위이다.';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '</ul>';

    $('#quiz-number').text(12);
    $('#quiz-questions').append(quiz_list_title);
    $('#quiz-questions').append(quiz_list_items);

    viewQuizTitleClass3();
}

function getQuizView_a_12() {
    var quiz_list_title = '<strong class="quiz_list_title"><span>13.</span>돼지와 돼지고기의 거래 단계별 정보를 기록하고 관리하여 위생, 안전에 문제가 발생한 경우 신속하게 대처하기 위한 제도는 무엇인가?</strong>';
    var quiz_list_items = '';
    quiz_list_items += '<ul class="quiz_list">';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(1);">';
    quiz_list_items += '            <span class="qlb_num">1.</span>돼지고기 관리제도';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(2);">';
    quiz_list_items += '            <span class="qlb_num">2.</span>한돈 추적제도';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(3);">';
    quiz_list_items += '            <span class="qlb_num">3.</span>돼지고기 이력제도';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(4);">';
    quiz_list_items += '            <span class="qlb_num">4.</span>돼지고기 안전인증 제도';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '</ul>';

    $('#quiz-number').text(13);
    $('#quiz-questions').append(quiz_list_title);
    $('#quiz-questions').append(quiz_list_items);

    viewQuizTitleClass3();
}

function getQuizView_a_13() {
    var quiz_list_title = '<strong class="quiz_list_title"><span>14.</span>고기를 구운 후 레스팅은 상온에서 몇초 정도 노출을<br/> 시키는것이 적정한가? </strong>';
    var quiz_list_items = '';
    quiz_list_items += '<ul class="quiz_list">';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(1);">';
    quiz_list_items += '            <span class="qlb_num">1.</span>30초 - 1분';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(2);">';
    quiz_list_items += '            <span class="qlb_num">2.</span>10초 - 30초';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(3);">';
    quiz_list_items += '            <span class="qlb_num">3.</span>20초 – 40초';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(4);">';
    quiz_list_items += '            <span class="qlb_num">4.</span>1분 이상';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '</ul>';

    $('#quiz-number').text(14);
    $('#quiz-questions').append(quiz_list_title);
    $('#quiz-questions').append(quiz_list_items);

    viewQuizTitleClass3();
}

function getQuizView_a_14() {
    var quiz_list_title = '<strong class="quiz_list_title"><span>15.</span>다음 중 가정에서 식당처럼 먹을 수 있는 삼겹살의 두께는? </strong>';
    var quiz_list_items = '';
    quiz_list_items += '<ul class="quiz_list">';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(1);">';
    quiz_list_items += '            <span class="qlb_num">1.</span>약 1cm - 2cm';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(2);">';
    quiz_list_items += '            <span class="qlb_num">2.</span>약 2cm- 3cm';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(3);">';
    quiz_list_items += '            <span class="qlb_num">3.</span>약 3cm - 4cm';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(4);">';
    quiz_list_items += '            <span class="qlb_num">4.</span>약 4cm 이상';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '</ul>';

    $('#quiz-number').text(15);
    $('#quiz-questions').append(quiz_list_title);
    $('#quiz-questions').append(quiz_list_items);

    viewQuizTitleClass3();
}

function getQuizView_a_15() {
    var quiz_list_title = '<strong class="quiz_list_title"><span>16.</span>현재 우리가 먹는 돼지고기는<br/>우리나라 전통 돼지를 사육한 돼지고기이다</strong>';
    var quiz_list_items = '';
    quiz_list_items += '<ul class="quiz_list quiz_type3">';
    quiz_list_items += '    <li class="quiz-list-item"><button type="button" class="quiz_list_btn" onclick="selectQuizList(1);">O</button></li>';
    quiz_list_items += '    <li class="quiz-list-item"><button type="button" class="quiz_list_btn" onclick="selectQuizList(2);">X</button></li>';
    quiz_list_items += '</ul>';

    $('#quiz-number').text(16);
    $('#quiz-questions').append(quiz_list_title);
    $('#quiz-questions').append(quiz_list_items);

    viewQuizTitleClass3();
}

function getQuizView_a_16() {
    var quiz_list_title = '<strong class="quiz_list_title"><span>17.</span>한돈은 우리나라 사람들의 입맛에 맞게 개량되어왔다</strong>';
    var quiz_list_items = '';
    quiz_list_items += '<ul class="quiz_list quiz_type3">';
    quiz_list_items += '    <li class="quiz-list-item"><button type="button" class="quiz_list_btn" onclick="selectQuizList(1);">O</button></li>';
    quiz_list_items += '    <li class="quiz-list-item"><button type="button" class="quiz_list_btn" onclick="selectQuizList(2);">X</button></li>';
    quiz_list_items += '</ul>';

    $('#quiz-number').text(17);
    $('#quiz-questions').append(quiz_list_title);
    $('#quiz-questions').append(quiz_list_items);

    viewQuizTitleClass3();
}

function getQuizView_a_17() {
    var quiz_list_title = '<strong class="quiz_list_title"><span>18.</span>삼겹살은 통칭 갈비로 불리었다 </strong>';
    var quiz_list_items = '';
    quiz_list_items += '<ul class="quiz_list quiz_type3">';
    quiz_list_items += '    <li class="quiz-list-item"><button type="button" class="quiz_list_btn" onclick="selectQuizList(1);">O</button></li>';
    quiz_list_items += '    <li class="quiz-list-item"><button type="button" class="quiz_list_btn" onclick="selectQuizList(2);">X</button></li>';
    quiz_list_items += '</ul>';

    $('#quiz-number').text(18);
    $('#quiz-questions').append(quiz_list_title);
    $('#quiz-questions').append(quiz_list_items);

    viewQuizTitleClass3();
}

function getQuizView_a_18() {
    var quiz_list_title = '<strong class="quiz_list_title"><span>19.</span>오래전부터 돼지고기는 부위별로 판매되었다</strong>';
    var quiz_list_items = '';
    quiz_list_items += '<ul class="quiz_list quiz_type3">';
    quiz_list_items += '    <li class="quiz-list-item"><button type="button" class="quiz_list_btn" onclick="selectQuizList(1);">O</button></li>';
    quiz_list_items += '    <li class="quiz-list-item"><button type="button" class="quiz_list_btn" onclick="selectQuizList(2);">X</button></li>';
    quiz_list_items += '</ul>';

    $('#quiz-number').text(19);
    $('#quiz-questions').append(quiz_list_title);
    $('#quiz-questions').append(quiz_list_items);

    viewQuizTitleClass3();
}

function getQuizView_a_19() {
    $('#quiz-next-btn').hide();
    $('#quiz-submit-btn').show();

    var quiz_list_title = '<strong class="quiz_list_title"><span>20.</span>모든 고기는 딱 2번만 뒤집는거다</strong>';
    var quiz_list_items = '';
    quiz_list_items += '<ul class="quiz_list quiz_type3">';
    quiz_list_items += '    <li class="quiz-list-item"><button type="button" class="quiz_list_btn" onclick="selectQuizList(1);">O</button></li>';
    quiz_list_items += '    <li class="quiz-list-item"><button type="button" class="quiz_list_btn" onclick="selectQuizList(2);">X</button></li>';
    quiz_list_items += '</ul>';

    $('#quiz-number').text(20);
    $('#quiz-questions').append(quiz_list_title);
    $('#quiz-questions').append(quiz_list_items);

    viewQuizTitleClass3();
}

////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
// Quiz - B
function getQuizView_b_0() {
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

    viewQuizTitleClass1();
}

function getQuizView_b_1() {
    var quiz_list_title = '<strong class="quiz_list_title"><span>2.</span>과거 1950년대 가장 먼저 구이로 먹기 시작한 부위는 어디인가?</strong>';
    var quiz_list_items = '';
    quiz_list_items += '<ul class="quiz_list">';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(1);">';
    quiz_list_items += '            <span class="qlb_num">1.</span>목살';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(2);">';
    quiz_list_items += '            <span class="qlb_num">2.</span>갈비';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(3);">';
    quiz_list_items += '            <span class="qlb_num">3.</span>가브리살';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(4);">';
    quiz_list_items += '            <span class="qlb_num">4.</span>항정살';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '</ul>';

    $('#quiz-number').text(2);
    $('#quiz-questions').append(quiz_list_title);
    $('#quiz-questions').append(quiz_list_items);

    viewQuizTitleClass1();
}

function getQuizView_b_2() {
    var quiz_list_title = '<strong class="quiz_list_title"><span>3.</span>[보기] 중 한돈의 특성으로 옳은 것을 모두 고르시오.</strong>';
    var quiz_list_items = '';
    quiz_list_items += '<div class="quiz_ex_box">';
    quiz_list_items += '    <ul class="quiz_ex_list">';
    quiz_list_items += '        <li>가. 돼지고기의 체지방률은 15%이하이다.</li>';
    quiz_list_items += '        <li>나. 돼지고기는 지방율이 높아서 건강에 좋지 않다.</li>';
    quiz_list_items += '        <li>다. 등심, 안심, 뒷다리, 앞다리 등 지방이 적은 부위는 단백질 섭취와 다이어트에 좋다.</li>';
    quiz_list_items += '        <li>라. 돼지고기를 먹으면 청소년들의 두뇌가 둔해진다.</li>';
    quiz_list_items += '        <li>마. 돼지고기를 먹으면 근육 형성에 도움이 된다.</li>';
    quiz_list_items += '    </ul>';
    quiz_list_items += '</div>';
    quiz_list_items += '<ul class="quiz_list quiz_type2">';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(1);">';
    quiz_list_items += '            <span class="qlb_num">1.</span>다, 마';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(2);">';
    quiz_list_items += '            <span class="qlb_num">2.</span>가, 나';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(3);">';
    quiz_list_items += '            <span class="qlb_num">3.</span>나, 다, 라';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(4);">';
    quiz_list_items += '            <span class="qlb_num">4.</span>가, 다, 마';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '</ul>';

    $('#quiz-number').text(3);
    $('#quiz-questions').append(quiz_list_title);
    $('#quiz-questions').append(quiz_list_items);

    viewQuizTitleClass1();
}

function getQuizView_b_3() {
    var quiz_list_title = '<strong class="quiz_list_title"><span>4.</span>다음 중 돼지고기의 특수 부위가 아닌 부위를 고르시오.</strong>';
    var quiz_list_items = '';
    quiz_list_items += '<ul class="quiz_list">';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(1);">';
    quiz_list_items += '            <span class="qlb_num">1.</span>항정살';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(2);">';
    quiz_list_items += '            <span class="qlb_num">2.</span>가브리살';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(3);">';
    quiz_list_items += '            <span class="qlb_num">3.</span>안심';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(4);">';
    quiz_list_items += '            <span class="qlb_num">4.</span>홍두깨살';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '</ul>';

    $('#quiz-number').text(4);
    $('#quiz-questions').append(quiz_list_title);
    $('#quiz-questions').append(quiz_list_items);

    viewQuizTitleClass2();
}

function getQuizView_b_4() {
    var quiz_list_title = '<strong class="quiz_list_title"><span>5.</span>다음 그림의 돼지고기 부위명을 옳게 작성한 것을 고르시오.</strong>';
    var quiz_list_items = '';
    quiz_list_items += '<div class="quiz_ex_box">';
    quiz_list_items += '    <img src="./imgs/pc/quiz_pig.jpg" alt="돼지 부위">';
    quiz_list_items += '</div>';
    quiz_list_items += '<ul class="quiz_list quiz_type2">';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(1);">';
    quiz_list_items += '            <span class="qlb_num">1.</span>가-갈비, 나-등심';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(2);">';
    quiz_list_items += '            <span class="qlb_num">2.</span>나-등심, 바-앞다리';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(3);">';
    quiz_list_items += '            <span class="qlb_num">3.</span>라-안심, 마-삼겹살';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(4);">';
    quiz_list_items += '            <span class="qlb_num">4.</span>사-삼겹살, 가-등심';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '</ul>';

    $('#quiz-number').text(5);
    $('#quiz-questions').append(quiz_list_title);
    $('#quiz-questions').append(quiz_list_items);

    viewQuizTitleClass2();
}

function getQuizView_b_5() {
    var quiz_list_title = '<strong class="quiz_list_title"><span>6.</span>다음 중 한돈의 우수한 점으로 옳지 않은 것은 무엇인가?</strong>';
    var quiz_list_items = '';
    quiz_list_items += '<ul class="quiz_list">';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(1);">';
    quiz_list_items += '            <span class="qlb_num">1.</span>비타민이 풍부하여 면역력 증진에 좋다.';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(2);">';
    quiz_list_items += '            <span class="qlb_num">2.</span>';
    quiz_list_items += '            저지방 고단백 식품이며 호르몬과 근육 유지에 좋은<br/> 아미노산이 풍부하다.';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(3);">';
    quiz_list_items += '            <span class="qlb_num">3.</span>';
    quiz_list_items += '            불포화 지방과 포화 지방의 비율이 5:5라 지방 보충에<br/> 탁월하다.';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(4);">';
    quiz_list_items += '            <span class="qlb_num">4.</span>';
    quiz_list_items += '            미네랄, 셀레늄 등은 항노화 효능이 있다.';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '</ul>';

    $('#quiz-number').text(6);
    $('#quiz-questions').append(quiz_list_title);
    $('#quiz-questions').append(quiz_list_items);

    viewQuizTitleClass2();
}

function getQuizView_b_6() {
    var quiz_list_title = '<strong class="quiz_list_title"><span>7.</span>수입육보다 한돈을 소비해야 하는 이유로 옳지 않은 것은 무엇인가?</strong>';
    var quiz_list_items = '';
    quiz_list_items += '<ul class="quiz_list">';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(1);">';
    quiz_list_items += '            <span class="qlb_num">1.</span>';
    quiz_list_items += '            한돈은 HACCP 인증을 받아 위생안전을 걱정할 우려가 없다.';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(2);">';
    quiz_list_items += '            <span class="qlb_num">2.</span>';
    quiz_list_items += '            한돈은 우리나라 사람의 입맛에 맞춰 사육되어야 한다.';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(3);">';
    quiz_list_items += '            <span class="qlb_num">3.</span>';
    quiz_list_items += '            한돈은 국내 유통이므로 도축 후 1주 이내에 소비되므로<br/>신선하다.';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(4);">';
    quiz_list_items += '            <span class="qlb_num">4.</span>';
    quiz_list_items += '            수입육과 달리 돼지 이력제를 통해 사육 과정 및 유통 과정을 관리하므로 안전하다.';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '</ul>';

    $('#quiz-number').text(7);
    $('#quiz-questions').append(quiz_list_title);
    $('#quiz-questions').append(quiz_list_items);

    viewQuizTitleClass2();
}

function getQuizView_b_7() {
    var quiz_list_title = '<strong class="quiz_list_title"><span>8.</span>다음 중 삼겹살에 대한 설명으로 옳은 것을 고르시오.</strong>';
    var quiz_list_items = '';
    quiz_list_items += '<ul class="quiz_list">';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(1);">';
    quiz_list_items += '            <span class="qlb_num">1.</span>';
    quiz_list_items += '            삼겹살은 돼지고기 부위 중 지방이 많은 부위로<br/> 약 30%정도 지방이 있다.';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(2);">';
    quiz_list_items += '            <span class="qlb_num">2.</span>';
    quiz_list_items += '            삼겹살의 지방 구성은 불포화지방이 40%로 <br/>포화지방이 더 많다.';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(3);">';
    quiz_list_items += '            <span class="qlb_num">3.</span>';
    quiz_list_items += '            삼겹살은 돼지고기 한 마리당 약 20kg 정도로 많이<br/> 나오는 편이다.';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(4);">';
    quiz_list_items += '            <span class="qlb_num">4.</span>';
    quiz_list_items += '            삼겹살은 돼지의 뒷다리쪽에 치우쳐져 있는 부위이다.';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '</ul>';

    $('#quiz-number').text(8);
    $('#quiz-questions').append(quiz_list_title);
    $('#quiz-questions').append(quiz_list_items);

    viewQuizTitleClass2();
}

function getQuizView_b_8() {
    var quiz_list_title = '<strong class="quiz_list_title"><span>9.</span>다음 중 옳지 않은 설명을 고르시오. </strong>';
    var quiz_list_items = '';
    quiz_list_items += '<ul class="quiz_list">';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(1);">';
    quiz_list_items += '            <span class="qlb_num">1.</span>';
    quiz_list_items += '            갈매기살은 돼지고기 한 마리당 약 300~400g정도만 <br/>얻을 수 있다.';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(2);">';
    quiz_list_items += '            <span class="qlb_num">2.</span>';
    quiz_list_items += '            안심은 고단백 저지방 부위이다.';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(3);">';
    quiz_list_items += '            <span class="qlb_num">3.</span>';
    quiz_list_items += '            앞다리살에 있는 대표적 특수부위는 항정살이다.';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(4);">';
    quiz_list_items += '            <span class="qlb_num">4.</span>';
    quiz_list_items += '            등심은 적색근섬유가 많아서 피로회복에 도움을 준다.';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '</ul>';

    $('#quiz-number').text(9);
    $('#quiz-questions').append(quiz_list_title);
    $('#quiz-questions').append(quiz_list_items);

    viewQuizTitleClass3();
}

function getQuizView_b_9() {
    var quiz_list_title = '<strong class="quiz_list_title"><span>10.</span>뒷다리살의 특징으로 옳지 않은 것을 고르시오. </strong>';
    var quiz_list_items = '';
    quiz_list_items += '<ul class="quiz_list">';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(1);">';
    quiz_list_items += '            <span class="qlb_num">1.</span>주로 불고기나 수육으로 이용된다.';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(2);">';
    quiz_list_items += '            <span class="qlb_num">2.</span>대표적인 고단백 저지방 부위이다.';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(3);">';
    quiz_list_items += '            <span class="qlb_num">3.</span>근육과 근육 사이 근간지방 비율이 높다.';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(4);">';
    quiz_list_items += '            <span class="qlb_num">4.</span>돼지고기 부위 중 양이 많지 않은 부위이다.';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '</ul>';

    $('#quiz-number').text(10);
    $('#quiz-questions').append(quiz_list_title);
    $('#quiz-questions').append(quiz_list_items);

    viewQuizTitleClass3();
}

function getQuizView_b_10() {
    var quiz_list_title = '<strong class="quiz_list_title"><span>11.</span>돼지와 돼지고기의 거래 단계별 정보를 기록하고 관리하여 위생, 안전에 문제가 발생한 경우 신속하게 대처하기 위한 제도는 무엇인가? </strong>';
    var quiz_list_items = '';
    quiz_list_items += '<ul class="quiz_list">';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(1);">';
    quiz_list_items += '            <span class="qlb_num">1.</span>돼지고기 관리제도';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(2);">';
    quiz_list_items += '            <span class="qlb_num">2.</span>한돈 추적제도';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(3);">';
    quiz_list_items += '            <span class="qlb_num">3.</span>돼지고기 이력제도';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(4);">';
    quiz_list_items += '            <span class="qlb_num">4.</span>돼지고기 안전인증 제도';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '</ul>';

    $('#quiz-number').text(11);
    $('#quiz-questions').append(quiz_list_title);
    $('#quiz-questions').append(quiz_list_items);

    viewQuizTitleClass3();
}

function getQuizView_b_11() {
    var quiz_list_title = '<strong class="quiz_list_title"><span>12.</span>앞다리살을 맛있게 굽는 방법으로 옳지 않은것을 고르시오. </strong>';
    var quiz_list_items = '';
    quiz_list_items += '<ul class="quiz_list">';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(1);">';
    quiz_list_items += '            <span class="qlb_num">1.</span>';
    quiz_list_items += '            살코기가 많은 부위쪽 보다는 지방이 많은 쪽 고기를 고른다.';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(2);">';
    quiz_list_items += '            <span class="qlb_num">2.</span>';
    quiz_list_items += '            고기의 두깨는 약2cm로 성인 손가락 한마디 정도로<br/> 두깨감 있게 자른다.';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(3);">';
    quiz_list_items += '            <span class="qlb_num">3.</span>';
    quiz_list_items += '            구우면서 고기를 자를 때 깍두기 모양으로 자른다.';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(4);">';
    quiz_list_items += '            <span class="qlb_num">4.</span>';
    quiz_list_items += '            살고기가 많은 부위이기 때문에 구우면서 3번 정도만<br/> 뒤집는것이 적당하다.';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '</ul>';

    $('#quiz-number').text(12);
    $('#quiz-questions').append(quiz_list_title);
    $('#quiz-questions').append(quiz_list_items);

    viewQuizTitleClass3();
}

function getQuizView_b_12() {
    var quiz_list_title = '<strong class="quiz_list_title"><span>13.</span>다음 중 육즙을 가두어 굽고 있는 사람은 누구인가? </strong>';
    var quiz_list_items = '';
    quiz_list_items += '<ul class="quiz_list">';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(1);">';
    quiz_list_items += '            <span class="qlb_num">1.</span>';
    quiz_list_items += '            김한돈 : 고기는 많이 뒤집어야 육즙이 팡 터지는 고기가 <br/>되는거야!';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(2);">';
    quiz_list_items += '            <span class="qlb_num">2.</span>';
    quiz_list_items += '            장산적 : 무슨소리야 큐브 모양으로 자른 고기를 굴리듯이<br/> 사면을 구워서 육즙을 가둬야 한다고!';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(3);">';
    quiz_list_items += '            <span class="qlb_num">3.</span>';
    quiz_list_items += '            한알바 : 고기는 저온에서부터 서서히 구워야 육즙을 가둘<br/> 수 있어!';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(4);">';
    quiz_list_items += '            <span class="qlb_num">4.</span>';
    quiz_list_items += '            김하은 : 고기는 무조건 빠짝 익혀야 육즙이 가둬지는겁니다!';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '</ul>';

    $('#quiz-number').text(13);
    $('#quiz-questions').append(quiz_list_title);
    $('#quiz-questions').append(quiz_list_items);

    viewQuizTitleClass3();
}

function getQuizView_b_13() {
    var quiz_list_title = '<strong class="quiz_list_title"><span>14.</span>뼈등심(돈마호크)에 포함되지 않은 부위는?</strong>';
    var quiz_list_items = '';
    quiz_list_items += '<ul class="quiz_list">';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(1);">';
    quiz_list_items += '            <span class="qlb_num">1.</span>항정살';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(2);">';
    quiz_list_items += '            <span class="qlb_num">2.</span>삼겹살';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(3);">';
    quiz_list_items += '            <span class="qlb_num">3.</span>등갈비';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(4);">';
    quiz_list_items += '            <span class="qlb_num">4.</span>가브리살';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '</ul>';

    $('#quiz-number').text(14);
    $('#quiz-questions').append(quiz_list_title);
    $('#quiz-questions').append(quiz_list_items);

    viewQuizTitleClass3();
}

function getQuizView_b_14() {
    var quiz_list_title = '<strong class="quiz_list_title"><span>15.</span>다음 중 가정에서 식당처럼 먹을 수 있는 삼겹살의 두께는?</strong>';
    var quiz_list_items = '';
    quiz_list_items += '<ul class="quiz_list">';;
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(1);">';
    quiz_list_items += '            <span class="qlb_num">1.</span>약 1cm - 2cm';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(2);">';
    quiz_list_items += '            <span class="qlb_num">2.</span>약 2cm- 3cm';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(3);">';
    quiz_list_items += '            <span class="qlb_num">3.</span>약 3cm - 4cm';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '    <li class="quiz-list-item">';
    quiz_list_items += '        <button type="button" class="quiz_list_btn" onclick="selectQuizList(4);">';
    quiz_list_items += '            <span class="qlb_num">4.</span>약 4cm 이상';
    quiz_list_items += '        </button>';
    quiz_list_items += '    </li>';
    quiz_list_items += '</ul>';

    $('#quiz-number').text(15);
    $('#quiz-questions').append(quiz_list_title);
    $('#quiz-questions').append(quiz_list_items);

    viewQuizTitleClass3();
}

function getQuizView_b_15() {
    var quiz_list_title = '<strong class="quiz_list_title"><span>16.</span>현재 우리가 먹는 돼지고기는<br/>우리나라 전통 돼지를 사육한 돼지고기이다</strong>';
    var quiz_list_items = '';
    quiz_list_items += '<ul class="quiz_list quiz_type3">';
    quiz_list_items += '    <li class="quiz-list-item"><button type="button" class="quiz_list_btn" onclick="selectQuizList(1);">O</button></li>';
    quiz_list_items += '    <li class="quiz-list-item"><button type="button" class="quiz_list_btn" onclick="selectQuizList(2);">X</button></li>';
    quiz_list_items += '</ul>';

    $('#quiz-number').text(16);
    $('#quiz-questions').append(quiz_list_title);
    $('#quiz-questions').append(quiz_list_items);

    viewQuizTitleClass3();
}

function getQuizView_b_16() {
    var quiz_list_title = '<strong class="quiz_list_title"><span>17.</span>한돈은 우리나라 사람들의 입맛에 맞게 개량되어왔다</strong>';
    var quiz_list_items = '';
    quiz_list_items += '<ul class="quiz_list quiz_type3">';
    quiz_list_items += '    <li class="quiz-list-item"><button type="button" class="quiz_list_btn" onclick="selectQuizList(1);">O</button></li>';
    quiz_list_items += '    <li class="quiz-list-item"><button type="button" class="quiz_list_btn" onclick="selectQuizList(2);">X</button></li>';
    quiz_list_items += '</ul>';

    $('#quiz-number').text(17);
    $('#quiz-questions').append(quiz_list_title);
    $('#quiz-questions').append(quiz_list_items);

    viewQuizTitleClass3();
}

function getQuizView_b_17() {
    var quiz_list_title = '<strong class="quiz_list_title"><span>18.</span>삼겹살은 통칭 갈비로 불리었다 </strong>';
    var quiz_list_items = '';
    quiz_list_items += '<ul class="quiz_list quiz_type3">';
    quiz_list_items += '    <li class="quiz-list-item"><button type="button" class="quiz_list_btn" onclick="selectQuizList(1);">O</button></li>';
    quiz_list_items += '    <li class="quiz-list-item"><button type="button" class="quiz_list_btn" onclick="selectQuizList(2);">X</button></li>';
    quiz_list_items += '</ul>';

    $('#quiz-number').text(18);
    $('#quiz-questions').append(quiz_list_title);
    $('#quiz-questions').append(quiz_list_items);

    viewQuizTitleClass3();
}

function getQuizView_b_18() {
    var quiz_list_title = '<strong class="quiz_list_title"><span>19.</span>오래전부터 돼지고기는 부위별로 판매되었다</strong>';
    var quiz_list_items = '';
    quiz_list_items += '<ul class="quiz_list quiz_type3">';
    quiz_list_items += '    <li class="quiz-list-item"><button type="button" class="quiz_list_btn" onclick="selectQuizList(1);">O</button></li>';
    quiz_list_items += '    <li class="quiz-list-item"><button type="button" class="quiz_list_btn" onclick="selectQuizList(2);">X</button></li>';
    quiz_list_items += '</ul>';

    $('#quiz-number').text(19);
    $('#quiz-questions').append(quiz_list_title);
    $('#quiz-questions').append(quiz_list_items);

    viewQuizTitleClass3();
}

function getQuizView_b_19() {
    $('#quiz-next-btn').hide();
    $('#quiz-submit-btn').show();

    var quiz_list_title = '<strong class="quiz_list_title"><span>20.</span>모든 고기는 딱 2번만 뒤집는거다</strong>';
    var quiz_list_items = '';
    quiz_list_items += '<ul class="quiz_list quiz_type3">';
    quiz_list_items += '    <li class="quiz-list-item"><button type="button" class="quiz_list_btn" onclick="selectQuizList(1);">O</button></li>';
    quiz_list_items += '    <li class="quiz-list-item"><button type="button" class="quiz_list_btn" onclick="selectQuizList(2);">X</button></li>';
    quiz_list_items += '</ul>';

    $('#quiz-number').text(20);
    $('#quiz-questions').append(quiz_list_title);
    $('#quiz-questions').append(quiz_list_items);

    viewQuizTitleClass3();
}