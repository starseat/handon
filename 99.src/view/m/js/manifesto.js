$(document).ready(function() {
    popupOpen_noti();
});

$(window).resize(function() {});

function shareManifesto() {
    copyToClipboard_publicManifesto();
}

function copyToClipboard_publicManifesto(e) {
    var tempItem = document.createElement('input');

    tempItem.setAttribute('type', 'text');
    tempItem.setAttribute('display', 'none');

    // let content = e;    
    // if (e instanceof HTMLElement) {
    //     content = e.innerHTML;
    // }

    let content = 'https://m.mall.han-don.com/donmmelier/manifesto_public.php';

    tempItem.setAttribute('value', content);
    document.body.appendChild(tempItem);

    tempItem.select();
    document.execCommand('Copy');

    tempItem.parentElement.removeChild(tempItem);

    alert('한돈소믈리에 선언문 링크가 복사되었습니다.');
}

function popupOpen_noti() {

    var isRegi = $('#hiddenIsRegi').val();
    var isAllViewLecture = $('#hiddenIsAllViewLecture').val();
    var isPass = $('#hiddenIsPass').val();

    if (isRegi == '1') {
        $('#noti-popup').show();
        $('#noti-popup-msg-1').show();
        $('.wrap').addClass('popup_open');
        return;
    }

    if (isAllViewLecture == '1') {
        $('#noti-popup').show();
        $('#noti-popup-msg-2').show();
        $('.wrap').addClass('popup_open');
    }

    if (isPass == '1') {
        $('#noti-popup').show();
        $('#noti-popup-msg-3').show();
        $('.wrap').addClass('popup_open');
    }

}