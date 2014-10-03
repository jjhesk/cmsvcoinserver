<?php

/**
 * Created by PhpStorm.
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
            'posts_per_page' => -1,
        );
    private $result, $query;
    private $metaquery, $taxquery, $platform;
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
            if (isset($query->platform)) {
                $this->platform = $query->platform;
                if ($query->platform == 'ios') {
                    $this->metaquery[] = array('_platform' => 'ios');
                    if (isset($query->cat)) {
                        $this->taxquery[] = array(
                            'taxonomy' => 'appcate',
                            'field' => 'id',
                            'terms' => intval($query->cat),
                        );
                    }
                } elseif ($query->platform == 'android') {
                    $this->metaquery[] = array('_platform' => 'android');
                    if (isset($query->cat)) {
                        $this->taxquery[] = array(
                            'taxonomy' => 'appandroid',
                            'field' => 'id',
                            'terms' => intval($query->cat),
                        );
                    }
                }
                unset($query->platform);
                unset($query->cat);
            }

            if (count($this->metaquery) > 0) {
                $this->query[] = array('meta_query' => $this->metaquery);
            }
            if (count($this->taxquery) > 0) {
                $this->query[] = array('tax_query' => $this->taxquery);
            }
            $this->doQuery(wp_parse_args($this->query, $this->config));
        } catch (Exception $e) {
            throw $e;
        }
    }

    protected function doQuery($configurations)
    {
        $this->query = $configurations;
        $customer_wp_query = new WP_Query($configurations);
        if ($customer_wp_query->have_posts()) :
            while ($customer_wp_query->have_posts()) : $customer_wp_query->the_post();
                $this->result[] = self::inloop2(intval($customer_wp_query->post->ID), $this->platform);
            endwhile;
        else:
            throw new Exception("no data found", 1019);
        endif;
        wp_reset_query();
    }

    public function get_query()
    {
        return $this->query;
    }

    public function getResultArr()
    {
        return array_values($this->result);
    }


    public static function inloop2($id, $platform)
    {
        if ($platform == 'ios') {
            $cat = 'appcate';
        } else {
            $cat = 'appandroid';
        }
        if (!get_the_terms($id, $cat)) {
            $cat_term = array();
        } else {
            $cat_term = array_values(get_the_terms($id, $cat));
        }
        $comment = new AppComment("appcomment");
        return array(
            "ID" => $id,
            "icon" => get_post_meta($id, '_icon', true),
            "store_id" => get_post_meta($id, '_storeid', true),
            "description" => get_post_meta($id, '_description', true),
            "platform" => get_post_meta($id, '_platform', true),
            "developer" => intval(get_post_meta($id, '_developer', true)),
            "developer_name" => get_post_meta($id, '_developer', true),
            "app_name" => get_post_meta($id, '_appname', true),
            "cat_term" => $cat_term,
            "comment_count" => $comment->get_comment_count($id),
        );
    }

    public static function inloop($post_id)
    {
        // TODO: Implement inloop() method.
    }

    protected function inDaLoop($id, $args = array())
    {
        // TODO: Implement inDaLoop() method.
    }
}