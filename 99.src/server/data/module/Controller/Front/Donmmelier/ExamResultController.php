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
namespace Controller\Front\Donmmelier;

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
 * 한돈 소믈리에 마이 페이지
 *  - 로그인 필요
 * @author jw.lee
 */
class ExamResultController extends \Controller\Front\Controller
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

    $eCount = $donSvc->getExamCount($memId);
    if($eCount <= 0) {
      $msg = 'alert(\'시험 응시 후 이용 바랍니다.\');parent.location.href=\'./exam_init.php\';';
      $this->js($msg);
      exit;
    }

    $isPass = 0;
    $examResult = $donSvc->getExamResultLast($memId);
    if(intval($examResult['score']) >= 60) {
      $isPass = 1;
    }

    $this->setData('last_lecture_num', $donSvc->getLastLectureNumber($memId));
    $this->setData('member_name', $memNm);
    $this->setData('score', $examResult['score']);
    $this->setData('is_pass', $isPass);
    $this->setData('exam_type', $examResult['type']);
    $this->setData('exam_season', $examResult['season']);
    $this->setData('exam_num', $examResult['num']);
  }
}
