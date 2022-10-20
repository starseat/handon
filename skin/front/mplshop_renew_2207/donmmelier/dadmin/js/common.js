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

function getObjQueryString(obj) {
    return Object.keys(obj).map(function(key) {
        return key + '=' + obj[key];
    }).join('&');
}

function getParameter(name) {
    var rtnval = '';
    var nowAddress = unescape(location.href);
    var parameters = (nowAddress.slice(nowAddress.indexOf('?') + 1, nowAddress.length)).split('&');

    for (var i = 0; i < parameters.length; i++) {
        var varName = parameters[i].split('=')[0];
        if (varName.toUpperCase() == name.toUpperCase()) {
            rtnval = parameters[i].split('=')[1];
            break;
        }
    }

    return rtnval;
}