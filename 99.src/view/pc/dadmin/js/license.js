$(document).ready(function() {
    init();
});

function init() {
    init_searchParam();
    init_pagination();
}

function init_searchParam() {
    // var paramSearchType = getParameter('searchType');
    // var paramSearchStr = getParameter(decodeURIComponent('searchStr', 'UTF-8'));
    var paramSearchType = $('#hiddenParamSearchType').val();
    var paramSearchStr = $('#hiddenParamSearchStr').val();

    if (paramSearchType != '') {
        $('#search-type').val(paramSearchType);
    }

    if (paramSearchStr != '') {
        $('#search-str').val(paramSearchStr);
    }
}

function init_pagination() {
    var page_cur = parseInt($('#page_cur').val(), 10);
    var page_start = parseInt($('#page_start').val(), 10);
    var page_end = parseInt($('#page_end').val(), 10);
    var page_prev = parseInt($('#page_prev').val(), 10);
    var page_next = parseInt($('#page_next').val(), 10);
    var page_total = parseInt($('#page_total').val(), 10);

    $('#paging-list').empty();

    for (let i = page_start; i <= page_end; i++) {
        var item = '';
        if (i == page_cur) {
            item = '<li class="current"><a href="javascript: void(0);" class="pg_link">' + i + '</a></li>';
        } else {
            item = '<li><a href="./license.php?page=' + i + '" class="pg_link">' + i + '</a></li>';
        }

        $('#paging-list').append(item);
    }

    if (page_prev > 0) {
        $('#paging-prev').attr('onclick', 'movePage(' + page_prev + ')');
    }

    if (page_next < page_total) {
        $('#paging-next').attr('onclick', 'movePage(' + page_next + ')');
    }

}

function movePage(page) {
    if (page > 0) {
        location.href = './license.php?page=' + page;
    }
}

function replaceAll(str, searchStr, replaceStr) {
    return str.split(searchStr).join(replaceStr);
}

function printExcel() {
    $.ajax({
        type: 'get',
        url: './api_license_total_data.php',
        success: function(result) {
            // console.log('[printExcel] result:: ', result);
            outputExcel(result.data);
        },
        error: function(xhr, status, error) {
            console.error('[printExcel] ajax error:: ', error);
        },
    });
}

function outputExcel(data) {
    if (data.length > 0) {
        JwExcel.exportExcel(data, '한돈 소믈리에 라이센스 신청 정보');
    } else {
        alert('엑셀로 출력할 데이터가 없습니다.');
    }
}

function doSearch() {
    var paramObj = {
        page: 1,
        searchType: $('#search-type').val(),
        searchStr: encodeURIComponent($('#search-str').val(), 'UTF-8')
    };

    location.href = './license.php?' + getObjQueryString(paramObj)
}