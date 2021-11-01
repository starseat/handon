<?php

namespace Component\Donmmelier;

use App;
use Component\Database\DBTableField;
use Framework\Database\DBTool;
use Framework\Object\SingletonTrait;
use Framework\Utility\DateTimeUtils;
use Framework\Utility\StringUtils;
use Component\Storage\Storage;

class DonSVC
{
    protected $db = null;
    protected $password_options = [
        'salt' => 'donmm_admin',
        'cost' => 12 // the default cost is 10
    ];
    protected $item_row_count = 10;
    protected $page_block_count = 10;

    /**
     * 생성자
     */
    public function __construct(DBTool $db = null, array $config = [])
    {
        if (!is_object($this->db)) {
            $this->db = \App::load('DB');
        }

        $this->storage = Storage::disk(Storage::PATH_CODE_BOARD, 'local');    //파일저장소세팅
    }

    public function getLoginUrl($device = 'pc') {
        // 통합 로그인 전
        $returnUrl = '';

        if($device == 'm') {
            $returnUrl = 'https://www.han-don.com/m/index.php?grp=member&mode=login&tabst=donmmelier';
        }
        else {
            $returnUrl = 'https://www.han-don.com/member/index.php?mode=login&tabst=donmmelier';
        }

        // 통합 로그인 후
        // $donmmelierUrl = 'https://mall.han-don.com/donmmelier/index.php';
        // $returnUrl = 'https://mall.han-don.com/member/hdlogin.php?returnUrl=' . $donmmelierUrl;

        return $returnUrl;
    }

    public function getCountDonmmRegistered($phone) {
        $sql = "SELECT count(*) as cnt FROM `donmm_registration` WHERE `phone` = '{$phone}'";
        $query = $this->db->query($sql);
        $data = $this->db->fetch($query);
        return $data['cnt'];
    }

    public function getCountDonmmRegisteredFromId($memId) {
        $sql = "SELECT count(*) as cnt FROM `donmm_registration` WHERE `memId` = '{$memId}'";
        $query = $this->db->query($sql);
        $data = $this->db->fetch($query);
        return $data['cnt'];
    }

    public function getDonmmRegisteredInfoFromId($memId) {
        $sql = "SELECT seq, phone, name, memNo, memId, created_at FROM `donmm_registration` WHERE `memId` = '{$memId}'";
        $query = $this->db->query($sql);
        $data = $this->db->fetch($query);
        return $data;
    }

    public function insertDonmmRegistered($insert_info) {

        $check_result = $this->checkDonmmInfo($insert_info);
        if($check_result < 0) {
            return $check_result;
        }

        $phone = $insert_info['phone'];
        $name = $insert_info['name'];
        $memNo = $insert_info['memNo'];
        $memId = $insert_info['memId'];

        $sql = "
            INSERT INTO `donmm_registration` (phone, name, memNo, memId)
            VALUES ('{$phone}', '{$name}', '{$memNo}', '{$memId}')
        ";

        $this->db->query($sql);
        return 1;
    }

    public function checkDonmmInfo($insert_info) {
        // $phone_pattern = "/^01([0|1|6|7|8|9]?)-?([0-9]{3,4})-?([0-9]{4})$/";
        $phone_pattern = "/^01([0|1|6|7|8|9]?)?([0-9]{3,4})?([0-9]{4})$/";
        $phone_result = preg_match($phone_pattern, $insert_info['phone']);
        if($phone_result < 1) {
            return -1;
        }

        $name_pattern = "/^[가-힣a-zA-Z]{2,30}$/";
        $name_result = preg_match($name_pattern, $insert_info['name']);
        if($name_result < 1) {
            return -2;
        }

        return 1;
    }

