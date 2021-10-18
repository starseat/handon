function popupOpen_lecture(event, index) {
    event.preventDefault();
    event.stopPropagation();

    // $('#lecture-popup .btn_arrow').hide();

    if (index == 1) {
        initLecture1();
    } else if (index == 2) {
        initLecture2();
    } else {
        initLecture3();
    }

    $('.wrap').addClass('popup_open');
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
        progressControl: true, // 영상 시간 조정 
        qualitySelector: true,
        timeControl: true,
    }
};

function initLecture1() {
    $('#lecture-popup .btn_arrow_r').show();
    $('#lecture-popup .txt_red').text('1회차 교육');

    VIDEO_OPTIONS.sources = [{
        src: "./video/test.mp4",
        type: "video/mp4"
    }];

    LECTURE_PLAYER = null;
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
            alert('1번 다봤당 - ended');
        });
    });
}

function initLecture2() {
    $('#lecture-popup .btn_arrow_l').show();
    $('#lecture-popup .btn_arrow_r').show();
    $('#lecture-popup .txt_red').text('2회차 교육');

    VIDEO_OPTIONS.sources = [{
        src: "./video/test.mp4",
        type: "video/mp4"
    }];

    LECTURE_PLAYER = null;
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
}