$(document).ready(function() {
    init();
});

$(window).resize(function() {});

function init() {
    initEvent();
}

function initEvent() {
    $('#snsShareBtn').on('click', function() {
        copyToClipboard();
    });
}


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

function logout() {}