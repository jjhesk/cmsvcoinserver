<?php
/**
 * Created by HKM Corporation.
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

        public function __destruct()
        {
            $this->vcoin_panel_support = NULL;
            $this->sub_tab_comment = NULL;
        }

        public static function manage_column($column_name, $id)
        {
            global $wpdb;
            switch ($column_name) {
                case 'name':
                    echo get_post_meta($id, "_developer_name", true);
                    break;
                case 'id':
                    echo $id;
                    break;
                case 'price':
                    echo (int)get_post_meta($id, "price", true);
                    break;
                case 'platform':
                    //  $n = (int)get_post_meta($id, "_platform", true);
                    // echo get_the_title($n);
                    echo get_post_meta($id, "_platform", true);
                    break;
                default:
                    break;
            } // end switch
        }

        public static function add_new_columns($new_columns)
        {
            $new_columns['cb'] = '<input type="checkbox" />';
            $new_columns['id'] = __('ID');
            $new_columns['title'] = _x('Coupon', 'column name');
            //$new_columns['type'] = _x('Game Type', 'column name');
            $new_columns['price'] = _x('Coin', 'column name');
            $new_columns['platform'] = _x('Platform', 'column name');
            $new_columns['name'] = _x('Dev', 'column name');
            // $new_columns['author'] = __('Author');
            // $new_columns['categories'] = __('Categories');
            // $new_columns['tags'] = __('Tags');
            // $new_columns['date'] = _x('Date', 'column name');
            unset($new_columns['author']);
            unset($new_columns['date']);
            //  unset($new_columns['categories']);
            return $new_columns;
        }

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


            add_filter('rwmb_meta_boxes', array($this, 'addRWMetabox'), 10, 1);
           // $this->vcoin_panel_support = new adminsupport(VPRODUCT);
         //   $this->addAdminSupportMetabox();
            add_action("rwmb_post_sc_meta_after_save_post", array(__CLASS__, "savebox"), 10, 1);
            // register_taxonomy_for_object_type('post_tag', APPDISPLAY);
            // register_taxonomy_for_object_type('category', APPDISPLAY);
            // register_taxonomy_for_object_type('country', APPDISPLAY);

            // add_action('pending_to_publish', array(__CLASS__, "on_publish_pending_app"), 10, 1);

            add_filter('manage_edit-' . APPDISPLAY . '_columns', array(__CLASS__, "add_new_columns"), 10, 1);
            add_action('manage_' . APPDISPLAY . '_posts_custom_column', array(__CLASS__, "manage_column"), 10, 2);

            /**
             * add submenu "comment"
             */
            $this->sub_tab_comment = new adminposttab(APPDISPLAY,
                array('localize' => array(
                    "setting_ob",
                    array(
                        "post_type" => APPDISPLAY,
                        "comment_table_id" => "admin_comment_table",
                    )
                ),
                    'menu_title' => 'comment',
                    'cap' => 'administrator',
                    'menu_slug' => 'app_submenu_comment',
                    'template_name' => 'admin_page_comment_table',
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

        public function addRWMetabox($meta_boxes)
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
                        'type' => 'select',
                        'options' => array(
                            'ios' => "iOS",
                            'android' => "Android"
                        ),
                        'desc' => 'Code or Download Id for IOS',
                    ),
                    array(
                        'name' => __('Store ID - ID in play store or TrackId in app store', HKM_LANGUAGE_PACK),
                        'id' => '_storeid',
                        'type' => 'text',
                        'desc' => 'This is the App ID for (ios) or Package Name for (android)',
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
                        'type' => 'number',
                        'desc' => 'Developer User ID from Auth server.',
                    ),
                    array(
                        'name' => __('developer Name', HKM_LANGUAGE_PACK),
                        'id' => '_developer_name',
                        'type' => 'text',
                        'desc' => 'Developer Name.',
                    ),
                    array(
                        'name' => __('Payout', HKM_LANGUAGE_PACK),
                        'id' => "price",
                        'type' => 'number',
                        'desc' => 'the payout of each single successful download',
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
                        'name' => __('screen shots', HKM_LANGUAGE_PACK),
                        'id' => "_screen_shot",
                        'type' => 'hidden',
                    ),
                    array(
                        'name' => __('App Key - as the key registered in login system for SDK App key', HKM_LANGUAGE_PACK),
                        'id' => "_appkey",
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
            unset($prev);
            unset($new);
            unset($post_id);
            unset($field);
        }

        /**
         * add the submission application
         * @param $Q
         * @return mixed
         * @throws Exception
         */
        public static function add_new_app($Q)
        {
            /*    $post = array(
                             'ID'             => [ <post id> ] // Are you updating an existing post?
                             'post_content'   => [ <string> ] // The full text of the post.
                             'post_name'      => [ <string> ] // The name (slug) for your post
                             'post_title'     => [ <string> ] // The title of your post.
                             'post_status'    => [ 'draft' | 'publish' | 'pending'| 'future' | 'private' | custom registered status ] // Default 'draft'.
                             'post_type'      => [ 'post' | 'page' | 'link' | 'nav_menu_item' | custom post type ] // Default 'post'.
                             'post_author'    => [ <user ID> ] // The user ID number of the author. Default is the current user ID.
                             'ping_status'    => [ 'closed' | 'open' ] // Pingbacks or trackbacks allowed. Default is the option 'default_ping_status'.
                             'post_parent'    => [ <post ID> ] // Sets the parent of the new post, if any. Default 0.
                             'menu_order'     => [ <order> ] // If new post is a page, sets the order in which it should appear in supported menus. Default 0.
                             'to_ping'        => // Space or carriage return-separated list of URLs to ping. Default empty string.
                             'pinged'         => // Space or carriage return-separated list of URLs that have been pinged. Default empty string.
                             'post_password'  => [ <string> ] // Password for post, if any. Default empty string.
                             'guid'           => // Skip this and let Wordpress handle it, usually.
                             'post_content_filtered' => // Skip this and let Wordpress handle it, usually.
                             'post_excerpt'   => [ <string> ] // For all your post excerpt needs.
                             'post_date'      => [ Y-m-d H:i:s ] // The time post was made.
                             'post_date_gmt'  => [ Y-m-d H:i:s ] // The time post was made, in GMT.
                             'comment_status' => [ 'closed' | 'open' ] // Default is the option 'default_comment_status', or 'closed'.
                             'post_category'  => [ array(<category id>, ...) ] // Default empty.
                             'tags_input'     => [ '<tag>, <tag>, ...' | array ] // Default empty.
                             'tax_input'      => [ array( <taxonomy> => <array | string> ) ] // For custom taxonomies. Default empty.
                             'page_template'  => [ <string> ] // Requires name of template file, eg template.php. Default empty.
                           );
                 */
            if (!isset($Q->_appname)) throw new Exception("_appname is not exist", 1001);
            if (!isset($Q->_icon)) throw new Exception("_icon is not exist", 1002);
            if (!isset($Q->_storeid)) throw new Exception("_storeid is not exist", 1003);
            if (!isset($Q->_description)) throw new Exception("_description is not exist", 1004);
            if (!isset($Q->_platform)) throw new Exception("_platform is not exist", 1005);
            if (!isset($Q->_developer)) throw new Exception("_developer is not exist", 1006);
            if (!isset($Q->_vcoin)) throw new Exception("_vcoin is not exist", 1007);
            if (!isset($Q->_developer_name)) throw new Exception("developer name is not exist", 1009);
            if (!isset($Q->_screen_shot)) throw new Exception("_screen_shot is not exist", 1010);

            $post = array(
                "post_status" => "draft",
                "post_type" => APPDISPLAY,
                "post_author" => 1,
                "post_title" => $Q->_appname,
                "post_name" => $Q->_storeid,
            );

            $post_id = wp_insert_post($post);
            if ($post_id > 0) {
                add_post_meta($post_id, '_icon', $Q->_icon, true);
                add_post_meta($post_id, '_storeid', $Q->_storeid, true);
                add_post_meta($post_id, '_description', $Q->_description, true);
                add_post_meta($post_id, '_platform', $Q->_platform, true);
                add_post_meta($post_id, '_developer', $Q->_developer, true);
                add_post_meta($post_id, '_appname', $Q->_appname, true);
                add_post_meta($post_id, 'price', $Q->_vcoin, true);
                add_post_meta($post_id, '_developer_name', $Q->_developer_name, true);
                //  add_post_meta($post_id, 'appid', $Q->_appname, true);
                add_post_meta($post_id, 'comment_count', 0, true);
                add_post_meta($post_id, 'share_count', 0, true);
                add_post_meta($post_id, 'dl_count', 0, true);
                add_post_meta($post_id, '_screen_shot', $Q->_screen_shot, true);
                add_post_meta($post_id, '_appkey', $Q->_appkey, true);
                // add_post_meta($post_id, 'uuid_key', $Q->_uuid, true);
            }
            //  inno_log_db::log_admin_coupon_management(-1, 101017, "add new app post_id: " . $post_id);

            unset($Q);
            return $post_id;
        }

        /**
         * remove the pending app
         * @param $Q
         * @throws Exception
         */
        public static function remove_dead_app($Q)
        {
            if (!isset($Q->post_id)) throw new Exception("post_id is not exist", 11082);
            if (get_post_type($Q->post_id) != APPDISPLAY) throw new Exception("post_id is not exist", 11083);
            wp_delete_post($Q->post_id, true);
        }

        /**
         * change app's status from alive to dead(draft)
         * @param $Q
         * @throws Exception
         */
        public static function alive_to_dead($Q)
        {
            if (!isset($Q->post_id)) throw new Exception("post_id is not exist", 11082);
            if (get_post_type($Q->post_id) != APPDISPLAY) throw new Exception("post_id is not exist", 11083);
            // if (get_post_status($Q->post_id) != "publish") throw new Exception("this post not in publish mode", 11086);

            $request_app = array(
                'ID' => $Q->post_id,
                'post_status' => 'draft'
            );
            wp_update_post($request_app);
        }

        /**
         * change app's status from dead to alive(publish)
         * @param $Q
         * @throws Exception
         */
        public static function dead_to_alive($Q)
        {
            if (!isset($Q->post_id)) throw new Exception("post_id is not exist", 11082);
            if (get_post_type($Q->post_id) != APPDISPLAY) throw new Exception("post_id is not exist", 11083);
            if (get_post_status($Q->post_id) != "draft") throw new Exception("This post is not in draft mode", 11087);

            $request_app = array(
                'ID' => $Q->post_id,
                'post_status' => 'publish'
            );
            wp_update_post($request_app);
        }

        /**
         * change app's status from dead to alive(publish)
         * @param $Q
         * @throws Exception
         */
        public static function beta_to_alive($Q)
        {
            if (!isset($Q->post_id)) throw new Exception("post_id is not exist", 11082);
            if (get_post_type($Q->post_id) != APPDISPLAY) throw new Exception("post_id is not exist", 11083);

            $request_app = array(
                'ID' => $Q->post_id,
                'post_status' => 'publish'
            );
            wp_update_post($request_app);
        }

    }
}