<?php

namespace Component\Donmmelier;

use App;
use Component\Database\DBTableField;
use Framework\Database\DBTool;
use Framework\Object\SingletonTrait;
use Framework\Utility\DateTimeUtils;
use Framework\Utility\StringUtils;

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

        $sql = "
            INSERT INTO `donmm_lecture` (memNo, memId, season, num) 
            VALUES ('{$memNo}', '{$memId}', {$season}, {$num})
        ";
        
        $this->db->query($sql);
        return 1;
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
    
}
