<?php
/**
 * Created by PhpStorm.
 * User: hesk
 * Date: 9/15/14
 * Time: 10:23 PM
 */
if (!class_exists('SearchList')) {
    class SearchList extends listBase
    {
        private $config =
            array(
                'post_type' => array(VCOUPON, VPRODUCT),
                'post_status' => 'publish',
                'posts_per_page' => -1,
                'orderby' => 'date',
                'order' => 'DESC',
                'paged' => 0
            );
        private $byLng;

        public function __construct($input)
        {
            //-------------------------------------
            $country = $input->country;
            $cat = $input->cat;
            $devID = $input->developer;
            $keyword = $input->keyword;
            $platform = $input->platform;
            $paging = $input->p;
            $tax = array();
            $meta_query = array();

            //search for developers app
            if (isset($devID)) {
                $query = array('post_type' => APPDISPLAY);
                $meta_query[] = array('_developer' => $devID);
            }
            $query['suppress_filters'] = true;
            if (isset($input->lang)) {
                $this->byLng = $input->lang;
            } else {
                $this->byLng = false;
            }
            //'suppress_filters' => true
            //filter by platform
            if (isset($platform)) {
                $query = array('post_type' => APPDISPLAY);
                $meta_query[] = array('_platform' => $platform);
                if ($platform == 'ios') {
                    //filter by categories
                    if (intval($cat) > 0) {
                        $tax[] = array(
                            'taxonomy' => 'appcate',
                            'field' => 'id',
                            'terms' => $cat,
                        );
                    }
                } else if ($platform == 'android') {
                    //filter by categories
                    if (intval($cat) > 0) {
                        $tax[] = array(
                            'taxonomy' => 'appandroid',
                            'field' => 'id',
                            'terms' => $cat,
                        );
                    }
                }

            }
            if (isset($keyword)) {
                $query['s'] = $keyword;
            }

            if (intval($cat) > 0) {
                $query['cat'] = $cat;
                /* $tax[] = array(
                     'taxonomy' => 'category',
                     'field' => 'id',
                     'terms' => $cat,
                 );*/
            }
            if (intval($country) > 0) {
                $tax[] = array(
                    'taxonomy' => 'country',
                    'field' => 'id',
                    'terms' => $country,
                );
            }

            //implementing the code
            if (count($meta_query) > 0) {
                $meta_query[] = array('relation' => 'AND');
                $query['meta_query'] = $meta_query;
            }
            if (count($cat) > 0) {
                $tax[] = array('relation' => 'AND');
                $query['tax_query'] = $tax;
            }
            if (isset($paging)) {
                $query['paged'] = $paging;
            }
            $this->doQuery(wp_parse_args($query, $this->config));
        }

        protected function inDaLoop($id, $args = array())
        {
            /*   if ($this->byLng) {
                 $post_language_information = wpml_get_language_information($id);
             } else {
                 $post_language_information = "";
             }*/
            $comment = new AppComment("getlist");
            $redeem_count = new Redemption();
            $post_language_information = wpml_get_language_information($id);
            unset($post_language_information['text_direction']);
            unset($post_language_information['different_language']);
            if (get_post_type($id) == APPDISPLAY) {
                return array(
                    "ID" => $id,
                    "link" => get_permalink(),
                    "icon" => get_post_meta($id, '_icon', true),
                    "storeid" => get_post_meta($id, '_storeid', true),
                    "description" => get_post_meta($id, '_description', true),
                    "platform" => get_post_meta($id, '_platform', true),
                    "developer" => intval(get_post_meta($id, '_developer', true)),
                    "appname" => get_post_meta($id, '_appname', true),
                    "lang" => $post_language_information,
                    "type" => "application"


                );
            } else if (get_post_type($id) == VPRODUCT) {
                $vendor_id = intval(get_post_meta($id, "innvendorid", true));
                return array(
                    "ID" => $id,
                    "link" => get_permalink(),
                    "image_sq_thumb" => $this->display_images("inno_image_thumb", $id),
                    "video_image_cover" => $this->display_images("inno_video_cover_image", $id),
                    "title" => get_the_title($id),
                    "vcoin" => intval(get_post_meta($id, "v_coin", true)),
                    "lang" => $post_language_information,
                    "type" => "tangible",
                    //==================================================//
                    "comment_count" => $comment->get_comment_count($id),
                    "redeem_count" => $redeem_count->get_redemption_count(intval(get_post_meta($id, "stock_id", true))),
                    "share_count" =>intval(get_post_meta($id, "share_count", true)),
                    "vendor" => array(
                        "ID" => $vendor_id,
                        "title" => get_the_title($vendor_id)
                    ),
                    "category" => $this->get_terms("category", $id)

                );
            } else if (get_post_type($id) == VCOUPON) {
                return array(
                    "ID" => $id,
                    "link" => get_permalink(),
                    "image_sq_thumb" => $this->display_images("inno_image_thumb", $id),
                    "video_image_cover" => $this->display_images("inno_video_cover_image", $id),
                    "title" => get_the_title($id),
                    "vcoin" => intval(get_post_meta($id, "v_coin", true)),
                    "lang" => $post_language_information,
                    "type" => "intangible",
                    "comment_count" => $comment->get_comment_count($id),
                    "share_count" =>intval(get_post_meta($id, "share_count", true)),
                );
            } else {
                return array();
            }
        }
    }
}