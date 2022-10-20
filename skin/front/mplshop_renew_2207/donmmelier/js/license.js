$(document).ready(function() {});

function getAddressInfo() {
    new daum.Postcode({
        oncomplete: function(data) {
            // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

            // 각 주소의 노출 규칙에 따라 주소를 조합한다.
            // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
            var addr = ''; // 주소 변수
            var extraAddr = ''; // 참고항목 변수

            //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
            if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
                addr = data.roadAddress;
            } else { // 사용자가 지번 주소를 선택했을 경우(J)
                addr = data.jibunAddress;
            }

            // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
            if (data.userSelectedType === 'R') {
                // 법정동명이 있을 경우 추가한다. (법정리는 제외)
                // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
                if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
                    extraAddr += data.bname;
                }
                // 건물명이 있고, 공동주택일 경우 추가한다.
                if (data.buildingName !== '' && data.apartment === 'Y') {
                    extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                }
                // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
                if (extraAddr !== '') {
                    extraAddr = ' (' + extraAddr + ')';
                }
                // 조합된 참고항목을 해당 필드에 넣는다.
                $('#licenseAddressExtra').val(extraAddr);
            } else {
                $('#licenseAddressExtra').val('');
            }

            // 우편번호와 주소 정보를 해당 필드에 넣는다.
            $('#licensePostCode').val(data.zonecode);
            $('#licenseAddress').val(addr);

            // 커서를 상세주소 필드로 이동한다.
            $('#license-address-detail').focus();
        }
    }).open();
}

function changeLicenseImage(target) {
    if (target.files && target.files[0].size > (10 * 1024 * 1024)) {
        alert('첨부 가능한 파일 사이즈는 최대 10mb 입니다.');
        target.value = null;
        $('#licenseFileName').text('');
    }

    $('#licenseFileName').text(target.files[0].name);
}

function submitLicenseSend(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    if (!$('#formAgree').is(":checked")) {
        alert('개인정보 수집, 이용 및 SMS 수신에 동의합셔야 합니다.');
        return false;
    }

    if ($('#licenseName').val() == '') {
        alert('이름은 필수로 입력되어야 합니다.');
        $('#licenseName').focus();
        return false;
    }

    if ($('#licensePhone').val() == '') {
        alert('연락처는 필수로 입력되어야 합니다.');
        $('#licensePhone').focus();
        return false;
    }

    if ($('#licensePostCode').val() == '' || $('#licenseAddress').val() == '') {
        alert('주소는 필수로 입력되어야 합니다.');
        return false;
    }

    if ($('#licenseAddressDetail').val() == '') {
        alert('상세 주소는 필수로 입력되어야 합니다. \n상세주소가 없을경우 - 를 입력해 주세요.');
        $('#licenseAddressDetail').focus();
        return false;
    }

    if (!$('#licenseFile').val()) {
        alert('사진은 필수로 첨부되어야 합니다.');
        return false;
    }

    var sendMessage = $('#licenseSendMessage').val();
    if (sendMessage != '' && sendMessage.length > 50) {
        alert('배송메시지는 최대 50자까지 가능합니다.');
        $('#licenseSendMessage').focus();
        return false;
    }

    $('#licenseSendForm').submit();
}