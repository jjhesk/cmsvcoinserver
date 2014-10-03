<?php

/**
 * Created by PhpStorm.
 * User: Hesk
 * Date: 14年8月11日
 * Time: 下午4:59
 *
 * require: adminsupport, ui_handler, mustache_engine
 *
 */

defined('ABSPATH') || exit;
if (!class_exists('vcoin_product')) {
    class vcoin_product extends cmsBase
    {
        private $vcoin_panel_support;
        private $sub_tab_comment;

        public function __construct()
        {

            register_post_type(VPRODUCT, array(
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
            $this->vcoin_panel_support = new adminsupport(VPRODUCT);
            $this->addAdminSupportMetabox();
            /*    $this->vcoin_panel_support->load_admin_valuables('admin_report_js', 'jp_status', array(
                        'report_job_id',
                        'report_revision',
                        'report_month_year'
                    ), array(
                        'tpm_normal_field' => ui_handler::apply_oc_template_with_mustache(
                                'admin_metabox_field_options',
                                array(
                                    "Field_Label_id" => "ui_ref_order_id",
                                    "Field_Label" => "Ref. Order ID",
                                    "Field_Select_Option" => ""
                                )
                            ),
                    )
                );*/
            /*   $this->vcoin_panel_support

                   ->add_metabox(
                       "report_template_list",
                       __("Report Template List", HKM_LANGUAGE_PACK),
                       get_oc_template('admin_report_template_table'))

                   ->add_metabox(
                       'report_book_content',
                       __("Report Content", HKM_LANGUAGE_PACK),
                       get_oc_template('admin_report_content')
                   )

                   ->add_metabox(
                       'returned_data_list',
                       __("Submission Data List", HKM_LANGUAGE_PACK),
                       get_oc_template('admin_report_datalist')
                   );

               $this->vcoin_panel_support->add_hide_metaboxes_on_new_post(
                   array(
                       'report_template_list',
                       'report_book_content'
                   )
               );*/
            register_taxonomy_for_object_type('category', VPRODUCT);
            add_action('rwmb_post_sc_meta_after_save_post', array(__CLASS__, "savebox"), 10, 1);
            add_action('rwmb_post_gift_meta_after_save_post', array(__CLASS__, "save_post_gift_meta"), 10, 1);

            /**
             * add submenu "comment"
             */
            $this->sub_tab_comment = new adminposttab(VPRODUCT,
                array('localize' => array(
                    "setting_ob",
                    array(
                        "post_type" => VPRODUCT,
                        "comment_table_id" => "admin_page_reward_comment_table",
                    )
                ),
                    'menu_title' => 'comment',
                    'cap' => 'administrator',
                    'menu_slug' => 'reward_submenu_comment',
                    'template_name' => 'admin_page_reward_comment_table',
                    'script_id' => 'page_admin_comment_table',
                    'style_id' => array('adminsupportcss', 'datatable', 'dashicons'),
                ));
            //add_action('icl_make_duplicate', array(&$this, "duplicate_post_after"), 12, 4);
        }

        /*public function duplicate_post_after($master_post_id, $lang, $postarr, $post_id)
        {
            inno_log_db::log_stock_count(-1, 5656565, "423234");
        }*/

        public static function save_post_gift_meta($post_id)
        {
            global $wpdb;

            $ids = $wpdb->prefix . 'icl_translations';
            $tranlation_id = $wpdb->get_var("SELECT trid FROM $ids WHERE element_id = $post_id");
            $result_ids = $wpdb->get_results("SELECT element_id FROM $ids WHERE trid = $tranlation_id");

            $redemption_lock_set_value = get_post_meta($post_id, "release_redemption", true);
            $expiration_date_set_value = get_post_meta($post_id, "inn_exp_date", true);
            $redeem_days_set_value = get_post_meta($post_id, "rdays", true);

            foreach ($result_ids as $key) {
                foreach ($key as $id) {
                    $redemption_lock = get_post_meta($id, "release_redemption", true);
                    $expiration_date = get_post_meta($id, "inn_exp_date", true);
                    $redeem_days = get_post_meta($id, "rdays", true);

                    if ($redemption_lock != $redemption_lock_set_value)
                        update_post_meta($id, "release_redemption", $redemption_lock_set_value, get_post_meta($id, "release_redemption", true));

                    if ($expiration_date != $expiration_date_set_value)
                        update_post_meta($id, "inn_exp_date", $expiration_date_set_value, get_post_meta($id, "inn_exp_date", true));

                    if ($redeem_days != $redeem_days_set_value)
                        update_post_meta($id, "rdays", $redeem_days_set_value, get_post_meta($id, "rdays", true));
                }
            }
        }


        public static function savebox($post_id)
        {
            global $current_user;
            try {
                if (!isset($_POST['stock_configuration_complete'])) return;
                if (!isset($_POST['innvendorid'])) return;
                $status = $_POST['stock_configuration_complete'];
                if (intval($status) == 1) {

                    self::create_vcoin_merchant_account($post_id);
                    self::withUpdateFieldN($post_id, 'stock_id', $post_id);
                    self::withUpdateFieldN($post_id, 'stock_configuration_complete', 2);

                    inno_log_db::log_stock_count(-1, 1099, "add stock count setups");


                    $method_type = $_POST['stock_system_type'];
                    $json_location = str_replace("\\", "", $_POST['assign_location_ids']);
                    $assigned_locations = json_decode($json_location, true);
                    $ext_number = $_POST['ext_no'];
                    //inno_log_db::log_stock_count(-1, 1099, print_r($assigned_locations, true));
                    $stock_manager = new StockOperation();
                    //$addressids = explode(",", $assigned_locations);
                    if ($method_type == 'perpetual') {
                        $stock_manager->add_stock_row(
                            $post_id, 0,
                            $ext_number,
                            array_keys($assigned_locations));
                    } else if ($method_type == 'decentralized') {
                        $stock_manager->add_stock_row(
                            $post_id, 1,
                            $ext_number,
                            array_keys($assigned_locations));
                    } else {
                        throw new Exception("fail to adding to stock counts", 1010);
                    }

                }
            } catch (Exception $e) {
                inno_log_db::log_admin_stock_management($current_user->ID, $e->getCode(), $e->getMessage());
            }
        }


        private static function withUpdateField($postid, $name_field)
        {
            if (isset($_POST[$name_field]))
                update_post_meta($postid, $name_field, $_POST[$name_field], get_post_meta($postid, $name_field, true));

        }

        public static function add_reward_support()
        {

        }

        protected function add_tab()
        {
            // this is the demo post type please open a new one
            $labels = array(
                'name' => _x('Rewards', 'post type general name'),
                'singular_name' => _x('Reward', 'post type singular name'),
                'add_new' => _x('追加Reward產品', HKM_LANGUAGE_PACK),
                'add_new_item' => __('追加Reward產品', HKM_LANGUAGE_PACK),
                'edit_item' => __('修改Reward產品', HKM_LANGUAGE_PACK),
                'new_item' => __('追加Reward產品', HKM_LANGUAGE_PACK),
                'all_items' => __('所有Rewards', HKM_LANGUAGE_PACK),
                'view_item' => __('看覽Reward產品', HKM_LANGUAGE_PACK),
                'search_items' => __('搜查Reward產品', HKM_LANGUAGE_PACK),
                'not_found' => __('沒有發現產品', HKM_LANGUAGE_PACK),
                'not_found_in_trash' => __('在垃圾中沒有發現產品', HKM_LANGUAGE_PACK),
                'parent_item_colon' => '',
                'menu_name' => __('Reward', HKM_LANGUAGE_PACK)
            );
            return $labels;
        }


        public static function addRWMetabox($meta_boxes)
        {
            $meta_boxes[] = array(
                'pages' => array(VPRODUCT),
                //This is the id applied to the meta box
                'id' => 'post_sc_meta',
                //This is the title that appears on the meta box container
                'title' => __('Stock Configuration', HKM_LANGUAGE_PACK),
                //This defines the part of the page where the edit screen section should be shown
                'context' => 'normal',
                //This sets the priority within the context where the boxes should show
                'priority' => 'high',
                //Here we define all the fields we want in the meta box
                'fields' => array(
                    array(
                        'type' => 'heading',
                        'name' => __('Heading', HKM_LANGUAGE_PACK),
                        'id' => 'inno_fake_id', // Not used but needed for plugin
                        'desc' => 'pick and choose the available location',
                    ),
                    array(
                        'type' => 'text',
                        'name' => 'VCoin UUID',
                        'id' => 'uuid_key',
                    ),
                    /*  array(
                          'name' => __('Target Country (*)', HKM_LANGUAGE_PACK), // TAXONOMY
                          'id' => "inn_gift_offer_location", // ID for this field
                          'type' => 'select', //options
                          'desc' => 'pick and choose the available location',
                          // Array of 'value' => 'Label' pairs for select box
                          'options' => array(
                              'na' => __('Select an Item', HKM_LANGUAGE_PACK),
                              'any' => __('Anywhere', HKM_LANGUAGE_PACK),
                              'ja' => __('Japan', HKM_LANGUAGE_PACK),
                              'cn' => __('China', HKM_LANGUAGE_PACK),
                              'hk' => __('Hong Kong', HKM_LANGUAGE_PACK),
                          ),
                          // Select multiple values, optional. Default is false.
                          'multiple' => false,
                          'std' => 'na',
                      ),*/
                    array(
                        'name' => __('Vendor Selection', HKM_LANGUAGE_PACK), // TAXONOMY
                        'id' => "innvendorid", // ID for this field
                        'type' => 'select', //options
                        //   'options' => VendorRequest::requestlist(),
                        //get_wp_vendor_list
                        'options' => VendorRequest::get_wp_vendor_list()
                    ),
                    array(
                        'name' => __('Stock Type', HKM_LANGUAGE_PACK), // TAXONOMY
                        'id' => "stock_system_type", // ID for this field
                        'type' => 'select', //options
                        'std' => 0,
                        'options' => array(
                            'na' => __('Please select', HKM_LANGUAGE_PACK),
                            'perpetual' => __('Perpetual system', HKM_LANGUAGE_PACK),
                            'decentralized' => __('Decentralized distribution', HKM_LANGUAGE_PACK),
                        ),
                        'desc' => "<strong>Decentralized:</strong> stock counts will be count into each individual location by the given locations 1-6
            <a href='" . site_url() . "/wp-admin/admin.php?page=stock-add'>Adding stock count from here</a>
            <br><strong>Perpetual:</strong> there is only one single central stock count for all.<br>
            "
                    ),
                    array(
                        'name' => __('Extensions', HKM_LANGUAGE_PACK), // TAXONOMY
                        'id' => "ext_set", // ID for this field
                        'type' => 'text', //options
                        'std' => '',
                        'clone' => true
                    ),
                    array(
                        'name' => __('Redemption Nature', HKM_LANGUAGE_PACK), // TAXONOMY
                        'id' => "redemption_procedure", // ID for this field
                        'type' => 'select', //options
                        'std' => '0',
                        'desc' => "Simple Redemption: Scan QR code and then transact<br>Scan: Require customer to input extra label.",
                        'options' => array(
                            '0' => __('Traditional redemption center', HKM_LANGUAGE_PACK),
                            '1' => __('Restaurant with table number', HKM_LANGUAGE_PACK),
                            '2' => __('Restaurant without table number', HKM_LANGUAGE_PACK),
                            // '3' => __('Coupon redemption', HKM_LANGUAGE_PACK),
                        ),
                    ),
                    /*array(
                        'name' => __('Available Locations', HKM_LANGUAGE_PACK), // TAXONOMY
                        'id' => "location_set", // ID for this field
                        'type' => 'checkbox', //options
                        'options' => array(
                            '12' => __('demo2', 'rwmb'),
                            '3' => __('demo1', 'rwmb'),
                        )
                    ),*/
                    array(
                        'name' => 'stock config complete',
                        'id' => "stock_configuration_complete",
                        'type' => 'hidden',
                        'std' => 0,
                    ),

                    array(
                        'name' => 'JSON carrier',
                        'id' => "assign_location_ids",
                        'type' => 'hidden',
                    ),
                    array(
                        'name' => 'number of extensions',
                        'id' => "ext_no",
                        'type' => 'hidden',
                    ),
                    array(
                        'name' => 'stock id',
                        'id' => "stock_id",
                        'type' => 'hidden',
                    ),

                ));

            $meta_boxes[] = array(
                'pages' => array(VPRODUCT),
                //This is the id applied to the meta box
                'id' => 'post_gift_meta',
                //This is the title that appears on the meta box container
                'title' => __('Product setting', HKM_LANGUAGE_PACK),
                //This defines the part of the page where the edit screen section should be shown
                'context' => 'normal',
                //This sets the priority within the context where the boxes should show
                'priority' => 'high',
                //Here we define all the fields we want in the meta box
                'fields' => array(
                    array('name' => __('Listing Expiration (*)', HKM_LANGUAGE_PACK),
// TAXONOMY
                        'id' => "inn_exp_date",
// ID for this field
                        'type' => 'date',
//options
                        'desc' => 'The time of expiration on the reward channel listing.. (not implemented yet)',
                    ),
                    array(
                        'name' => __('Redeem days (*)', HKM_LANGUAGE_PACK),
                        'id' => "rdays",
                        'type' => 'slider',
// Text labels displayed before and after value
                        'prefix' => __('', HKM_LANGUAGE_PACK),
                        'suffix' => __(' Days', HKM_LANGUAGE_PACK),
// jQuery UI slider options. See here http://api.jqueryui.com/slider/
                        'js_options' => array(
                            'min' => 1,
                            'max' => 90,
                            'step' => 1,
                        ),
                        'std' => 30,
                        'desc' => 'This is one of the factors to consider success and failure on the length of days for redemption record to be scanned by the QR scanner.',
                    ),

                    array('type' => 'divider'),
                    // TAXONOMY
                    array(
                        'name' => __('PRODUCT VIDEO URL(*)', HKM_LANGUAGE_PACK),
                        'id' => "gift_video_url",
// ID for this field
                        'type' => 'text',
                        'desc' => 'Enter a full URL path with the file format *.mp4 H.264 AVC android support format',
                    ),
                    array('type' => 'divider'),
// TAXONOMY
                    array('name' => __('V Coin VAL(*)', HKM_LANGUAGE_PACK),
// TAXONOMY
                        'id' => "v_coin",
// ID for this field
                        'type' => 'number',
//options
                        'desc' => 'the cost of redemption in v-coin',
                    ),
                    array('type' => 'divider'),
                    array('name' => __('Detail product URL', HKM_LANGUAGE_PACK),
// TAXONOMY
                        'id' => "inn_product_url",
// ID for this field
                        'type' => 'url',
//options
                        'desc' => 'Please give us the full path of the product url, e.g. http://xxx.xxx.com',
                    ),

                    /* array(
                         'name' => 'Vendor Name',
                         'id' => "vend_name",
                         'type' => 'hidden',
                     ),
                     array(
                         'name' => 'Vendor JSON',
                         'id' => "innvendorobject",
                         'type' => 'hidden',

                     ),*/

                    /**
                     * supposed to host the information related to vendor information the format is
                     *
                     * {
                     *      "name": "foansd"
                     *      "id": 23
                     * }
                     */
                    array('type' => 'divider'),
                    array(
                        'name' => __('Detail spec and function(*)', HKM_LANGUAGE_PACK),
                        'id' => "inn_gift_description",
                        'type' => 'wysiwyg',
                        'desc' => 'How us more about this product',
                        'std' => "",
                        'cols' => '40',
                        'rows' => '4',
                        'raw' => true,
                        'options' => array('wpautop' => false, 'media_buttons' => false)
                    ),
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
                        'id' => 'extra_remarks',
                        'name' => __('Note', HKM_LANGUAGE_PACK),
                        'desc' => 'Please provide the additional content on the email and the confirmation page to give the extra notification to the user.',
                        'type' => 'wysiwyg',
                        'std' => "",
                        'cols' => '40',
                        'rows' => '4',
                        'raw' => true, 'options' => array('media_buttons' => false)
                    ),
                    array('type' => 'divider'),
                    array(
                        'name' => __('Redemption Lock', HKM_LANGUAGE_PACK),
                        'id' => "release_redemption",
                        'type' => 'checkbox',
                        'desc' => 'Check this when this product is not ready for redemption. The unchecked box will allow user to play video and do redemption process.',
                    ),
                )
            );
            $meta_boxes[] = array(
                'pages' => array(VPRODUCT),
                //This is the id applied to the meta box
                'id' => 'post_gift_images',
                //This is the title that appears on the meta box container
                'title' => __('Product Images', HKM_LANGUAGE_PACK),
                //This defines the part of the page where the edit screen section should be shown
                'context' => 'normal',
                //This sets the priority within the context where the boxes should show
                'priority' => 'high',
                //Here we define all the fields we want in the meta box
                'fields' => array(
                    array(
                        'name' => __('Banner Button', HKM_LANGUAGE_PACK),
                        'desc' => 'Big button for the product /<strong style="color:red">Dimensions: 640 × 185px.</strong>',
                        'id' => 'inno_image_banner',
                        'type' => 'image_advanced',
                        'max_file_uploads' => 1,
                    ),
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
                        //  'max_file_uploads' => 1,
                        'type' => 'image_advanced',
                    ),
                    array(
                        'name' => __('Video Cover Image', HKM_LANGUAGE_PACK),
                        'desc' => 'The image to cover the unplay video until the user touches it. <strong style="color:red">Dimensions: 640 × 375px.</strong>',
                        'id' => 'inno_video_cover_image',
                        'type' => 'image_advanced',
                        'max_file_uploads' => 1,
                    ),
                ));

            return $meta_boxes;
        }

        protected function addAdminSupportMetabox()
        {

            $this->vcoin_panel_support->add_title_input_place_holder(__("Enter the Product Name Max 10 characters", HKM_LANGUAGE_PACK));
            $this->vcoin_panel_support->change_publish_button_label(__("Issue New Product", HKM_LANGUAGE_PACK));
            $this->vcoin_panel_support->add_script_name('both', 'admin_reward');
            $this->vcoin_panel_support->add_style('cms_rewards');
            $this->vcoin_panel_support->add_metabox(
                "stock_count",
                __("Stock Count", HKM_LANGUAGE_PACK),
                get_oc_template('admin_stock_count_box'));

        }
    }
}