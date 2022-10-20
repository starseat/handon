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
 * 한돈 소믈리에 자격증 신청서 제출
 *  - 로그인 필요
 * @author jw.lee
 */
class LicenseSubmitController extends \Controller\Mobile\Controller
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

    $params = Request::post()->toArray();
    
    $_uploadFile = Request::files()->get('licenseFile');
    $uploadInfo = $donSvc->uploadImage($_uploadFile);

    $image_name = $uploadInfo['file_name'];
    $image_name_save = $uploadInfo['file_save_name'];
    $upload_path = $uploadInfo['upload_file_path'];

    $insert_info = [
      'memNo' => $memberData['memNo'], 
      'memId' => $memId, 
      'season' => 1, 
      'name' => $params['licenseName'], 
      'phone' => $params['licensePhone'], 
      'post_code' => $params['licensePostCode'], 
      'address' => $params['licenseAddress'], 
      'address_detail' => $params['licenseAddressDetail'], 
      'address_extra' => $params['licenseAddressExtra'], 
      'send_message' => $params['licenseSendMessage'], 
      'img_real_name' => $image_name, 
      'img_save_name' => $image_name_save, 
      'img_upload_path' => $upload_path
    ];

    // $this->setData('last_lecture_num', $donSvc->getLastLectureNumber($memId));
    // $this->setData('member_name', $memNm);
    // $this->setData('params', json_encode($params, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    // $this->setData('insert_info', json_encode($insert_info, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    // $this->setData('godo_directory_uri', Request::getDirectoryUri());
    // $this->setData('godo_file_uri', Request::getFileUri());

    // 중복 등록 될 수 있으므로 한개만 등록되도록 수정
    $insertedCount = $donSvc->getLicenseCount($memId);
    if($insertedCount == 0) {
      $donSvc->insertLicenseSendInfo($insert_info);
    }
    $msg = 'parent.location.href=\'./license_result.php\';';
    $this->js($msg);
    exit;
    
  }
}