    public function getCountLectureViewComplated($lecture_info) {
        $memNo = $lecture_info['memNo'];
        $memId = $lecture_info['memId'];
        $season = $lecture_info['season'];
        $num = $lecture_info['num'];

        $sql = "SELECT count(*) as cnt FROM `donmm_lecture` WHERE `memId` = '{$memId}' AND `season` = {$season} AND `num` = {$num}";
        $query = $this->db->query($sql);
        $data = $this->db->fetch($query);
        return $data['cnt'];
    }

    public function insertLectureViewComplated($lecture_info) {

        $memNo = $lecture_info['memNo'];
        $memId = $lecture_info['memId'];
        $season = $lecture_info['season'];
        $num = $lecture_info['num'];

        $nRet = 0;
        $count = $this->getCountLectureViewComplated($lecture_info);
        if($count == 0) {
            $sql = "
                INSERT INTO `donmm_lecture` (memNo, memId, season, num)
                VALUES ('{$memNo}', '{$memId}', {$season}, {$num})
            ";

            $this->db->query($sql);
            $nRet = 1;
        }
        
        return $nRet;
    }

    public function isEmpty($value) {
        if (isset($value) && !empty($value) && $value != null && $value != '') {
            return false;
        } else {
            return true;
        }
    }

    public function getPagingInfo($current_page, $total_item_count, $item_row_count, $page_block_count) {
        $page_db = (($current_page - 1) * $item_row_count) - 1;
        if($page_db < 0) {
            $page_db = 0;
        }

        // 전체 block 수
        $page_total = ceil($total_item_count / $page_block_count);
        if ($page_total == 0) {
            $page_total = 1;
        }
        // block 시작
        $page_start = (((ceil($current_page / $page_block_count) - 1) * $page_block_count) + 1);

        // block 끝
        $page_end = $page_start + $page_block_count - 1;
        if ($page_total < $page_end) {
            $page_end = $page_total;
        }

        // 시작 바로 전 페이지
        $page_prev = $page_start - 1;
        // 마지막 다음 페이지
        $page_next = $page_end + 1;

        return array(
            'page_db' => $page_db,  // db 조회시 사용
            'page_start' => $page_start,
            'page_end' => $page_end,
            'page_prev' => $page_prev,
            'page_next' => $page_next,
            'page_total' => $page_total
        );
    }

    public function getLastLectureNumber($login_id) {
        $lastNum = 0;

        $sql = "SELECT count(*) as cnt FROM `donmm_lecture` where memId = '{$login_id}'";
        $query = $this->db->query($sql);
        $data = $this->db->fetch($query);
        if($data['cnt'] == 0) {
            return $lastNum;
        }

        $sql = "SELECT max(ifnull(num, 0)) as last_num FROM `donmm_lecture` where memId = '{$login_id}' group by memId";
        $query = $this->db->query($sql);
        $data = $this->db->fetch($query);

        return $data['last_num'];
    }

    public function getExamCount($login_id) {
        $sql = "SELECT count(*) as cnt FROM `donmm_exam` where memId = '{$login_id}'";
        $query = $this->db->query($sql);
        $data = $this->db->fetch($query);
        return $data['cnt'];
    }

    public function getExamAnswerList($type) {
        // O: 1, X: 2
        if($type == 'a') {
            return array(
                4, 3, 4, 4, 2,
                2, 1, 4, 3, 2,
                4, 1, 3, 1, 1,
                2, 1, 1, 2, 2
            );
        }
        else {
            return array(
                4, 2, 4, 3, 2,
                3, 2, 1, 4, 4,
                3, 4, 2, 1, 1,
                2, 1, 1, 2, 2
            );
        }
    }

    public function getExamResult($login_id) {
        $sql = "SELECT memNo, memId, season, num, type, score  FROM `donmm_exam` where memId = '{$login_id}'";
        $query = $this->db->query($sql);
        $data = $this->db->fetch($query);
        return $data;
    }

    public function getExamResultLast($login_id) {
        $sql = "SELECT memNo, memId, season, num, type, score  FROM `donmm_exam` where memId = '{$login_id}'
                and num = (SELECT max(tt.num) FROM `donmm_exam` tt where tt.memId = '{$login_id}')";
        $query = $this->db->query($sql);
        $data = $this->db->fetch($query);
        return $data;
    }

