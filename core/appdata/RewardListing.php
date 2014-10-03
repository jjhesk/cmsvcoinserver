<?php
/**
 * Created by PhpStorm.
 * User: Hesk
 * Date: 14年8月14日
 * Time: 上午11:00
 */
if (!class_exists('RewardListing')) {
    class RewardListing extends listBase
    {
        private $config = array();
        private $result = array();
        private $query = array();

        public function __construct($input)
        {


            if (ICL_LANGUAGE_CODE == 'it') {
                $taxonomy = "tipologia_prodotto";
            } elseif (ICL_LANGUAGE_CODE == 'en') {
                $taxonomy = "TAXONOMY-ENGLISH";
            } else {
                $taxonomy = "TAXONOMY-DEFAULT";
            }
            $this->config = array(
                // 'suppress_filters' => true,
                'language' => 'en',
                //  'posts_per_page' => -1,
                "post_type" => VPRODUCT,
                "posts_per_page" => -1,
                'post_status' => 'publish',
                'orderby' => 'date',
            );

            if (isset($input['country'])) {
                $term = get_term_by('id', intval($input['country']), 'country', OBJECT);
                $this->query = $term;
                $this->config['tax_query'] = array(
                    array(
                        'taxonomy' => 'country',
                        'field' => 'slug',
                        'terms' => array($term->slug),
                    ),
                    'orderby' => 'title',
                );

                unset($input['country']);
            }
            if (isset($input['cat'])) {


            }
            $this->doQuery(wp_parse_args($input, $this->config));
        }

        protected function inDaLoop($post_id, $args = array())
        {
            return array(
                "ID" => $post_id,
                "link" => get_permalink(),
                "image_sq_thumb" => $this->display_images("inno_image_thumb", $post_id),
                "video_image_cover" => $this->display_images("inno_video_cover_image", $post_id),
                "title" => get_the_title($post_id),
                "vcoin" => intval(get_post_meta($post_id, "v_coin", true))
            );
        }
/*
        private static function display_images($key, $id)
        {

        }*/

        /**
         * use for public query
         * @param $post_id
         * @return array
         */

        public static function inloop($post_id)
        {
            return array(
                "ID" => $post_id,
                "link" => get_permalink(),
                "image_sq_thumb" => self::display_images("inno_image_thumb", $post_id),
                "video_image_cover" => self::display_images("inno_video_cover_image", $post_id),
                "title" => get_the_title($post_id),
                "vcoin" => intval(get_post_meta($post_id, "v_coin", true))
            );
        }

    }
}