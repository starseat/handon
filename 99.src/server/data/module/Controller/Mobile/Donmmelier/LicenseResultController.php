<?php

/**
 * This is commercial software, only users who have purchased a valid license
 * and accept to the terms of the License Agreement can install and use this
 * program.
 *
 * Do not edit or add to this file if you wish to upgrade Godomall5 to newer
 * versions in the future.
 *
 * @copyright ⓒ 2016, NHN godo: Corp.
 * @link http://www.godo.co.kr
 */
namespace Controller\Mobile\Donmmelier;

use App;
use Globals;
use Request;
use Session;
use Component\Member\MyPage;
use Component\Member\Member;
use Component\Donmmelier\DonSVC;
use Component\Member\Util\MemberUtil;
use Component\Donmmelier\Test;
use Framework\Debug\Exception\AlertBackException;
use Framework\Debug\Exception\RedirectLoginException;

/**
 * 한돈 소믈리에 자격증 신청 결과
 *  - 로그인 필요
 * @author jw.lee
 */
class LicenseResultController extends \Controller\Mobile\Controller
{
  /**
   * index
   *
   */
  public function index()
  {
    $donSvc = \App::load('\\Component\\Donmmelier\\DonSVC');
    $session = \App::getInstance('session');
    if (!$session->has(Member::SESSION_MEMBER_LOGIN)) {
      $returnUrl = $donSvc->getLoginUrl();
      $msg = 'alert(\'로그인이 필요합니다.\');parent.location.href=\'' . $returnUrl . '\';';
      $this->js($msg);
      exit;
    }

    /* 회원 로그인 정보 */
    $myPage = new MyPage();
    $memberData = $myPage->myInformation();
    $memId = $memberData['memId'];
    $memNm = $memberData['memNm'];

    $regi_count = $donSvc->getCountDonmmRegisteredFromId($memId);
    if($regi_count < 1) {
      $msg = 'alert(\'수강 신청을 하신 후 이용 바랍니다.\');parent.location.href=\'./index.php\';';
      $this->js($msg);
      exit;
    }

    $lnum = $donSvc->getLastLectureNumber($memId);
    if($lnum < 3) {
      $msg = 'alert(\'모든 강의 수강 후 이용 바랍니다.\');parent.location.href=\'./lecture.php\';';
      $this->js($msg);
      exit;
    }

    $is_pass = 1;
    // 응시 X : 0
    // 합격 : 1
    // 불합격 - 응시1: -1
    // 불합격 - 응시2: -2  // 다음기회 X
    $retExam = $donSvc->checkExamPass($memId);
    if($retExam < 1) {
      $msg = 'alert(\'한돈 소믈리에 자격 증명 후 이용 바랍니다.\');parent.location.href=\'./exam_init.php\';';
      $this->js($msg);
      exit;
    }

    $lCount = $donSvc->getLicenseCount($memId);
    if($lCount < 1) {
      $msg = 'alert(\'한돈 소믈리에 자격증 신청 후 바랍니다.\');parent.location.href=\'manifesto./.php\';';
      $this->js($msg);
      exit;
    }

    $lInfo = $donSvc->getLicenseInfo($memId);

    $this->setData('last_lecture_num', $donSvc->getLastLectureNumber($memId));
    $this->setData('member_id', $memId);
    $this->setData('member_name', $memNm);
    $this->setData('license_name', $lInfo['name']);
    $this->setData('license_phone', $lInfo['phone']);
    $this->setData('license_post_code', $lInfo['post_code']);
    $this->setData('license_address', $lInfo['address']);
    $this->setData('license_address_detail', $lInfo['address_detail']);
    $this->setData('license_address_extra', $lInfo['address_extra']);
    $this->setData('license_send_message', $lInfo['send_message']);
    $this->setData('license_img_real_name', $lInfo['img_real_name']);
    $this->setData('license_img_save_name', $lInfo['img_save_name']);
    $this->setData('license_img_upload_path', $lInfo['img_upload_path']);
    $this->setData('license_created_at', $lInfo['created_at']);    
  }
}