    public function getExamResultHigherScore($login_id) {
        $sql = "SELECT memNo, memId, season, num, type, score  FROM `donmm_exam` where memId = '{$login_id}'
                and score = (SELECT max(tt.score) FROM `donmm_exam` tt where tt.memId = '{$login_id}')";
        $query = $this->db->query($sql);
        $data = $this->db->fetch($query);
        $data['num'] = $this->getExamCount($login_id);
        return $data;
    }

    // 응시 X : 0
    // 합격 : 1
    // 불합격 - 응시1: -1
    // 불합격 - 응시2: -2  // 다음기회 X
    public function checkExamPass($login_id) {
        $examCount = $this->getExamCount($login_id);
        if($examCount == 0) {
            return 0;
        }

        // 최종 불합격 일때만 result 로 이동 (합격해도 한번 더 볼 수 있도록. 한돈 요청사항. (두번 중 더 높은 점수를 원함.))
        // $examResult = $this->getExamResultLast($login_id);
        $examResult = $this->getExamResultHigherScore($login_id);
        $score = $examResult['score'];
        $num = $examCount; // $examResult['num'];

        $ret = 0;
        if($score >= 60) {
            $ret = 1;
        }
        else {
            if($num > 1) {
                $ret = -2;
            }
            else {
                $ret = -1;
            }
        }

        return $ret;
    }

    public function insertExamResult($insert_info) {
        $memNo = $insert_info['memNo'];
        $memId = $insert_info['memId'];
        $type = $insert_info['type'];
        $score = $insert_info['score'];
        $season = 1;

        $sql = "
            INSERT INTO `donmm_exam` (memNo, memId, season, num, type, score)
            VALUES ('{$memNo}', '{$memId}', '{$season}', (SELECT (ifnull(max(tt.num), 0) + 1) num FROM `donmm_exam` tt where tt.memId = '{$memId}'), '{$type}', {$score})
        ";

        $this->db->query($sql);
        return 1;
    }

    function convertUTF8String($str) {
        $enc = mb_detect_encoding($str, array("UTF-8", "EUC-KR", "SJIS"));
        if($str != "UTF-8") {
            $str = iconv($enc, "UTF-8", $str);
        }

        return $str;
    }

    function isUploadBannedItem($file_name) {
        // 파일 업로드 금지
        $ban_list = array('php', 'html', 'css', 'js'); // 금지 파일 확장자 수정 필요!!
        $exp_file_name = explode('.', $file_name);

        // 확장자 소문자로 가져오기
        $ext = strtolower($exp_file_name[sizeof($exp_file_name) - 1]);
        if (in_array($ext, $ban_list)) {
            return false;
        }
        return true;
    }

