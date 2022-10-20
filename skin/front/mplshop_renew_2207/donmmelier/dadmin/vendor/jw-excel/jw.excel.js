/**
 * sheet.js 를 이용한 excel common library
 *
 * @file         : jw.excel.js
 * @author       : jw.lee
 * @description  : JW - Excel/CSV Export
 *               (xlsx.full.min.js, FileSaver.min.js 필요)
 * @ref          : sheetjs(xlsx) github - https://github.com/SheetJS/sheetjs
 *               : FileSaver     github - https://github.com/eligrey/FileSaver.js/
 * @create_date  : 2019.11.04
 * 
 */


var JwExcel = {

	/**
	 * excel export
	 * 
	 * @name   exportExcel
	 * @param  {[Object Array]} objDatas  [엑셀에 출력할 데이터]
	 * @param  {[String]}       stat_name [통게장표명]
	 */
	exportExcel: function(objDatas, stat_name) {
		stat_name += ''; // string 형으로 변환

		// 컬럼명 추출(object 의 key)
		var keyList = this.getKeysFromObejct(objDatas[0]);
		// object 별로 값이 다를 수 있으므로 순서 정렬 및 data 추출 
		var valuesList = this.getValuesFromObjectArray(keyList, objDatas);

		// 엑셀파일 상단에 통계명 작성을 위한 작업
		var desc_width = keyList.length-1;
		var doc_title_obj = [ (stat_name) ];
		var merge_doc_title = { s: {r:0, c:0}, e: {r:0, c:desc_width} };

		// 엑셀 파일명
		var file_name = stat_name + '_' + this.getCurrentDate() + '.xlsx';
		// 엑셀 시트명
		var ws_name = stat_name;
		// 엑셀 데이터 추가를 위한 변수
		var ws_array_data = [];

		// 엑셀문서의 타이틀 추가
		ws_array_data.push(doc_title_obj);
		// 엑셀에 컬럼 추가
		ws_array_data.push(keyList);

		// 엑셀에 데이터 추가
		for(var i=0; i<valuesList.length; i++) {
			ws_array_data.push(valuesList[i]);
		}

		// 엑셀 workbook 생성
		var wb = XLSX.utils.book_new();

		// 엑셀 파일정보 설정
		wb.Props = {
	            Title: stat_name,
	            // Subject: stat_name,
	            Author: 'samil',
	            // Manager: 'samil',
	            Company: 'samil',
	            Category: 'samil',
	            // Keywords: stat_name,
	            Comments: 'samil excel export file. (' + stat_name + ')',
	            CreatedDate: new Date()
	    };

	    // 엑셀 시트 생성
	    var newWorksheet = XLSX.utils.aoa_to_sheet(ws_array_data, {header: 2, row: true} );

	    // 엑셀 타이틀 cell 병합
	    if(!newWorksheet['!merges']) {
	    	newWorksheet['!merges'] = [];
	    }
	    newWorksheet['!merges'].push(merge_doc_title);

	    // 엑셀 workbook에 새로만든 worksheet에 이름 부여 및 sheet 정보 추가
	    XLSX.utils.book_append_sheet(wb, newWorksheet, ws_name);

	    // 엑셀 파일 만들기
	    var wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary', cellStyles: true });

	    // 엑셀 파일 export 
	    saveAs(new Blob([this.s2ab(wbout)], {type:"application/octet-stream"}), file_name);
	}, 

	/**
	 * csv export
	 * 
	 * @name   exportCSV
	 * @param  {[Object Array]} objDatas  [엑셀에 출력할 데이터]
	 * @param  {[String]}       stat_name [통게장표명]
	 */
	exportCSV: function(objDatas, stat_name) {
		stat_name += ''; // string 형으로 변환

		// 컬럼명 추출(object 의 key)
		var keyList = this.getKeysFromObejct(objDatas[0]);
		// object 별로 값이 다를 수 있으므로 순서 정렬 및 data 추출 
		var valuesList = this.getValuesFromObjectArray(keyList, objDatas);

		// 엑셀 파일명
		var file_name = stat_name + '_' + this.getCurrentDate() + '.xlsx';
		// 엑셀 시트명
		var ws_name = stat_name;
		// 엑셀 데이터 추가를 위한 변수
		var ws_array_data = [];

		// 데이터를 json 형식으로 추출
		var ws_json_data = JSON.parse(JSON.stringify(gridDatas));

		// 엑셀 workbook 생성
		var wb = XLSX.utils.book_new();

		// 엑셀 시트 생성 (json 형식)
		var newWorksheet = XLSX.utils.json_to_sheet(ws_json_data);

		var bExportExcelType = true;
		// 엑셀 형식으로 만든 후에 export
		if(bExportExcelType) {
			XLSX.utils.book_append_sheet(wb, newWorksheet, ws_name);
			var wbout = XLSX.write(wb, {bookType:'csv',  type: 'binary' });
			saveAs(new Blob([this.s2ab(wbout)], {type:"application/octet-stream"}), file_name);
		}
		// 그냥 export
		else {
			var newCSVSheet = XLSX.utils.sheet_to_csv(newWorksheet);
        	saveAs(new Blob([this.s2ab(newCSVSheet)], {type: "application/octet-stream"}), file_name);
		}
	}, 
	
	/**
	 * Object 의 key 추출
	 *
	 * @name   getKeysFromObejct
	 * @param  {[Object]}        obj           [key 추출할 object]
	 * @return {[String Array]}  (key list)    [object 의 key list]
	 */
	getKeysFromObejct: function(obj) {
		return Object.keys(obj);
	}, 

	/**
	 * Object 의 value 만 추출
	 *
	 * @name   getValuesFromObjectArray
	 * @param  {[String Array]}     keys     [Object 의 Key list]
	 * @param  {[Object Array]}     objArray [Value 를 추출할 Object]
	 * @return {[String Array]}              [Value List]
	 */
	getValuesFromObjectArray: function(keys, objArray) {
		var retList = [];
		
		for(var i=0; i<objArray.length; i++) {
			var tempObj = objArray[i];
			var pushArray = [];
			for(var j=0; j<keys.length; j++) {
				pushArray.push(tempObj[keys[j]]);
			}
			
			retList.push(pushArray);
		}
		
		return retList;
	}, 

	/**
	 * s2ab (sheet_to_blob)
	 *  - sheetjs 를 사용하여 파일 export 시 사용
	 * 
	 */
	s2ab: function(s) { 
	    var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
	    var view = new Uint8Array(buf);  //create uint8array as viewer
	    for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
	    return buf;    
	}, 

	/**
	 * 현재날짜 시분초 추출 
	 *
	 * @name   getCurrentDate
	 * @return {[String]} [현재날짜 시분초 - ex: 20191104132108]
	 */
	getCurrentDate: function() {
		var retDate = '';
	
		var today = new Date();
		
		var yy = today.getFullYear();
		var mm = today.getMonth()+1; 
		var dd = today.getDate();
		
		if(mm < 10) { mm +='0'; } 
		if(dd < 10) { dd +='0'; } 
		
		yy += '';
		mm += '';
		dd += '';
		
		var hh = today.getHours();
		var mi = today.getMinutes();
		var ss = today.getSeconds();
		
		if(hh < 10) { hh +='0'; } 
		if(mi < 10) { mi +='0'; } 
		if(ss < 10) { ss +='0'; } 
		
		hh += '';
		mi += '';
		ss += '';	
		
		retDate = yy + mm + dd;
		retDate += hh + mi + ss;
		
		return retDate;
	},

	/**
	 * JSON Data 의 Key 추출
	 *
	 * @name   jsonData
	 * @return {[String Array]} [JSON 의 Key List]
	 */
	getKeyListFromJson: function(jsonData) {
		var keyList = [];
		for(var key in jsonData) {
			keyList.push(key);
		}
		
		return keyList;
	}, 
};


