<?php

/**
 * Created by HKM Corporation.
 * User: Hesk
 * Date: 14年8月25日
 * Time: 上午11:56
 */
class AppList extends listBase
{
    private $config =
        array(
            'post_type' => APPDISPLAY,
            'post_status' => 'publish',
            'posts_per_page' => 10,
            'paged' => 1
        );
    private $result, $query;
    private $metaquery, $taxquery, $platform, $cat;
    //= array("relation" => "AND");
    // private $taxquery
    //= array("relation" => "AND");
    // private $platform = "";

    public function __construct($query)
    {
        try {
            //reset the result
            $this->result = array();
            $this->metaquery = array();
            $this->taxquery = array();
            $this->query = array();
            //========================
            if (!isset($query->platform))
                throw new Exception("query platform is not set", 1022);

            $this->platform = strtolower($query->platform);
            $this->cat = $this->platform == 'ios' ? 'appcate' : 'appandroid';
            $this->metaquery[] = array(
                "key" => "_platform",
                "value" => $this->platform,
                "compare" => "LIKE"
            );

            if (isset($query->cat)) {
                if (intval($query->cat) > 0)
                    $this->taxquery[] = array(
                        'taxonomy' => $this->cat,
                        'field' => 'id',
                        'terms' => intval($query->cat),
                    );
                unset($query->cat);
            }

            unset($query->platform);

            /* if (isset($query->platform)) {
                 $this->platform = strtolower($query->platform);
                 if ($query->platform == 'ios') {
                     $this->metaquery['_platform'] = 'ios';
                     if (isset($query->cat)) {
                         if (intval($query->cat) > 0)
                             $this->taxquery[] = array(
                                 'taxonomy' => 'appcate',
                                 'field' => 'id',
                                 'terms' => intval($query->cat),
                             );
                     }
                 } elseif ($query->platform == 'android') {
                     $this->metaquery['_platform'] = 'android';
                     // $this->metaquery[] = array('_platform' => 'android');
                     if (isset($query->cat)) {
                         if (intval($query->cat) > 0)
                             $this->taxquery[] = array(
                                 'taxonomy' => 'appandroid',
                                 'field' => 'id',
                                 'terms' => intval($query->cat),
                             );
                     }
                 }
                 unset($query->platform);
                 unset($query->cat);
             }*/

            if (count($this->metaquery) > 0) {
                $this->query['meta_query'] = $this->metaquery;
                $this->query['meta_query']["relation"] = "AND";
                unset($this->metaquery);
            }
            if (count($this->taxquery) > 0) {
                $this->query['tax_query'] = $this->taxquery;
                unset($this->taxquery);
            }
            if (isset($query->p)) {
                $p = intval($query->p);
                if ($p > 1) {
                    $this->query['posts_per_page'] = 10;
                    $this->query['paged'] = $p;
                }
                unset($p);
            }
            if (isset($query->keyword)) {
                if (!empty($query->keyword))
                    $this->query['s'] = $query->keyword;
            }
            $pre = wp_parse_args($this->query, $this->config);
            //  inno_log_db::log_admin_coupon_management(-1, 1001, "<pre>" . print_r($pre, true) . "</pre>");
            $this->doQuery($pre);
            unset($query);
        } catch (Exception $e) {
            throw $e;
        }
    }


    public function get_query()
    {

        return $this->query;
    }

    /*  public function getResultArr()
      {
          return array_values($this->result);
      }

    public static function inloop($post_id)
    {

    }
*/
    protected function inDaLoop($id, $args = array())
    {
        // TODO: Implement inDaLoop() method.
        //inno_log_db::log_admin_coupon_management(-1, 1001, $id . " the ID is in here");
        $id = (int)$id;
        //  $cat = $this->platform == 'ios' ? 'appcate' : 'appandroid';
        $cat_term = !get_the_terms($id, $this->cat) ? array() : array_values(get_the_terms($id, $this->cat));
        $comment = new AppComment($id);
        return array(
            "ID" => $id,
            "icon" => get_post_meta($id, '_icon', true),
            "store_id" => get_post_meta($id, '_storeid', true),
            "description" => get_post_meta($id, '_description', true),
            "platform" => get_post_meta($id, '_platform', true),
            "developer" => intval(get_post_meta($id, '_developer', true)),
            "developer_name" => get_post_meta($id, '_developer_name', true),
            "app_name" => get_post_meta($id, '_appname', true),
            "coin" => intval(get_post_meta($id, 'price', true)),
            "cat_term" => $cat_term,
            "comment_count" => $comment->get_comment_count($id)
        );
    }


}