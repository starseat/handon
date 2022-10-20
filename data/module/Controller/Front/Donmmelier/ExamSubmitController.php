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
 * 한돈 소믈리에 시험 제출
 *  - 로그인 필요
 * @author jw.lee
 */
class ExamSubmitController extends \Controller\Front\Controller
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
    if($eCount > 2) {
      $msg = 'parent.location.href=\'./exam_result.php\';';
      $this->js($msg);
      exit;
    }

    try {
      $params = Request::post()->toArray();
      $examType = Request::post()->get('quiz_type');
      $answerList = $donSvc->getExamAnswerList($examType);
      $score = 0;

      for($i=0; $i<20; $i++) {
        $selectAnswer = intval($params['select_answer_' . $i]);
        if($selectAnswer == intval($answerList[$i])) {
          $score += 5;
        }
      }

      $insert_info = [
        'memNo' => $memberData['memNo'], 
        'memId' => $memId, 
        'type' => $examType, 
        'score' => $score, 
      ];
      $donSvc->insertExamResult($insert_info);

      $msg = 'parent.location.href=\'./exam_result.php\';';
      $this->js($msg);
      exit;
    }
    catch(Exception $e) {
      $msg = 'alert(\'오류가 발생하였습니다.\');parent.location.href=\'./exam_preview.php\';';
      $this->js($msg);
      exit;
    }
  }
}
