$(document).ready(function() {
    AOS.init();

    $('#snsShareBtn').on('click', function() {
        if (confirm('다른사람에게 이 글을 추천하고 싶나요?')) {
            copyToClipboard();
        }
    });

    var mql = window.matchMedia("screen and (max-width: 720px)");
    if (mql.matches) {
        console.log("화면의 너비가 720px 보다 작습니다.");
    } else {
        console.log("화면의 너비가 720px 보다 큽니다.");
    }
});

$(window).resize(function() {});

function init() {
    initEvent();
}

function initEvent() {}

// 준비중 팝업
// 나중에 삭제 필요
function popupOpen_preparing(event) {
    event.preventDefault();
    event.stopPropagation();

    $('.layer_popup_box').hide();
    $('#preparing-popup').show();
    $('.wrap').addClass('popup_open');
}

function popupClose() {
    $('.wrap').removeClass('popup_open');
}

// function copyToClipboard() {
//     var copyUrl = 'http://donmmelier.com/';

//     var agent = navigator.userAgent.toLowerCase();
//     if ((navigator.appName == 'Netscape' && agent.indexOf('trident') != -1) || (agent.indexOf("msie") != -1)) {
//         // IE 용
//         window.clipboardData.setData("Text", copyUrl);
//     } else {
//         navigator.clipboard.writeText(copyUrl)
//             //     .then(() => {
//             //     console.log("Text copied to clipboard...")
//             // })
//             //     .catch(err => {
//             //     console.log('Something went wrong', err);
//             // })
//         ;
//     }

//     alert('링크가 복사되었습니다.');
// }

function copyToClipboard(e) {
    var tempItem = document.createElement('input');

    tempItem.setAttribute('type', 'text');
    tempItem.setAttribute('display', 'none');

    // let content = e;    
    // if (e instanceof HTMLElement) {
    //     content = e.innerHTML;
    // }

    let content = 'https://mall.han-don.com/donmmelier/index.php';

    tempItem.setAttribute('value', content);
    document.body.appendChild(tempItem);

    tempItem.select();
    document.execCommand('Copy');

    tempItem.parentElement.removeChild(tempItem);

    alert('링크가 복사되었습니다.');
}

function logout() {
    location.href = '/process.php?mode=logout&tabst=handon';
}