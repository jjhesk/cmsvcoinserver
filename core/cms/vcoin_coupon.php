<?php
/**
 * Created by PhpStorm.
 * User: Hesk
 * Date: 14年8月12日
 * Time: 下午3:41
 */
defined('ABSPATH') || exit;
if (!class_exists('vcoin_coupon')) {
    class vcoin_coupon extends cmsBase
    {
        private $vcoin_panel_support;
        private $sub_tab_comment;

        public function __construct()
        {
            register_post_type(VCOUPON, array(
                'labels' => $this->add_tab(),
                'description' => __('Manage the ablums in the backend.'),
                'public' => true,
                'publicly_queryable' => true,
                'show_ui' => true,
                'show_in_menu' => true,
                'query_var' => false,
                // 'rewrite' => array('slug' => 'gift', 'with_front' => false),
                'capability_type' => 'post',
                'has_archive' => true,
                'hierarchical' => false,
                'menu_position' => 6,
                'supports' => array('title', 'author'),
                'menu_icon' => VCOIN_IMAGES_PATH . 'system_log_icon.png',
                'hierarchical' => false,
            ));

            add_filter('rwmb_meta_boxes', array(__CLASS__, 'addRWMetabox'), 10, 1);

            $this->vcoin_panel_support = new adminsupport(VCOUPON);
            $this->vcoin_panel_support->add_title_input_place_holder(__("Enter COUPON ID/TITLE", HKM_LANGUAGE_PACK));
            $this->vcoin_panel_support->change_publish_button_label(__("Create/Update Coupon Ad", HKM_LANGUAGE_PACK));
            $this->vcoin_panel_support->add_script_name('both', 'admin_coupon');
            $this->vcoin_panel_support->add_style('cms_report_panel_css');

            /**
             * add submenu "comment"
             */
            $this->sub_tab_comment = new adminposttab(VCOUPON,
                array('localize' => array(
                    "setting_ob",
                    array(
                        "post_type" => VCOUPON,
                        "comment_table_id" => "admin_page_coupon_comment_table",
                    )
                ),
                    'menu_title' => 'comment',
                    'cap' => 'administrator',
                    'menu_slug' => 'coupon_submenu_comment',
                    'template_name' => 'admin_page_coupon_comment_table',
                    'script_id' => 'page_admin_comment_table',
                    'style_id' => array('adminsupportcss', 'datatable', 'dashicons'),
                ));


            $this->addAdminSupportMetabox();
            register_taxonomy_for_object_type('category', VCOUPON);
            add_action('rwmb_post_inno_coupon_after_save_post', array(__CLASS__, "savebox"), 10, 1);
            add_action('rwmb_post_add_coupons_before_save_post', array(__CLASS__, "save_post_add_coupons"), 10, 1);
        }

        public static function add_reward_support()
        {

        }

        public static function savebox($post_id)
        {
            global $current_user;
            try {
                if (!isset($_POST['coupon_configuration_complete'])) return;
                $status = $_POST['coupon_configuration_complete'];

                if (intval($status) == 0) {
                    self::withUpdateFieldN($post_id, 'coupon_configuration_complete', 1);
                }
            } catch (Exception $e) {
                //inno_log_db::log_admin_stock_management($current_user->ID, $e->getCode(), $e->getMessage());
            }
        }

        public static function save_post_add_coupons($post_id)
        {
            global $current_user;
            try {
                $code_x = $_POST["codezx"];
                if ($code_x == "") {
                    inno_log_db::log_admin_coupon_management($current_user->ID, 1214, "No redemption code is added");
                    return;
                }
                unset($_POST["codezx"]);
                self::update_coupon_codex($post_id, $code_x);
            } catch (Exception $e) {
                inno_log_db::log_admin_coupon_management($current_user->ID, $e->getCode(), $e->getMessage());
            }
        }

        protected function add_tab()
        {
            // this is the demo post type plese open a new one
            $labels = array(
                'name' => _x('Coupon', 'post type general name'),
                'singular_name' => _x('優惠券', 'post type singular name'),
                'add_new' => _x('追加優惠券產品', HKM_LANGUAGE_PACK),
                'add_new_item' => __('追加優惠券產品', HKM_LANGUAGE_PACK),
                'edit_item' => __('修改優惠券產品', HKM_LANGUAGE_PACK),
                'new_item' => __('追加優惠券產品', HKM_LANGUAGE_PACK),
                'all_items' => __('所有優惠券', HKM_LANGUAGE_PACK),
                'view_item' => __('看覽優惠券產品', HKM_LANGUAGE_PACK),
                'search_items' => __('搜查優惠券產品', HKM_LANGUAGE_PACK),
                'not_found' => __('沒有發現產品', HKM_LANGUAGE_PACK),
                'not_found_in_trash' => __('在垃圾中沒有發現產品', HKM_LANGUAGE_PACK),
                'parent_item_colon' => '',
                'menu_name' => __('優惠券', HKM_LANGUAGE_PACK)
            );
            return $labels;
        }


        public static function addRWMetabox($meta_boxes)
        {

            $meta_boxes[] = array(
                'pages' => array(VCOUPON),
                //This is the id applied to the meta box
                'id' => 'post_inno_coupon',
                //This is the title that appears on the meta box container
                'title' => __('Coupon Setting', HKM_LANGUAGE_PACK),
                //This defines the part of the page where the edit screen section should be shown
                'context' => 'normal',
                //This sets the priority within the context where the boxes should show
                'priority' => 'high',
                //Here we define all the fields we want in the meta box
                'fields' => array(
                    array('name' => __('Offer Expiry Date(*)', HKM_LANGUAGE_PACK),
// TAXONOMY
                        'id' => "inn_exp_date",
// ID for this field
                        'type' => 'date',
//options
                        'desc' => 'The time of expiration',
                    ),
                    array(
                        'name' => __('Redeem days (*)', HKM_LANGUAGE_PACK),
                        'id' => "rdays",
                        'type' => 'slider',
// Text labels displayed before and after value
                        'prefix' => __('', 'rwmb'),
                        'suffix' => __(' Days', 'rwmb'),
// jQuery UI slider options. See here http://api.jqueryui.com/slider/
                        'js_options' => array(
                            'min' => 1,
                            'max' => 90,
                            'step' => 1,
                        ),
                        'std' => 30,
                        'desc' => 'The length of days for redemption from the time of customer redemption.',
                    ),

//start fields
                    array('type' => 'divider'),
                    array(
                        'name' => __('PRODUCT VIDEO URL(*)', HKM_LANGUAGE_PACK),
                        'id' => "coupon_video_url",
// ID for this field
                        'type' => 'text',
                        'desc' => 'Enter a full URL path with the file format *.mp4 H.264 AVC android support format',
                    ),
                    array('type' => 'divider'),
                    array(
                        'name' => __('V Coin VAL(*)', HKM_LANGUAGE_PACK),
                        'id' => "v_coin",
                        'type' => 'number',
                        'desc' => 'The cost of v coin for sale, the cost of redemption in v-coin',
                    ),
                    array('type' => 'divider'),
                    array(
                        'name' => __('Vendor Selection', HKM_LANGUAGE_PACK), // TAXONOMY
                        'id' => "innvendorid", // ID for this field
                        'type' => 'select', //options
                        'options' => VendorRequest::get_wp_vendor_list(),
                    ),
                    /*
                    array(
                        'name' => 'Vendor Name',
                        'id' => "vend_name",
                        'type' => 'hidden',
                    ),
                    array(
                        'name' => 'Vendor JSON',
                        'id' => "innvendorobject",
                        'type' => 'hidden',
            
                    ),*/
                    array(
                        'name' => __('Coupon Type (*)', HKM_LANGUAGE_PACK),
                        'id' => 'coupon_type',
                        'type' => 'select',
                        'options' => array(
                            "na" => __("Must select this type", HKM_LANGUAGE_PACK),
                            "repeat" => __("Repeatable coupon", HKM_LANGUAGE_PACK),
                            "unique" => __("Unique / count off", HKM_LANGUAGE_PACK),
                            "api" => __("API level", HKM_LANGUAGE_PACK),
                        ),
                        "desc" => "
<strong> Repeatable:</strong> Repeatable image to show the front and the back face of coupon on redemption process
<br><strong> Unique:</strong> Each redemption coupon is unique and they are handled by our system service for each coupon redeem transaction. Each redemption will count off or mark down the count amount of the coupon on hand
<br><strong>API level:</strong> Highly secured API transaction level to notify the third party system when our redemption process is successfully completed"
                    ),
                    array(
                        'name' => __('Coupon redemption URL(*)', HKM_LANGUAGE_PACK),
                        'id' => "coupon_url",
// ID for this field
                        'type' => 'text',
                        'desc' => 'You can go to that system to use this code',
                    ),
                    array('type' => 'divider'),
                    array(
                        'id' => 'inno_terms_conditions',
                        'name' => __('Additional T&C', HKM_LANGUAGE_PACK),
                        'desc' => 'Please provide the additional terms and conditions for the client or business logic which is not originally planned from the InnoActor system. This part of the text will be reveal on customer\'s email template',
                        'type' => 'wysiwyg',
                        'std' => "",
                        'cols' => '40',
                        'rows' => '4',
                        'raw' => true, 'options' => array('media_buttons' => false)
                    ),

                    array(
                        'name' => __('Coupon details', HKM_LANGUAGE_PACK),
                        'id' => "inn_gift_description",
                        'type' => 'wysiwyg',
                        'desc' => 'Shows information about the discount and etc.',
                        'std' => "",
                        'cols' => '40',
                        'rows' => '4',
                        'raw' => true,
                        'options' => array('wpautop' => false, 'media_buttons' => false)
                    ),
                    array('type' => 'divider'),
                    array(
                        'name' => __('Redemption Lock', HKM_LANGUAGE_PACK),
                        'id' => "release_redemption",
                        'type' => 'checkbox',
                        'desc' => 'Check this when this product is not ready for redemption. The unchecked box will allow user to play video and do redemption process.',
                    ),
                    array(
                        'name' => 'Coupon config complete',
                        'id' => "coupon_configuration_complete",
                        'type' => 'hidden',
                        'std' => '0',
                    ),
                ));
            $meta_boxes[] = array(
                'pages' => array(VCOUPON),
                //This is the id applied to the meta box
                'id' => 'post_gift_coupon_images',
                //This is the title that appears on the meta box container
                'title' => __('Product Images', HKM_LANGUAGE_PACK),
                //This defines the part of the page where the edit screen section should be shown
                'context' => 'normal',
                //This sets the priority within the context where the boxes should show
                'priority' => 'high',
                //Here we define all the fields we want in the meta box
                'fields' => array(

                    array(
                        'name' => __('Slider', HKM_LANGUAGE_PACK),
                        'desc' => 'Moving slider on the reward channel /<strong style="color:red">Dimensions: 640 × 375px.</strong>',
                        'id' => 'inno_image_slider',
                        'type' => 'image_advanced',
                        'max_file_uploads' => 1,
                    ),
                    array(
                        'name' => __('Small Thumb', HKM_LANGUAGE_PACK),
                        'desc' => 'Product image on the redemption page /<strong style="color:red">Dimensions: 260 × 260px </strong>',
                        'id' => 'inno_image_thumb',
                        // 'type' => 'plupload_image',
                        'max_file_uploads' => 1,
                        'type' => 'image_advanced',


                        /*
                                    'type' => 'image_select',
                                    'options' => array(
                                        'left' => 'http://placehold.it/90x90&text=Left',
                                        'right' => 'http://placehold.it/90x90&text=Right',
                                        'none' => 'http://placehold.it/90x90&text=None',
                                    ),*/

                    ),
                    array(
                        'name' => __('Banner Button', HKM_LANGUAGE_PACK),
                        'desc' => 'Big button for the product /<strong style="color:red">Dimensions: 640 × 185px.</strong>',
                        'id' => 'inno_image_banner',
                        'type' => 'image_advanced',
                        'max_file_uploads' => 1,
                    ),


                    array(
                        'name' => __('Back Face', HKM_LANGUAGE_PACK),
                        'desc' => 'With the proper format',
                        'id' => 'inno_coupon_back',
                        'type' => 'image_advanced',
                        'max_file_uploads' => 1,
                    ),

                    array(
                        'name' => __('Video Cover Image', HKM_LANGUAGE_PACK),
                        'desc' => 'The image to cover the unplay video until the user touches it. <strong style="color:red">Dimensions: 640 × 375px.</strong>',
                        'id' => 'inno_video_cover_image',
                        'type' => 'image_advanced',
                        'max_file_uploads' => 1,
                    ),
                ));

            $meta_boxes[] = array(
                'pages' => array(VCOUPON),
                //This is the id applied to the meta box
                'id' => 'post_add_coupons',
                //This is the title that appears on the meta box container
                'title' => __('Add coupons', HKM_LANGUAGE_PACK),
                //This defines the part of the page where the edit screen section should be shown
                'context' => 'normal',
                //This sets the priority within the context where the boxes should show
                'priority' => 'high',
                //Here we define all the fields we want in the meta box
                'fields' => array(

                    array(
                        'name' => __('Redemption Codes Input Bank', HKM_LANGUAGE_PACK),
                        'desc' => '(required) (copy and paste the code from the cvs file in here) the format should be using single space to separate all the coupon codes',
                        'id' => 'codezx',
                        'type' => 'textarea',
                    ),
                ));

            return $meta_boxes;
        }


        /**
         * adding each unique coupon once into the database
         * @param $codex
         * @param $coupon_id
         * @return bool
         */
        private static function add_new_coupon($codex, $coupon_id)
        {
            global $wpdb;
            $table = $wpdb->prefix . "post_coupon_claim";
            $template_prepared = "SELECT * FROM $table WHERE client_redeem_code=%s AND coupon_id=%d";
            $_new_coupon = array(
                'client_redeem_code' => $codex,
                'coupon_id' => $coupon_id
            );
            $prepared = $wpdb->prepare($template_prepared, $codex, $coupon_id);

            $found = $wpdb->get_row($prepared);
            if (!$found) {
                $wpdb->insert($table, $_new_coupon,
                    array(
                        '%s',
                        '%d'
                    ));
                return $wpdb->insert_id;
            } else {
                inno_log_db::log_coupons(-1, 773923, "failure to add coupon on with code:" . $codex . " for coupon id:" . $coupon_id);
                return false;
            }
        }

        /**
         * jax add coupons data submission form the POST url inquiry
         */
        private static function update_coupon_codex($post_id, $code_x)
        {
            global $current_user;
            $added = 0;

            $code_x_serial = explode(" ", $code_x);
            foreach ($code_x_serial as $code) {
                if (self::add_new_coupon($code, $post_id)) {
                    $added++;
                }
            }

            if ($added > 0) {
                $msg = 'Total redemption code of ' . $added . ' have added to the coupon system. - Coupon ID : ' . $post_id;
                inno_log_db::log_admin_coupon_management($current_user->ID, 1213, $msg);
            }
            return true;
        }

        protected function addAdminSupportMetabox()
        {
            $this->vcoin_panel_support->add_script_name('both', 'admin_coupon');
            $this->vcoin_panel_support->add_style('cms_rewards');
            $this->vcoin_panel_support->add_metabox(
                "coupon_redemption_analysis",
                __("Coupon Redemption Analysis", HKM_LANGUAGE_PACK),
                get_oc_template('admin_coupon_analysis'));
        }
    }
}