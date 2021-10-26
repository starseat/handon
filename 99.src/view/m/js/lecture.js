function popupOpen_lecture(event, index, isOpened) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    var lastLectureNum = parseInt($('#last_lecture_num').val(), 10);
    if (!((lastLectureNum + 1) >= index)) {
        alert('이전 강의를 완료해주세요.');
        return false;
    }

    $('.layer_popup_box').hide();
    $('#lecture-popup').show();

    $('#lecture-popup .btn_arrow_l').hide();
    $('#lecture-popup .btn_arrow_r').hide();
    $('#lecture-popup-btn-index-prev').val(0);
    $('#lecture-popup-btn-index-next').val(0);

    clearLecture();

    if (index == 1) {
        initLecture1();
    } else if (index == 2) {
        initLecture2();
    } else {
        initLecture3();
    }

    if (!isOpened) {
        $('.wrap').addClass('popup_open');
    }
}

function popupClose_lecture() {
    clearLecture();
    popupClose();
}

function clearLecture() {
    if (LECTURE_PLAYER != null) {
        LECTURE_PLAYER.dispose();
        LECTURE_PLAYER = null;
        $('#lecture-player-box').append('<video id="lecture-player" class="video-js vjs-big-play-centerd vjs-fluid vjs-default-skin" webkit-playsinline></video>');
    }
}

let LECTURE_PLAYER = null;
const VIDEO_OPTIONS = {
    poster: "image", // 썸네일 이미지
    controls: true, // 컨트롤바 제공 여부
    preload: "auto",
    playsinline: true, // 모바일 브라우저 환경의 경우 동영상 재생 시 모바일 내장 플레이어로 실행이 되기 때문에 웹페이지에서 인라인형태로 제공하고 싶은 경우 true로 설정
    width: 540,
    height: 320,
    controlBar: {
        playToggle: true, // 재생/일시정지
        pictureInPictureToggle: false, // pip 모드
        remainingTimeDisplay: true, // 남은시간
        progressControl: false, // 영상 시간 조정 
        qualitySelector: true,
        timeControl: true,
    }
};

function initLecture1() {
    $('#lecture-popup .btn_arrow_r').show();
    $('#lecture-popup .txt_red').text('1회차 교육');
    $('#lecture-popup-btn-index-next').val(2);


    VIDEO_OPTIONS.sources = [{
        // src: "./video/test.mp4",
        src: 'https://file.han-don.com/donmmelier/lecture1.mp4',
        type: "video/mp4"
    }];
    VIDEO_OPTIONS.poster = './imgs/m/lesson_thumb957X416.png'


    LECTURE_PLAYER = videojs('lecture-player', VIDEO_OPTIONS);
    LECTURE_PLAYER.ready(function() {
        // var duration_time = Math.floor(this.duration());
        // this.on('timeupdate', function () {
        //     var current_time = Math.floor(this.currentTime());
        //     if (current_time > 0 && (current_time == duration_time)) {
        //         alert('다봤당 - timeupdate');
        //     }
        // });

        this.on('ended', function() {
            sendViewComplated(1);
        });
    });
}

function initLecture2() {
    $('#lecture-popup .btn_arrow_l').show();
    $('#lecture-popup .btn_arrow_r').show();
    $('#lecture-popup .txt_red').text('2회차 교육');
    $('#lecture-popup-btn-index-prev').val(1);
    $('#lecture-popup-btn-index-next').val(3);


    VIDEO_OPTIONS.sources = [{
        src: 'https://file.han-don.com/donmmelier/lecture2.mp4',
        type: "video/mp4"
    }];

    LECTURE_PLAYER = videojs('lecture-player', VIDEO_OPTIONS);
    LECTURE_PLAYER.ready(function() {
        this.on('ended', function() {
            alert('2번 다봤당 - ended');
        });
    });
}

function initLecture3() {
    $('#lecture-popup .btn_arrow_l').show();
    $('#lecture-popup .txt_red').text('3회차 교육');
    $('#lecture-popup-btn-index-prev').val(2);
}

function prevLecturePopup() {
    var prevIndex = parseInt($('#lecture-popup-btn-index-prev').val(), 10);
    popupOpen_lecture(null, prevIndex, true);
}

function nextLecturePopup() {
    var nextIndex = parseInt($('#lecture-popup-btn-index-next').val(), 10);
    if (nextIndex == 2) {
        alert('2회차 교육은 준비중 입니다.');
        return false;
    }
    if (nextIndex == 3) {
        alert('3회차 교육은 준비중 입니다.');
        return false;
    }
    popupOpen_lecture(null, nextIndex, true);
}

function sendViewComplated(index) {
    $.ajax({
        type: 'post',
        url: './api_lecture_view_complated.php',
        data: { lecture_index: index },
        dataType: 'json',
        success: function(resultData) {
            console.log('[sendViewComplated] ajax success. result data: ', resultData);
            if (resultData.result && resultData.code == 0) {
                alert(resultData.message);
            }
        },
        error: function(xhr, status, error) {
            console.error('[sendViewComplated] ajax error:: ', error);
        },
    });
}