    function uuidgen() {
        return sprintf('%08x-%04x-%04x-%04x-%04x%08x',
            mt_rand(0, 0xffffffff),
            mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff),
            mt_rand(0, 0xffff), mt_rand(0, 0xffffffff)
        );
    }

    function getFileExtension($file_name) {
        $exp_file_name = explode('.', $file_name);

        // 확장자 소문자로 가져오기
        return strtolower($exp_file_name[sizeof($exp_file_name) - 1]);
    }

    // function uploadImage($upload_file) {
    //     $ret_upload_file_array_item = [
    //         'upload_file_path' => '',
    //         'file_name' => '',
    //         'file_save_name' => ''
    //     ];
    //
    //     $file_name = basename($this->convertUTF8String($upload_file['name']));
    //
    //     if (empty($file_name)) {
    //         return null;
    //     }
    //
    //     $file_temp_name = $this->convertUTF8String($upload_file['tmp_name']);
    //     //$file_type = $upload_files['type'][$i];
    //     //$file_size = $upload_files['size'][$i];
    //     //$file_error = $upload_files['error'][$i];
    //
    //     if (!$this->isUploadBannedItem($file_name)) {
    //         return null;
    //     }
    //
    //     // if( $file_error != UPLOAD_ERR_OK ) {
    //     //     $upload_error_msg = "";
    //     //     switch( $error ) {
    //     //         case UPLOAD_ERR_INI_SIZE:
    //     //         case UPLOAD_ERR_FORM_SIZE:
    //     //             $upload_error_msg = "파일이 너무 큽니다. ($error)";
    //     //             break;
    //     //         case UPLOAD_ERR_NO_FILE:
    //     //             $upload_error_msg = "파일이 첨부되지 않았습니다. ($error)";
    //     //             break;
    //     //         default:
    //     //             $upload_error_msg = "파일이 제대로 업로드되지 않았습니다. ($error)";
    //     //     }
    //     //     //error_alert($upload_error_msg);
    //     //     exit;
    //     // }
    //
    //     // if($file_size > 500000) {
    //     //     //error_alert ("파일이 너무 큽니다.");
    //     //     exit;
    //     // }
    //
    //     $today = date("Ymd");
    //     $upload_path = '/donmmelier/upload/' . $today;
    //     // $real_upload_path = '~/data/skin/front/mplshop_210928' . $upload_path;
    //     $real_upload_path = '.' . $upload_path;
    //     if (!is_dir($real_upload_path)) {
    //         mkdir($real_upload_path, 766, true);
    //     }
    //
    //
    //     //$file_save_name = $today . '_' . uuidgen() . '_' . $file_name;
    //     $file_save_name = $today . '_' . $this->uuidgen() . '.' . $this->getFileExtension($file_name);
    //     $real_upload_file = $real_upload_path . $file_save_name;
    //     //$move_resuslt = move_uploaded_file($file_temp_name, $upload_file);
    //     $move_resuslt = move_uploaded_file($file_temp_name, $real_upload_file);
    //     $ret_upload_file_array_item = [
    //         'upload_file_path' => $upload_path,
    //         'file_name' => $file_name,
    //         'file_save_name' => $file_save_name
    //     ];
    //
    //     return $ret_upload_file_array_item;
    // }

    /**
     * uploadFile 프로필 사진 처리
     */
    public function uploadImage($fileData)
      {
          $uploadMaxSize = 10;
          $imgUploadPath = 'upload/donmmelier/';
          if ($errorCode = $fileData['error'] != UPLOAD_ERR_OK) {
              switch ($errorCode) {
                  case UPLOAD_ERR_INI_SIZE :
                      throw new \Exception(sprintf(__('업로드 용량이 %1$s MByte(s) 를 초과했습니다.'), $uploadMaxSize));
                      break;
                  default :
                      throw new \Exception(__('알수 없는 오류입니다.') . '( UPLOAD ERROR CODE : ' . $errorCode . ')');
              }
          }

          if ($this->isAllowImageExtention($fileData['name']) === false) {
              $_errorFileName = str_replace(' ', '', $fileData['name']);
              throw new \Exception(__('허용하지 않는 확장자입니다.') . ' (' . $_errorFileName . ')');
          }

          if (is_uploaded_file($fileData['tmp_name'])) {
              if ($uploadMaxSize && $fileData['size'] > ($uploadMaxSize * 1024 * 1024)) {
                  throw new \Exception(sprintf(__('업로드 용량이 %1$s MByte(s) 를 초과했습니다.'), $uploadMaxSize));
              }
          }

          $uploadFileNm = $fileData['name'];
          $saveFileNm = 'tmp_' . substr(md5(microtime()), 0, 16).'.'.strtolower(pathinfo($fileData['name'], PATHINFO_EXTENSION));;

          $result = $this->storage->upload($fileData['tmp_name'], $imgUploadPath . $saveFileNm);

          return ['result' => $result, 'file_name' => $uploadFileNm, 'file_save_name' => $saveFileNm, 'img_upload_path' => $imgUploadPath];
      }

    /**
     * 이미지 확장자 체크
     *
     * @param $filename
     * @return bool
     */
    protected function isAllowImageExtention($filename)
    {
        $allowUploadExtension = [
            'jpg', 'png', 'jpeg'
        ];
        $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
        if (in_array($ext, $allowUploadExtension) === false) {
            return false;
        }

        return true;
    }

    public function insertLicenseSendInfo($insert_info) {
        $memNo = $insert_info['memNo'];
        $memId = $insert_info['memId'];
        $season = $insert_info['season'];
        $name = $insert_info['name'];
        $phone = $insert_info['phone'];
        $post_code = $insert_info['post_code'];
        $address = $insert_info['address'];
        $address_detail = $insert_info['address_detail'];
        $address_extra = $insert_info['address_extra'];
        $send_message = $insert_info['send_message'];
        $img_real_name = $insert_info['img_real_name'];
        $img_save_name = $insert_info['img_save_name'];
        $img_upload_path = $insert_info['img_upload_path'];

        // 중복 등록 될 수 있으므로 한개만 등록되도록 수정
        $nRet = 0;
        $insertedCount = $this->getLicenseCount($memId);
        if($insertedCount == 0) {
            $sql = "
            INSERT INTO `donmm_license`
                (memNo, memId, season, name, phone,
                post_code, address, address_detail, address_extra, send_message,
                img_real_name, img_save_name, img_upload_path )
            VALUES (
                '{$memNo}', '{$memId}', {$season}, '{$name}', '{$phone}',
                '{$post_code}', '{$address}', '{$address_detail}', '{$address_extra}', '{$send_message}',
                '{$img_real_name}', '{$img_save_name}', '{$img_upload_path}'
            )
            ";

            $this->db->query($sql);
            $nRet = 1;
        }
        
        return $nRet;
    }

    public function getLicenseCount($login_id) {
        $sql = "SELECT count(*) as cnt FROM `donmm_license` WHERE `memId` = '{$login_id}'";
        $query = $this->db->query($sql);
        $data = $this->db->fetch($query);
        return $data['cnt'];
    }

    public function getLicenseInfo($login_id) {
        $sql = "SELECT
            memNo, memId, season, name, phone,
            post_code, address, address_detail, address_extra, send_message,
            img_real_name, img_save_name, img_upload_path, created_at
        FROM `donmm_license`
        WHERE `memId` = '{$login_id}'";
        $query = $this->db->query($sql);
        $data = $this->db->fetch($query);
        return $data;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // admin
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public function loginAction($login_id, $login_pw) {
        $result_array = array();

        $sql = "SELECT count(*) as cnt FROM `donmm_members` WHERE `user_id` = '{$login_id}'";
        $query = $this->db->query($sql);
        $data = $this->db->fetch($query);

        if($data['cnt'] == 0) {
            $result_array['result'] = false;
            $result_array['code'] = -1;
            return $result_array;
        }

        $sql  = "
            SELECT seq, user_id, name, member_type, password
            FROM `donmm_members`
            WHERE `user_id` = '{$login_id}'
        ";

        $query = $this->db->query($sql);
        $data = $this->db->fetch($query);

        $dbPassword = $data['password'];

        if ($this->password_matches($login_pw, $dbPassword) == 0) {
            $result_array['result'] = false;
            $result_array['code'] = -2;
            return $result_array;
        }

        $result_array['result'] = true;
        $result_array['code'] = 1;
        $result_array['seq'] = $data['seq'];
        $result_array['user_id'] = $data['user_id'];
        $result_array['name'] = $data['name'];
        $result_array['member_type'] = $data['member_type'];

        return $result_array;
    }


    public function password_encrypt($password) {
        $hashed_password = password_hash($password, PASSWORD_DEFAULT /*, $password_options */);
        // $hashed_password = password_hash($password, PASSWORD_DEFAULT, $password_options);
        // $hashed_password = password_hash($password, PASSWORD_BCRYPT, $password_options);
        return $hashed_password;
    }

    public function password_matches($password, $hashed_password) {
        if (password_verify($password, $hashed_password /*, password_options */)) {
            //return true;
            return 1;
        } else {
            //return false;
            return 0;
        }
    }

    public function getMemberInfoList($page = 1, $searchType = '',  $searchStr = '') {
        $baseSql = "
            select
              @rownum:=@rownum+1 as no,
              vv.memId, vv.name, vv.phone, vv.created_at, ifnull(vv.num, 'N') as lnum, ifnull(exam.score1, 'N') as score1, ifnull(exam.score2, 'N') as score2 from (
                select regi.memId, regi.name, regi.phone, regi.created_at, lect.num
                from donmm_registration regi
                left outer join (select ltemp.memId, max(ifnull(ltemp.num, 0)) as num from donmm_lecture ltemp group by ltemp.memId) lect on regi.memId = lect.memId
            ) vv left outer join (SELECT
            etemp.memId,
            GROUP_CONCAT( if(etemp.num=1, etemp.score, NULL) ) AS score1,
            GROUP_CONCAT( if(etemp.num=2, etemp.score, NULL) ) AS score2
            FROM donmm_exam etemp, (SELECT @rownum:=0) no_temp
            GROUP BY etemp.memId) exam on vv.memId = exam.memId
            ORDER BY vv.created_at desc
        ";

        $searchSql = "SELECT ss_temp.* from ( " . $baseSql . " ) ss_temp ";
        if($searchStr != '') {
            if($searchType == 'name') {
                $searchSql .= "where name like '%{$searchStr}%' ";
            } else { // if($searchType == 'id') {
                $searchSql .= "where memId = '{$searchStr}' ";
            }
        }

        $totalSql = 'select count(*) as cnt FROM (' . $searchSql . ') as count_temp';
        $query = $this->db->query($totalSql);
        $data = $this->db->fetch($query);

        $total_count = $data['cnt'];

        $paging_info = $this->getPagingInfo($page, $total_count, $this->item_row_count, $this->page_block_count);

        $pageSql = "SELECT page_temp.* FROM ( " . $searchSql . " ) page_temp limit " . $paging_info['page_db'] . ", " . $this->item_row_count;

        $query = $this->db->query($pageSql);
        $data_list = array();
        while ($data = $this->db->fetch($query)) {
            array_push($data_list, [
                'no' => $data['no'],
                'mem_id' => $data['memId'],
                'name' => $data['name'],
                'phone' => $data['phone'],
                'created_at' => $data['created_at'],
                'lnum' => $data['lnum'],
                'score1' => $data['score1'],
                'score2' => $data['score2']
            ]);
        }

        $paging_info_json = json_encode($paging_info, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        $result_array = [
            'page_sql' => $pageSql,
            'paging_info' => $paging_info,
            'paging_info_json' => $paging_info_json,
            'data_list' => $data_list
        ];

        return $result_array;
    }


    public function getMemberInfoTotalList() {
        $sql = "
            select
              @rownum:=@rownum+1 as no,
              vv.memId, vv.name, vv.phone, vv.created_at, ifnull(vv.num, 'N') as lnum, ifnull(exam.score1, 'N') as score1, ifnull(exam.score2, 'N') as score2 from (
                select regi.memId, regi.name, regi.phone, regi.created_at, lect.num
                from donmm_registration regi
                left outer join (select ltemp.memId, max(ifnull(ltemp.num, 0)) as num from donmm_lecture ltemp group by ltemp.memId) lect on regi.memId = lect.memId
            ) vv left outer join (SELECT
            etemp.memId,
            GROUP_CONCAT( if(etemp.num=1, etemp.score, NULL) ) AS score1,
            GROUP_CONCAT( if(etemp.num=2, etemp.score, NULL) ) AS score2
            FROM donmm_exam etemp, (SELECT @rownum:=0) no_temp
            GROUP BY etemp.memId) exam on vv.memId = exam.memId
            ORDER BY vv.created_at asc
        ";

        $query = $this->db->query($sql);
        $data_list = array();
        while ($data = $this->db->fetch($query)) {
            array_push($data_list, [
                'no' => $data['no'],
                'mem_id' => $data['memId'],
                'name' => $data['name'],
                'phone' => $data['phone'],
                'created_at' => $data['created_at'],
                'lnum' => $data['lnum'],
                'score1' => $data['score1'],
                'score2' => $data['score2']
            ]);
        }

        return $data_list;
    }

    public function getLicenseInfoList($page = 1, $searchType = '',  $searchStr = '') {
        $baseSql = "
            SELECT
                @rownum:=@rownum+1 as no, lic.memNo, lic.memId, lic.season, lic.name, lic.phone,
                lic.post_code, lic.address, lic.address_detail, lic.address_extra, lic.send_message, 
                lic.img_real_name, lic.img_save_name, lic.img_upload_path,
                lic.created_at
            FROM donmm_license lic, (SELECT @rownum:=0) no_temp
            order by lic.created_at desc
        ";

        $searchSql = "SELECT ss_temp.* from ( " . $baseSql . " ) ss_temp ";
        if($searchStr != '') {
            if($searchType == 'name') {
                $searchSql .= "where name like '%{$searchStr}%' ";
            } else { // if($searchType == 'id') {
                $searchSql .= "where memId = '{$searchStr}' ";
            }
        }

        $totalSql = 'select count(*) as cnt FROM (' . $searchSql . ') as count_temp';
        $query = $this->db->query($totalSql);
        $data = $this->db->fetch($query);

        $total_count = $data['cnt'];

        $paging_info = $this->getPagingInfo($page, $total_count, $this->item_row_count, $this->page_block_count);

        $pageSql = "SELECT page_temp.* FROM ( " . $searchSql . " ) page_temp limit " . $paging_info['page_db'] . ", " . $this->item_row_count;

        $query = $this->db->query($pageSql);
        $data_list = array();
        while ($data = $this->db->fetch($query)) {
            array_push($data_list, [
                'no' => $data['no'],
                'mem_id' => $data['memId'],
                'name' => $data['name'],
                'phone' => $data['phone'],
                'post_code' => $data['post_code'],
                'address' => $data['address'],
                'address_detail' => $data['address_detail'],
                'address_extra' => $data['address_extra'],
                'send_message' => $data['send_message'],
                'img_real_name' => $data['img_real_name'],
                'img_save_name' => $data['img_save_name'],
                'img_upload_path' => $data['img_upload_path'],
                'created_at' => $data['created_at']
            ]);
        }
        $paging_info_json = json_encode($paging_info, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        $result_array = [
            'page_sql' => $pageSql,
            'paging_info' => $paging_info,
            'paging_info_json' => $paging_info_json,
            'data_list' => $data_list
        ];

        return $result_array;
    }


    public function getLicenseInfoTotalList() {
        $sql = "
        SELECT
            @rownum:=@rownum+1 as no, lic.memNo, lic.memId, lic.season, lic.name, lic.phone,
            lic.post_code, lic.address, lic.address_detail, lic.address_extra, lic.send_message, lic.created_at
        FROM donmm_license lic, (SELECT @rownum:=0) no_temp
        order by lic.created_at desc
        ";

        $query = $this->db->query($sql);
        $data_list = array();
        while ($data = $this->db->fetch($query)) {
            array_push($data_list, [
                'no' => $data['no'],
                'mem_id' => $data['memId'],
                'name' => $data['name'],
                'phone' => $data['phone'],
                'post_code' => $data['post_code'],
                'address' => $data['address'],
                'address_detail' => $data['address_detail'],
                'address_extra' => $data['address_extra'],
                'send_message' => $data['send_message'],
                'created_at' => $data['created_at']
            ]);
        }

        return $data_list;
    }
}
