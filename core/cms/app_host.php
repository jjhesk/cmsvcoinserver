<?php
/**
 * Created by PhpStorm.
 * User: Hesk
 * Date: 14年8月13日
 * Time: 下午5:14
 */
defined("ABSPATH") || exit;
if (!class_exists("app_host")) {
    class app_host extends cmsBase
    {
        private $vcoin_panel_support;
        private $sub_tab_comment;

        public function __construct()
        {
            register_post_type(APPDISPLAY, array(
                "labels" => $this->add_tab(),
                "description" => __("Manage the ablums in the backend."),
                "public" => true,
                "publicly_queryable" => true,
                "show_ui" => true,
                "show_in_menu" => true,
                "query_var" => false,
                // "rewrite" => array("slug" => "gift", "with_front" => false),
                "capability_type" => "post",
                "has_archive" => true,
                "hierarchical" => false,
                "menu_position" => 6,
                "supports" => array("title", "author"),
                "menu_icon" => VCOIN_IMAGES_PATH . "system_log_icon.png",
                "hierarchical" => false,
            ));

            add_filter("rwmb_meta_boxes", array(__CLASS__, "addRWMetabox"), 10, 1);
            $this->vcoin_panel_support = new adminsupport(VPRODUCT);
            $this->addAdminSupportMetabox();
            add_action("rwmb_post_sc_meta_after_save_post", array(__CLASS__, "savebox"), 10, 1);
            // register_taxonomy_for_object_type('post_tag', APPDISPLAY);
            // register_taxonomy_for_object_type('category', APPDISPLAY);
            // register_taxonomy_for_object_type('country', APPDISPLAY);

            /**
             * add submenu "comment"
             */
            $this->sub_tab_comment = new adminposttab(APPDISPLAY,
                array('localize' => array(
                    "setting_ob",
                    array(
                        "post_type" => APPDISPLAY,
                        "comment_table_id" => "admin_page_app_comment_table",
                    )
                ),
                    'menu_title' => 'comment',
                    'cap' => 'administrator',
                    'menu_slug' => 'app_submenu_comment',
                    'template_name' => 'admin_page_app_comment_table',
                    'script_id' => 'page_admin_comment_table',
                    'style_id' => array('adminsupportcss', 'datatable', 'dashicons'),
                ));
        }

        protected function add_tab()
        {
            $labels = array(
                "name" => _x("AppHost", "post type general name"),
                "singular_name" => _x("AppHosts", "post type singular name"),
                "add_new" => _x("追加App", HKM_LANGUAGE_PACK),
                "add_new_item" => __("追加App", HKM_LANGUAGE_PACK),
                "edit_item" => __("修改App", HKM_LANGUAGE_PACK),
                "new_item" => __("追加App", HKM_LANGUAGE_PACK),
                "all_items" => __("所有App", HKM_LANGUAGE_PACK),
                "view_item" => __("看覽App", HKM_LANGUAGE_PACK),
                "search_items" => __("搜查App", HKM_LANGUAGE_PACK),
                "not_found" => __("沒有發現App", HKM_LANGUAGE_PACK),
                "not_found_in_trash" => __("在垃圾中沒有發現App", HKM_LANGUAGE_PACK),
                "parent_item_colon" => "",
                "menu_name" => __("HostApp", HKM_LANGUAGE_PACK)
            );
            return $labels;
        }

        public static function addRWMetabox($meta_boxes)
        {

            $meta_boxes[] = array(
                'pages' => array(APPDISPLAY),
                //This is the id applied to the meta box
                'id' => 'app_host_metaboz',
                //This is the title that appears on the meta box container
                'title' => __('App Host Data', HKM_LANGUAGE_PACK),
                //This defines the part of the page where the edit screen section should be shown
                'context' => 'normal',
                //This sets the priority within the context where the boxes should show
                'priority' => 'high',
                //Here we define all the fields we want in the meta box
                'fields' => array(
                    array(
                        'name' => __('App Name (*)', HKM_LANGUAGE_PACK),
                        'id' => "_appname",
                        'type' => 'text',
                        'std' => '',
                        'desc' => 'The name of the application.',
                    ),
                    array(
                        'name' => __('Platform', HKM_LANGUAGE_PACK),
                        'id' => "_platform",
                        'type' => 'text',
                        'desc' => 'Code or Download Id for IOS',
                    ),
                    array(
                        'name' => __('store id', HKM_LANGUAGE_PACK),
                        'id' => '_storeid',
                        'type' => 'text',
                        'desc' => 'Price of the app',
                    ),
                    array(
                        'name' => __('icon', HKM_LANGUAGE_PACK),
                        'id' => '_icon',
                        'type' => 'text',
                        'desc' => 'Icon image',
                    ),
                    //_developer
                    array(
                        'name' => __('developer ID', HKM_LANGUAGE_PACK),
                        'id' => '_developer',
                        'type' => 'text',
                        'desc' => 'Developer User ID from Auth server.',
                    ),
                    array(
                        'name' => __('Price', HKM_LANGUAGE_PACK),
                        'id' => "price",
                        'type' => 'text',
                        'desc' => 'Price of the app',
                    ),
                    array(
                        'name' => __('Description', HKM_LANGUAGE_PACK),
                        'id' => "_description",
                        'type' => 'wysiwyg',
                        'desc' => 'Shows information about the application or game.',
                        'std' => "",
                        'cols' => '40',
                        'rows' => '4',
                        'raw' => true,
                        'options' => array('wpautop' => false, 'media_buttons' => false)
                    ),
                    array(
                        'name' => __('Application State', HKM_LANGUAGE_PACK),
                        'id' => "release_lock",
                        'type' => 'checkbox',
                        'desc' => 'Check this when this product is not ready for listing. The unchecked box will be listed automatically.',
                    ),
                    array(
                        'name' => __('Integrated (*)', HKM_LANGUAGE_PACK),
                        'id' => "integrated",
                        'type' => 'text',
                        'std' => '',
                        'desc' => 'Integration status - shows if the app has connected with our servers within the last 24-hours..',
                    ),
                    array(
                        'name' => __('App Secret Key(*)', HKM_LANGUAGE_PACK),
                        'id' => "appsecret",
                        'type' => 'text',
                        'std' => '',
                        'desc' => 'A shared secret used to verify requests from your app. Use this when integrating.',
                    ),
                    array(
                        'name' => __('App ID - Stored ID(*)', HKM_LANGUAGE_PACK),
                        'id' => "appid",
                        'type' => 'text',
                        'std' => '',
                        'desc' => 'App ID. Use this when integrating.',
                    ),
                    array(
                        'name' => __('Download Count', HKM_LANGUAGE_PACK),
                        'id' => "dl_count",
                        'type' => 'number',
                        'std' => '',
                    ),
                    array(
                        'name' => __('Comment Count', HKM_LANGUAGE_PACK),
                        'id' => "comment_count",
                        'type' => 'number',
                        'std' => '',
                    ),
                    array(
                        'name' => __('Share Count', HKM_LANGUAGE_PACK),
                        'id' => "share_count",
                        'type' => 'number',
                        'std' => '',
                    )
                    //App ID. Use this when integrating.
                ));
            return $meta_boxes;
        }

        protected function addAdminSupportMetabox()
        {
            // TODO: Implement addAdminSupportMetabox() method.
        }

        public static function update_download_count($post_id)
        {
            self::add_count($post_id, 'dl_count');
        }

        public static function update_share_count($post_id)
        {
            self::add_count($post_id, 'share_count');
        }

        public static function update_comment_count($post_id)
        {
            self::add_count($post_id, 'comment_count');
        }

        private static function add_count($post_id, $field)
        {
            $prev = intval(get_meta_post($post_id, $field, true));
            $new = $prev + 1;
            update_post_meta($post_id, $field, $new, $prev);
        }

        public static function add_new_app($query)
        {

            if (!isset($query->_appname)) throw new Exception("_appname is not exist", 1001);
            if (!isset($query->_icon)) throw new Exception("_icon is not exist", 1002);
            if (!isset($query->_storeid)) throw new Exception("_storeid is not exist", 1003);
            if (!isset($query->_description)) throw new Exception("_description is not exist", 1004);
            if (!isset($query->_platform)) throw new Exception("_platform is not exist", 1005);
            if (!isset($query->_developer)) throw new Exception("_developer is not exist", 1006);
            if (!isset($query->_uuid)) throw new Exception("_uuid is not exist", 1007);

            $post = array(
                "post_status" => "pending",
                "post_type" => APPDISPLAY,
                "post_author" => 1,
                "post_title" => $query->_appname,
                "post_name" => $query->_appname,
            );

            $post_id = wp_insert_post($post);
            if ($post_id > 0) {
                add_post_meta($post_id, '_icon', $query->_icon, true);
                add_post_meta($post_id, '_storeid', $query->_storeid, true);
                add_post_meta($post_id, '_description', $query->_description, true);
                add_post_meta($post_id, '_platform', $query->_platform, true);
                add_post_meta($post_id, '_developer', $query->_developer, true);
                add_post_meta($post_id, '_appname', $query->_appname, true);
                //  add_post_meta($post_id, 'appid', $query->_appname, true);
                add_post_meta($post_id, 'comment_count', 0, true);
                add_post_meta($post_id, 'share_count', 0, true);
                add_post_meta($post_id, 'dl_count', 0, true);
                add_post_meta($post_id, 'uuid_key', $query->_uuid, true);
            }
            inno_log_db::log_admin_coupon_management(-1, 101017, "add new app post_id: " . $post_id);
            return $post_id;
        }
    }
}