<?php

/**
 * Created by HKM Corporation.
 * User: Hesk
 * Date: 14年8月27日
 * Time: 上午11:27
 */
class SliderList extends listBase
{
    private $all_zero, $ignore_type;
    private $preset = array(
        'posts_per_page' => -1,
        'offset' => 0,
        'category' => '',
        'orderby' => 'post_date',
        'order' => 'DESC',
        'include' => '',
        'exclude' => '',
        'meta_key' => '',
        'meta_value' => '',
        'post_type' => VSLIDER,
        'post_mime_type' => '',
        'post_parent' => '',
        'post_status' => 'publish');
    private $final_set = array(), $result = array(), $done = false, $cat_id = 0, $country_id = 0;

    /**
     * @param array $args
     */
    public function __construct($args = array())
    {
        $this->final_set = wp_parse_args($args, $this->preset);
    }

    private function meta_query($Q)
    {
        $meta = array();
        if (isset($Q->pointing)) $meta[] = array(
            'key' => 'point_to',
            'value' => $Q->pointing,
            'compare' => '='
        );
        if (isset($Q->type)) $meta[] = array(
            'key' => 'platform',
            'value' => $Q->type,
            'compare' => '='
        );
        return $meta;
    }

    /**
     * @param $Q
     * @throws Exception
     */
    public function get_slider_in_cat($Q)
    {
        if (!isset($Q->ids)) throw new Exception("parameter ids is not set", 111001);
        $t = explode(".", $Q->ids);
        $c1 = (int)$t[0];
        $c2 = (int)$t[1];
        $this->ignore_type = !isset($Q->type);
        $this->all_zero = $c1 === 0 && $c2 === 0;
        if (!$this->all_zero && $this->ignore_type) throw new Exception("type is not set", 111002);
        if ($Q->type == 'rewards' || $Q->type == 'coupons') {
            if ($this->all_zero) {
                $args = array(
                    /* "meta_key" => "point_to",
                     "meta_value" => $pointer,
                     "meta_compare" => "="*/
                    'meta_query' => $this->meta_query($Q)
                );
            } elseif ($c1 === 0) {
                $args = array(
                    'cat' => $c2,
                    'meta_query' =>$this->meta_query($Q)
                );
            } elseif ($c2 === 0) {
                $args = array(
                    'tax_query' => array(
                        'taxonomy' => 'country',
                        'field' => 'id',
                        'terms' => $c1
                    ),
                    'meta_query' =>$this->meta_query($Q)
                );
            } else {
                $args = array(
                    'cat' => $c2,
                    'tax_query' => array(
                        'taxonomy' => 'country',
                        'field' => 'id',
                        'terms' => $c1
                    ),
                    'meta_query' =>$this->meta_query($Q)
                );
            }
        } else if ($Q->type == 'ios') {
            if ($this->all_zero) {
                $args = array(
                    'meta_query' => $this->meta_query($Q)
                );
            } elseif ($c1 === 0) {
                $args = array(
                    'tax_query' => array(

                        array(
                            'taxonomy' => 'appcate',
                            'field' => 'id',
                            'terms' => $c2
                        ),
                    ),
                    'meta_query' => $this->meta_query($Q)
                );
            } elseif ($c2 === 0) {
                $args = array(
                    'tax_query' => array(
                        array(
                            'taxonomy' => 'countryios',
                            'field' => 'id',
                            'terms' => $c1
                        ),

                    ),
                    'meta_query' =>$this->meta_query($Q)
                );
            } else {
                $args = array(
                    'tax_query' => array(
                        array(
                            'taxonomy' => 'countryios',
                            'field' => 'id',
                            'terms' => $c1
                        ),
                        array(
                            'taxonomy' => 'appcate',
                            'field' => 'id',
                            'terms' => $c2
                        ),
                    ),
                    'meta_query' => $this->meta_query($Q)
                );
            }


        } else if ($Q->type == 'android') {

            if ($this->all_zero) {
                $args = array(
                    'meta_query' => $this->meta_query($Q)
                );
            } elseif ($c1 === 0) {
                $args = array(
                    'tax_query' => array(

                        array(
                            'taxonomy' => 'appandroid',
                            'field' => 'id',
                            'terms' => $c2
                        ),
                    ),
                    'meta_query' =>$this->meta_query($Q)
                );
            } elseif ($c2 === 0) {
                $args = array(
                    'tax_query' => array(
                        array(
                            'taxonomy' => 'countryandroid',
                            'field' => 'id',
                            'terms' => $c1
                        ),

                    ),
                    'meta_query' => $this->meta_query($Q)
                );
            } else {
                $args = array(
                    'tax_query' => array(
                        array(
                            'taxonomy' => 'countryandroid',
                            'field' => 'id',
                            'terms' => $c1
                        ),
                        array(
                            'taxonomy' => 'appandroid',
                            'field' => 'id',
                            'terms' => $c2
                        ),
                    ),
                    'meta_query' => $this->meta_query($Q)
                );
            }


        } else {
            throw new Exception("parameter type is not matched", 1012);
        }


        $this->country_id = (int)$t[0];
        $this->cat_id = (int)$t[1];
        $this->final_set = wp_parse_args($args, $this->preset);
        $this->done = false;
        $this->doQuery($this->final_set);

    }

