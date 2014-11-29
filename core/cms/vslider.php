<?php
/**
 * Created by HKM Corporation.
 * User: Hesk
 * Date: 14年8月14日
 * Time: 下午6:36
 */
defined('ABSPATH') || exit;
if (!class_exists('vslider')) {

    class vslider extends cmsBase
    {
        public function __construct()
        {
            parent::__construct();
            register_post_type(VSLIDER, array(
                'labels' => $this->add_tab(),
                'public' => false,
                'exclude_from_search' => true,
                'publicly_queryable' => false,
                'show_ui' => true,
                'query_var' => true,
                'menu_icon' => VCOIN_IMAGES_PATH . 'system_log_icon.png',
                'rewrite' => false,
                'capability_type' => 'post',
                'hierarchical' => false,
                'menu_position' => 19,
                'supports' => array('title', 'thumbnail'),
                // 'register_meta_box_cb' => 'znn_add_meta'
            ));
            /**
             * this is contributing to the file: api_sliders.php
             * search for the name for the do_action call
             */
            add_action('do_api_sliders_json', array(__CLASS__, 'jslider'));
            add_action('do_meta_boxes', array(__CLASS__, 'znn_slider_image_box'));
            add_filter('rwmb_meta_boxes', array($this, 'addRWMetabox'), 19, 1);
            add_action('rwmb_slider_basic_setup_box_after_save_post', array(__CLASS__, "savebox"), 10, 1);
            register_taxonomy_for_object_type('category', VSLIDER);
            $this->panel_metabox = new adminsupport(VSLIDER);
            $this->panel_metabox->add_script_name('both', 'admin_slider');
            $this->addAdminSupportMetabox();
            add_filter('manage_edit-' . VSLIDER . '_columns', array(__CLASS__, "add_new_columns"), 10, 1);
            add_action('manage_' . VSLIDER . '_posts_custom_column', array(__CLASS__, "manage_column"), 10, 2);
        }

        public function __destruct()
        {
            $this->panel_metabox = NULL;
        }

        public static function savebox($post_id)
        {
            try {
                if (!isset($_POST['payment'])) return;
                if (!isset($_POST['platform'])) return;
                if (!isset($_POST['time_to_next'])) return;
                if (!isset($_POST['slider_setup_status'])) return;
                $status = (int)$_POST['slider_setup_status'];
                if ($status === 1) {
                    self::withUpdateFieldN($post_id, 'slider_setup_status', 2);
                } else if ($status === 3) {
                    self::withUpdateFieldN($post_id, 'slider_setup_status', 4);
                } else if ($status === 5) {
                    self::withUpdateFieldN($post_id, 'slider_setup_status', 6);
                }
            } catch (Exception $e) {
                global $current_user;
                inno_log_db::log_admin_stock_management($current_user->ID, $e->getCode(), $e->getMessage());
            }
        }

        public static function znn_slider_image_box()
        {
            remove_meta_box('postimagediv', 'slider', 'side');
            add_meta_box('postimagediv', __('Slide Image', 'zenon'), 'post_thumbnail_meta_box', 'slider', 'normal', 'high');
        }

        public static function getSliderList($term = '_app_slider')
        {
            $ar = array(
                'post_type' => VSLIDER,
                'posts_per_page' => -1,
                'post_status' => 'publish',
                //      'taxonomy' => 'slidercate'
                'tax_query' => array(
                    array(
                        'taxonomy' => 'slidercate',
                        'field' => 'slug',
                        'terms' => $term,
                    ),
                ),
            );
            $query = new WP_Query($ar);
            if ($query->have_posts()) :
                $data = array();
                while ($query->have_posts()) : $query->the_post();
                    $postid = $query->post->ID;
                    //get_the_ID();
                    $l = wp_get_attachment_image_src(get_post_thumbnail_id($postid), 'large');
                    $i = intval(get_post_meta($postid, "time_to_next", true));
                    $data[] = array(
                        // "title" => get_the_title($postid),
                        "title" => "",
                        "order" => get_the_title($postid),
                        "thumb" => $l[0],
                        "id" => $postid,
                        "time_to_next" => $i
                    );
                endwhile;
                return $data;
            else :
                return false;
            endif;
            wp_reset_postdata();
        }

        public static function jslider()
        {
            $data = self::getSliderList();
            if ($data):
                api_handler::outputJson(array(
                    "result" => "success",
                    "data" => $data,
                    "code" => 1
                ));
            else :
                //   api_account::loginfail(400, "there are no sliders found");
            endif;
        }

        protected function add_tab()
        {
            return array(
                'name' => __('Slider - The sliders on the home page', HKM_LANGUAGE_PACK),
                'singular_name' => __('Slider Item', HKM_LANGUAGE_PACK),
                'add_new' => __('Add New', HKM_LANGUAGE_PACK),
                'add_new_item' => __('Add New Slide', HKM_LANGUAGE_PACK),
                'edit_item' => __('Edit Slides', HKM_LANGUAGE_PACK),
                'new_item' => __('New Slider', HKM_LANGUAGE_PACK),
                'view_item' => __('View Sliders', HKM_LANGUAGE_PACK),
                'search_items' => __('Search Sliders', HKM_LANGUAGE_PACK),
                'menu_icon' => VCOIN_IMAGES_PATH . 'system_log_icon.png',
                'not_found' => __('Nothing found', HKM_LANGUAGE_PACK),
                'not_found_in_trash' => __('Nothing found in Trash', HKM_LANGUAGE_PACK),
                'parent_item_colon' => '',
                'menu_name' => __('Slider', HKM_LANGUAGE_PACK)
            );

            //   add_meta_box("znn_credits_meta", "Link", "znn_credits_meta", VSLIDER, "normal", "low");

        }

        private static function get_selection_list($select)
        {
            switch ($select) {
                case "coupons":
                    $post_type = VCOUPON;
                    break;
                case "rewards":
                    $post_type = VPRODUCT;
                    break;
                case "ios":
                    $post_type = APPDISPLAY;
                    break;
                case "android":
                    $post_type = APPDISPLAY;
                    break;
            }

            $set = array(
                'post_type' => $post_type,
                'posts_per_page' => -1,
                'post_status' => 'publish');


            $optionpost = null;
            $optionpost[-1] = "[ empty field here ]";


            if ($select == 'ios') {
                $set[] = array('meta_query' => array('_platform' => 'ios'));
            } else if ($select == 'android') {
                $set[] = array('meta_query' => array('_platform' => 'android'));
            }
            if (isset($_REQUEST["lang"])) {
                $set['suppress_filters'] = false;
            }

            $items = get_posts($set);


            foreach ($items as $item) {
                $optionpost[$item->ID] = $item->ID . " - " . $item->post_title;
            }
            unset($items);
            unset($select);
            unset($set);
            unset($post_type);
            return $optionpost;
        }

        private static function  getcountry($tax)
        {
            return array(
                'name' => 'Country', // TAXONOMY
                'id' => '_save_country', // ID for this field
                'type' => 'taxonomy', //options
                'options' => array(
                    'taxonomy' => $tax,
                    'type' => 'checkbox_list',
                    'args' => array()
                )
            );
        }

        private static function  getcate($tax)
        {
            return array(
                'name' => 'Categories', // TAXONOMY
                'id' => '_save_categories', // ID for this field
                'type' => 'taxonomy', //options
                'options' => array(
                    'taxonomy' => $tax,
                    'type' => 'checkbox_list',
                    'args' => array()
                )
            );
        }

        private static function get_conditional_fields($select)
        {
            if ($select == 'rewards') {
                return array(
                    array(
                        'name' => 'Reward', // TAXONOMY
                        'id' => 'point_to', // ID for this field
                        'type' => 'select', //options
                        'options' => self::get_selection_list($select),
                    )
                );
            } else if ($select == 'coupons') {
                return array(
                    array(
                        'name' => 'Coupons', // TAXONOMY
                        'id' => 'point_to', // ID for this field
                        'type' => 'select', //options
                        'options' => self::get_selection_list($select),
                    )
                );
            } else if ($select == 'android') {
                return array(
                    array(
                        'name' => 'Android Apps', // TAXONOMY
                        'id' => 'point_to', // ID for this field
                        'type' => 'select', //options
                        'options' => self::get_selection_list($select),
                    )
                );
            } else if ($select == 'ios') {
                return array(
                    array(
                        'name' => 'iOS App', // TAXONOMY
                        'id' => 'point_to', // ID for this field
                        'type' => 'select', //options
                        'options' => self::get_selection_list($select),
                    )
                );
            } else return array(
                array(
                    'id' => 'point_to', // ID for this field
                    'type' => 'hidden', //options
                ),
            );

        }

        public function addRWMetabox($meta_boxes)
        {
            $step1 = array(
                array(
                    'name' => 'Payment', // TAXONOMY
                    'id' => 'payment', // ID for this field
                    'type' => 'number', //options
                ),
                array(
                    'name' => 'Platform',
                    'id' => 'platform',
                    'type' => 'select', //options
                    'options' => array(
                        'na' => 'make a choice',
                        'ios' => 'iOS',
                        'android' => 'Android',
                        'rewards' => 'Rewards',
                        'coupons' => 'Coupons',
                    ),
                    'desc' => 'After this has changed, update the entry first then continue'
                ),
                array(
                    'name' => 'time to the next slide in ms',
                    'id' => 'time_to_next',
                    'type' => 'number'
                ),
                array(
                    'name' => 'Setup status',
                    'id' => 'slider_setup_status',
                    'type' => $this->debug_field_type(),
                    'std' => 0
                )
            );

            if (isset($_GET['post'])) {
                $post_id = $_GET['post'];
                $platform_setting = get_post_meta($post_id, 'platform', true);
                $step2 = self::get_conditional_fields($platform_setting);
                $isRewardCoupon = $platform_setting == 'rewards' || $platform_setting == 'coupons';
            } else {
                $platform_setting = "";
                $step2 = self::get_conditional_fields('');
                $isRewardCoupon = false;
            }
            $meta_boxes[] = array(
                'pages' => array(VSLIDER),
                //This is the id applied to the meta box
                'id' => 'slider_basic_setup_box',
                //This is the title that appears on the meta box container
                'title' => __('Basic Setup', HKM_LANGUAGE_PACK),
                //This defines the part of the page where the edit screen section should be shown
                'context' => 'normal',
                //This sets the priority within the context where the boxes should show
                'priority' => 'high',
                //Here we define all the fields we want in the meta box
                'fields' => array_merge($step1, $step2)
            );
            unset($step1);
            if (isset($_GET['post'])) {
                $post_id = (int)$_GET['post'];
                if ($isRewardCoupon) {
                    $list_country = wp_get_post_terms($post_id, 'country');
                    $list_cate = wp_get_post_categories($post_id);
                } else if ($platform_setting == 'ios') {
                    $list_country = wp_get_post_terms($post_id, 'countryios_nd');
                    $list_cate_custom = wp_get_post_terms($post_id, 'appcate');
                } else if ($platform_setting == 'android') {
                    $list_country = wp_get_post_terms($post_id, 'countryandroid');
                    $list_cate_custom = wp_get_post_terms($post_id, 'appandroid');
                } else {
                    $list_country = array();
                    $list_cate_custom = array();
                }
                if (count($list_country) > 0) {
                    //    inno_log_db::log_admin_stock_management(-1, 110100, $isRewardCoupon ? 1 : 0);
                    $cat = $isRewardCoupon ? $list_cate : $list_cate_custom;
                    $meta_boxes[] = array(
                        'pages' => array(VSLIDER),
                        //This is the id applied to the meta box
                        'id' => 'slid_list_box',
                        //This is the title that appears on the meta box container
                        'title' => __('Slider Collection', HKM_LANGUAGE_PACK),
                        //This defines the part of the page where the edit screen section should be shown
                        'context' => 'normal',
                        //This sets the priority within the context where the boxes should show
                        'priority' => 'high',
                        //Here we define all the fields we want in the meta box
                        'fields' => self::field_generation($list_country, $cat, __("Slider - ", HKM_LANGUAGE_PACK), $isRewardCoupon)
                    );
                }

                //    unset($list_country);
                //    unset($list_cate);
                unset($post_id);
            }
            return $meta_boxes;
        }

        private static function field_generation($list_country, $cate_list, $prefix, $cate_real = false)
        {
            $slider_box = array();
            foreach ($list_country as $c1) {
                foreach ($cate_list as $c21) {
                    if ($cate_real) {
                        $c2 = get_category($c21);
                    } else {
                        $c2 = $c21;
                    }
                    $slider_box[] = array(
                        'name' => $prefix . "(" . $c1->term_id . "." . $c2->term_id . ") ",
                        'desc' => '<strong style="color:red">Dimensions: 640 × 185px.</strong> Placement for ' . $c1->name . " : " . $c2->name,
                        'id' => 's_list_' . $c1->term_id . "_" . $c2->term_id,
                        'type' => 'image_advanced',
                        'max_file_uploads' => 5,
                    );
                }
            }

            //unset($list_country);
            unset($prefix);
            //unset($cate_list);
            return $slider_box;
        }

        protected function isDebug()
        {
            return $this->titan->getOption("debug_slider_cfg");
        }

        protected function addAdminSupportMetabox()
        {
            //   if(isset($_POST["post_id"]))
            /*
                wp_enqueue_media();
                wp_enqueue_script( 'rwmb-image-advanced', RWMB_JS_URL . 'image-advanced.js', array( 'jquery', 'underscore' ), RWMB_VER, true );
                wp_localize_script( 'rwmb-image-advanced', 'rwmbImageAdvanced', array(
                    'frameTitle' => __( 'Select Images', 'rwmb' ),
                ) );
                */
            //
            // $this->panel_metabox
        }

        /**
         * not implemented yet
         * @return array
         */
        public static function preset_sliders()
        {
            $n = get_option('dp_reward_channel_options');
            $items = intval($n) ? $n : 0;
            $custom_field_for_attachment_id = 'inno_image_slider';
            $content = array();
            if (!empty($items) && is_array($items)) {
                foreach ($items as $number => $item) {
                    $item = array_filter($item);
                    if (!empty($item)) {
                        $id = intval($item['id']);
                        $phi = get_post_meta($id, $custom_field_for_attachment_id, TRUE);
                        $specific_src = wp_get_attachment_image_src($phi, "full");
                        if (!$specific_src) {
                            $specific_src = wp_get_attachment_image_src(get_post_thumbnail_id($id), "full");
                        }
                        $specific_thumb = wp_get_attachment_image_src($phi, "thumbnail");
                        if (!$specific_thumb) {
                            $specific_thumb = wp_get_attachment_image_src(get_post_thumbnail_id($id), "thumbnail");
                        }
                        $content[] = array(
                            'caption' => get_the_title($id),
                            'thumb' => $specific_thumb[0],
                            'src' => $specific_src[0],
                            'id' => $id,
                            "time_to_next" => intval(get_option('home_app_slider_milliseconds'))
                        );
                    }
                }
            }
            return $content;
        }

        public static function manage_column($column_name, $id)
        {
            global $wpdb;
            switch ($column_name) {
                case 'type':
                    echo get_post_meta($id, "platform", true);
                    break;
                case 'id':
                    echo $id;
                    break;

                default:
                    break;
            } // end switch
        }

        public static function add_new_columns($new_columns)
        {
            $new_columns['cb'] = '<input type="checkbox" />';
            $new_columns['id'] = __('ID');
            $new_columns['title'] = _x('Slide', 'column name');
            $new_columns['type'] = __('Post Type');
            // $new_columns['author'] = __('Author');
            // $new_columns['categories'] = __('Categories');
            // $new_columns['tags'] = __('Tags');
            // $new_columns['date'] = _x('Date', 'column name');
            unset($new_columns['author']);
            unset($new_columns['date']);
            return $new_columns;
        }


    }
}