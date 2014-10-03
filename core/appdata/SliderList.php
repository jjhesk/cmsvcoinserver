<?php

/**
 * Created by PhpStorm.
 * User: Hesk
 * Date: 14年8月27日
 * Time: 上午11:27
 */
class SliderList extends listBase
{

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

    public function __construct($args = array())
    {
        $this->final_set = wp_parse_args($args, $this->preset);
    }

    /**
     * @param $query
     * @throws Exception
     */
    public function get_slider_in_cat($query)
    {
        if (!isset($query->ids)) throw new Exception("parameter ids is not set", 1010);
        $t = explode(".", $query->ids);


        if (!isset($query->type)) throw new Exception("parameter type is not set", 1011);
        $c1 = intval($t[0]);
        $c2 = intval($t[1]);

        if ($query->type == 'rewards') {
            if ($c1 === 0 && $c2 === 0) {
                $args = array(
                    'meta_query' => array('point_to' => 'rewards')
                );
            } elseif ($c1 === 0) {
                $args = array(
                    'cat' => $c2,
                    'meta_query' => array('point_to' => 'rewards')
                );
            } elseif ($c2 === 0) {
                $args = array(
                    'tax_query' => array(
                        'taxonomy' => 'country',
                        'field' => 'id',
                        'terms' => $c1
                    ),
                    'meta_query' => array('point_to' => 'rewards')
                );
            } else {
                $args = array(
                    'cat' => $c2,
                    'tax_query' => array(
                        'taxonomy' => 'country',
                        'field' => 'id',
                        'terms' => $c1
                    ),
                    'meta_query' => array('point_to' => 'rewards')
                );
            }
        } else if ($query->type == 'ios') {
            if ($c1 === 0 && $c2 === 0) {
                $args = array(
                    'meta_query' => array('point_to' => 'ios')
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
                    'meta_query' => array('point_to' => 'ios')
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
                    'meta_query' => array('point_to' => 'ios')
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
                    'meta_query' => array('point_to' => 'ios')
                );
            }


        } else if ($query->type == 'android') {

            if ($c1 === 0 && $c2 === 0) {
                $args = array(
                    'meta_query' => array('point_to' => 'appandroid')
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
                    'meta_query' => array('point_to' => 'android')
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
                    'meta_query' => array('point_to' => 'android')
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
                    'meta_query' => array('point_to' => 'android')
                );
            }


        } else {
            throw new Exception("parameter type is not matched", 1012);
        }


        $this->country_id = intval($t[0]);
        $this->cat_id = intval($t[1]);
        $this->final_set = wp_parse_args($args, $this->preset);
        $this->done = false;
        $this->doQuery($this->final_set);

    }

    /**
     * the liking hood to handle the input ids
     * @param $post_id
     * @param $country_id
     * @param $cate_id
     * @return array
     */
    private function get_slid_list($post_id, $country_id, $cate_id)
    {
        $name_field = 's_list_' . $country_id . "_" . $cate_id;
        inno_log_db::log_admin_vendor_management(-1, 1212, $name_field);
        $thumb_ids = get_post_meta($post_id, $name_field, false);
        $slide = array();
        // if ($thumb_ids != "") {
        foreach ($thumb_ids as $thumb_id) {
            //  inno_log_db::log_admin_coupon_management(-1, 1212, print_r($thumb_ids, true));
            $image = wp_get_attachment_image_src($thumb_id, 'large');
            $slide[] = array(
                "url" => $image[0],
                "width" => $image[1],
                "height" => $image[2],
            );
        }
        // }
        //   return count($slide) > 0 ? $slide : "";
        return $slide;
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
        $object = array(
            "collection_name" => get_the_title($post_id_found),
            "id" => $post_id_found,
            "thumb" => isset($l[0]) ? $l[0] : "",
            "post_id" => $post_id,
            "time_to_next" => $i,
            "slides" => $this->get_slid_list($post_id_found, $this->country_id, $this->cat_id)
            // "country" => $this->looptax($list1, $post_id),
            // "cate" => $this->loopcat($list2, $post_id),
        );

        return $object;
    }
}