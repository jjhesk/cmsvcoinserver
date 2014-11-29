<?php
/**
 * Created by HKM Corporation.
 * User: Hesk
 * Date: 14年8月14日
 * Time: 下午12:11
 */
if (!class_exists('RCoupon')) {
    class RCoupon extends listBase
    {
        private $config =
            array(
                'post_type' => VCOUPON,
                'post_status' => 'publish',
                'posts_per_page' => -1,
            );
        private $result = array();

        public function __construct($arr)
        {
            $this->result = array();
            $this->doQuery(wp_parse_args($arr, $this->config));
        }

        protected function inDaLoop($post_id, $args = array())
        {
            return array(
                "ID" => intval($post_id),
                "link" => get_permalink(),
                "image_sq_thumb" => self::display_images("inno_image_thumb", $post_id),
                "video_image_cover" => self::display_images("inno_video_cover_image", $post_id),
                "title" => get_the_title($post_id),
                "vcoin" => intval(get_post_meta($post_id, "v_coin", true))
            );
        }

        /*  public static function inloop($post_id)
          {
              $vid = intval(get_post_meta($post_id, "innvendorid", true));
              return array(
                  "ID" => intval($post_id),
                  "link" => get_permalink(),
                  "image_sq_thumb" => parent::display_images("inno_image_thumb", $post_id),
                  "video_image_cover" => parent::display_images("inno_video_cover_image", $post_id),
                  "title" => get_the_title($post_id),
                  "vcoin" => intval(get_post_meta($post_id, "v_coin", true)),
                  "vendor_id" => $vid,
                  "vendor_name" => get_the_title($vid),
                  "vendor_url" => get_post_meta($vid, "vend_url", true),
                  "description" => get_post_meta($post_id, "inn_gift_description", true),
                  "exp_date" => get_post_meta($post_id, "inn_exp_date", true),
                  "country_terms" => parent::get_terms("country", $post_id),
                  "category_terms" => parent::get_terms("category", $post_id),
                  "game_type" => get_post_meta($post_id, "game_type", true)
              );
          }*/

        public static function get_display_images($key, $post_id)
        {
            $list = get_post_meta($post_id, $key, false);
            if (count($list) > 0) {
                $attachment = wp_get_attachment_image_src((int)$list[0], 'original');
                return $attachment[0];
            } else
                return "";
        }
        /*
                public static function inloop2($post_id, $platform)
                {

                }*/
    }
}