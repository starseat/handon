<?php
/**
 *
 * This is commercial software, only users who have purchased a valid license
 * and accept to the terms of the License Agreement can install and use this
 * program.
 *
 * Do not edit or add to this file if you wish to upgrade Godomall5 to newer
 * versions in the future.
 *
 * @copyright ⓒ 2016, NHN godo: Corp.
 * @link      http://www.godo.co.kr
 *
 */

namespace Component\Donmmelier;

use App;
use Component\Database\DBTableField;
use Component\Member\Util\MemberUtil;
use Framework\Utility\StringUtils;
use Globals;
use Request;
use Session;

/**
 * Share Class
 *
 * @author    kwo
 */
class Test
{
  // 디비 접속
  /** @var \Framework\Database\DBTool $db */
  protected $db;
  protected $pagination;  //웹페이징

  /**
   * @var array arrBind
   */
  protected $arrBind = [];
  protected $arrWhere = [];
  protected $checked = [];
  protected $selected = [];
  protected $search = [];

  /**
   * 생성자
   */
  public function __construct(DBTool $db = null, array $config = [])
  {
      if (!is_object($this->db)) {
          $this->db = \App::load('DB');
      }
  }

  /**
  * 뒷심다짐 이벤트 총 개수
  * @author kwon
  */
  public function getCommentTotal(){
    $cmtList = [];

    $strSQL = "SELECT count(*) AS cnt FROM `bp_event_comment_apply`";
    $query = $this->db->query($strSQL);
    $data = $this->db->fetch($query);
    return $data['cnt'];
  }
}
