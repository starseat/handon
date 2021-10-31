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
namespace Controller\Front\Donmmelier\Dadmin;

use Component\Member\Member;
use Component\Member\MyPage;
use Component\Donmmelier\Test;
use Framework\Debug\Exception\AlertBackException;
use Framework\Debug\Exception\RedirectLoginException;

/**
 * 한돈 소믈리에 관리자 자격증 관리
 * @author jw.lee
 */
class LicenseController extends \Controller\Front\Controller
{

  /**
   * index
   *
   */
  public function index()
  {
    $session = \App::getInstance('session');
    if (!$session->has('donmm_is_login') || $session->get('donmm_is_login') == 0) {
      $msg = 'alert(\'로그인이 필요합니다.\');parent.location.href=\'./login.php\';';
      $this->js($msg);
      exit;
    }

    $page = 1;
    if (Request::get()->has('page')) {
        $page = intval(Request::get()->get('page'));
    }

    $searchType = '';
    if (Request::get()->has('searchType')) {
      $searchType = strtolower(Request::get()->get('searchType'));
    }

    $searchStr = '';
    if (Request::get()->has('searchStr')) {
      $searchStr = strtolower(Request::get()->get('searchStr'));
    }

    $donSvc = \App::load('\\Component\\Donmmelier\\DonSVC');
    $result_array = $donSvc->getLicenseInfoList($page, $searchType, $searchStr);
    
    $this->setData('param_search_type', $searchType);
    $this->setData('param_search_str', $searchStr);

    // $this->setData('paging_info', $result_array['paging_info']);
    $this->setData('page_cur', $page);
    // $this->setData('page_db', $result_array['paging_info']['page_db']);
    $this->setData('page_start', $result_array['paging_info']['page_start']);
    $this->setData('page_end', $result_array['paging_info']['page_end']);
    $this->setData('page_prev', $result_array['paging_info']['page_prev']);
    $this->setData('page_next', $result_array['paging_info']['page_next']);
    $this->setData('page_total', $result_array['paging_info']['page_total']);

    $this->setData('data_list', $result_array['data_list']);
  }
}