    /**
     * @param $thumb_ids
     * @return array
     */
    private function get_slid($thumb_ids)
    {
        $slide = array();
        // if ($thumb_ids != "") {
        foreach ($thumb_ids as $thumb_id) {
            //  inno_log_db::log_admin_coupon_management(-1, 1212, print_r($thumb_ids, true));
            $image = wp_get_attachment_image_src($thumb_id, 'large');
            if (!empty($image)) {
                $slide[] = array(
                    "url" => $image[0],
                    "width" => $image[1],
                    "height" => $image[2],
                );
            }
        }
        // }
        //   return count($slide) > 0 ? $slide : "";
        return $slide;
    }

    /**
     * the liking hood to handle the input ids
     * @param $post_id
     * @param $country_id
     * @param $cate_id
     * @throws Exception
     * @return array
     */
    private function get_slid_list($post_id, $country_id, $cate_id)
    {
        $name_field = 's_list_' . $country_id . "_" . $cate_id;
        // inno_log_db::log_admin_vendor_management(-1, 1212, $name_field);
        $thumb_ids = get_post_meta($post_id, $name_field, false);
        $k = $this->get_slid($thumb_ids);
        if (count($k) == 0) throw new Exception("skip to next", 101099);
        return $k;
    }

    /**
     * @param $post_id
     * @return array
     * @throws Exception
     */
    private function get_all_slid($post_id)
    {
        global $wpdb;
        $name_field = 's_list_%';
        $L = $wpdb->prepare("SELECT * FROM $wpdb->postmeta WHERE meta_key LIKE %s AND post_id=%d", $name_field, $post_id);
        $RR = $wpdb->get_results($L);
        $thumb_ids = array();
        if ($RR) {
            if (count($RR) > 0) {
                foreach ($RR as $R) {
                    $n = explode(",", $R->meta_value);
                    $thumb_ids = array_merge($thumb_ids, $n);
                }
            } else {
                throw new Exception("skip to next", 101099);
            }
        }
        //  $thumb_ids = explode(",", $R->meta_value);
        // inno_log_db::log_admin_coupon_management(-1, 660422, print_r($RR, true));
        $k = $this->get_slid($thumb_ids);
        if (count($k) == 0) throw new Exception("skip to next", 101099);
        return $k;
    }

    /**
     * post ID
     * @param $post_id_found
     * @param array $args
     * @internal param $post_id
     * @return array
     */
    protected function inDaLoop($post_id_found, $args = array())
    {
        $l = wp_get_attachment_image_src(get_post_thumbnail_id($post_id_found), 'large');
        $i = intval(get_post_meta($post_id_found, "time_to_next", true));
        $post_id = intval(get_post_meta($post_id_found, "point_to", true));
        //  $list1 = wp_get_post_terms($post_id, 'country');
        //   $list2 = wp_get_post_categories($post_id);

        if ($this->all_zero) {
            $sliders = $this->get_all_slid($post_id_found);
            // inno_log_db::log_admin_coupon_management(-1, 660422, print_r($sliders, true));
        } else {
            $sliders = $this->get_slid_list($post_id_found, $this->country_id, $this->cat_id);
        }
        $object = array(
            "collection_name" => get_the_title($post_id_found),
            "id" => (int)$post_id_found,
            "post_type" => get_post_meta($post_id_found, "platform", true),
            //get_post_type($post_id_found),
            "thumb" => isset($l[0]) ? $l[0] : "",
            "post_id" => (int)$post_id,
            "time_to_next" => (int)$i,
            "slides" => $sliders
            // "country" => $this->looptax($list1, $post_id),
            // "cate" => $this->loopcat($list2, $post_id),
        );

        return $object;
    }
}