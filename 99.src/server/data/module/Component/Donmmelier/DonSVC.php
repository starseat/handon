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

    /**
     * 생성자
     */
    public function __construct(DBTool $db = null, array $config = [])
    {
        if (!is_object($this->db)) {
            $this->db = \App::load('DB');
        }
    }

    public function getLoginUrl() {
        // 통합 로그인 전
        $returnUrl = 'https://www.han-don.com/member/index.php?mode=login&tabst=donmmelier';

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
}
