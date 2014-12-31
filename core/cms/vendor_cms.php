<?php
/**
 * Created by HKM Corporation.
 * User: Hesk
 * Date: 14年8月12日
 * Time: 上午10:35
 */
defined('ABSPATH') || exit;
if (!class_exists('vendor_cms')) {
    class vendor_cms extends cmsBase
    {
        private $vendor_panel_support;
        private $address_input_admin;

        public function __construct()
        {
            if (userBase::has_role("store_staff")) return;
            $this->post_type = VENDOR;
            register_post_type($this->post_type, array(
                'labels' => $this->add_tab(),
                'description' => __('Manage the albums in the backend.'),
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
            add_filter('rwmb_meta_boxes', array($this, 'addRWMetabox'), 10, 1);

            $this->vendor_panel_support = new adminsupport($this->post_type);
            $this->address_input_admin = new adminposttab($this->post_type,
                array(
                    'localize' => array("setting_ob", array(
                        "post_type" => $this->post_type,
                        "comment_table_id" => "page_admin_address_cms",
                        "debug_fields" => $this->isDebug())),
                    'page_title' => '',
                    'menu_title' => 'Address cms',
                    'cap' => 'administrator',
                    'menu_slug' => 'address_cms',
                    'template_name' => 'admin_page_address_cms',
                    'script_id' => 'page_admin_vendor_address',
                    'style_id' => array('adminsupportcss', 'datatable', 'dashicons'),
                )
            );


            $this->addAdminSupportMetabox();
            //register_taxonomy_for_object_type('products', VPRODUCT);
        }

        protected function add_tab()
        {
            $labels = array(
                'name' => _x('Vendor - The vendors and its center locations', 'post type general name'),
                'singular_name' => _x('Vendor', 'post type singular name'),
                'add_new' => _x('add vendor', HKM_LANGUAGE_PACK),
                'add_new_item' => __('add vendor', HKM_LANGUAGE_PACK),
                'edit_item' => __('add vendor', HKM_LANGUAGE_PACK),
                'new_item' => __('add vendor', HKM_LANGUAGE_PACK),
                'all_items' => __('list all', HKM_LANGUAGE_PACK),
                'view_item' => __('view vendor', HKM_LANGUAGE_PACK),
                'search_items' => __('search vendor', HKM_LANGUAGE_PACK),
                'not_found' => __('vendor not found', HKM_LANGUAGE_PACK),
                'not_found_in_trash' => __('not found', HKM_LANGUAGE_PACK),
                'parent_item_colon' => '',
                'menu_name' => __('Vendor', HKM_LANGUAGE_PACK)
            );
            return $labels;
        }

        public function addRWMetabox($meta_boxes)
        {
            $meta_boxes[] = array(
                'pages' => array(VENDOR),
                //This is the id applied to the meta box
                'id' => 'post_vendor_meta',
                //This is the title that appears on the meta box container
                'title' => __('Vendor', HKM_LANGUAGE_PACK),
                //This defines the part of the page where the edit screen section should be shown
                'context' => 'normal',
                //This sets the priority within the context where the boxes should show
                'priority' => 'high',
                //Here we define all the fields we want in the meta box
                'fields' => array(
                    array(
                        'name' => 'Email Opt', // TAXONOMY
                        'id' => "vend_e_opt", // ID for this field
                        'type' => 'checkbox', //options
                        'desc' => "check this to enable this vendor email to be sent out when any transaction related to this vendor"
                    ),
                    array(
                        'name' => 'Contact Email', // TAXONOMY
                        'id' => "vend_email", // ID for this field
                        'type' => 'text', //options
                        'desc' => "The email that associate with the main office or the headquarter"
                    ),
                    array(
                        'name' => 'Contact Phone', // TAXONOMY
                        'id' => "vend_phone", // ID for this field
                        'type' => 'text', //options
                    ),
                    array(
                        'name' => 'Company Website', // TAXONOMY
                        'id' => "vend_url", // ID for this field
                        'type' => 'text', //options
                        'desc' => "Please enter the URL for the company website"
                    ),
                    /*array(
                        'name' => 'VCoin account UUID', // TAXONOMY
                        'id' => "vendid", // ID for this field
                        'type' => 'text', // options
                        'desc' => "This vendor UUID code should match up into the vCoin server system"
                    ),*/
                    array(
                        'name' => 'Redemption Centers', // TAXONOMY
                        'id' => 'location_ids', // ID for this field
                        'type' => 'select', //options
                        'options' => VendorRequest::select_list_addresses(),
                        'clone' => true
                    ),
                    /*array(
                        'name' => 'VCoin', // TAXONOMY
                        'id' => 'location_ids', // ID for this field
                        'type' => 'text', // options
                        'options' => VendorRequest::select_list_addresses(),
                        'clone' => true
                    ),*/
                    array(
                        'name' => 'Available coins', // TAXONOMY
                        'id' => 'available_coin', // ID for this field
                        'type' => 'text', //options
                    ),
                ));

            return $meta_boxes;
        }

        protected function addAdminSupportMetabox()
        {
            $this->vendor_panel_support->add_script_name('both', 'admin_vendor');
        }
    }
}