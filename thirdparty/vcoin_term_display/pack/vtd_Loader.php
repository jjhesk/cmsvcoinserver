<?php
/**
 * Created by PhpStorm.
 * User: Hesk
 * Date: 14年11月25日
 * Time: 下午2:33
 */
//namespace pack;
class vtd_Loader
{

    public function __construct($_file_)
    {
        add_action('plugins_loaded', array($this, 'atto_load_textdomain'));
        register_deactivation_hook($_file_, array($this, 'deactivated'));
        register_activation_hook($_file_, array($this, 'activated'), 10, 1);
        add_filter('plugins_loaded', array($this, 'atto_plugins_loaded'));
        add_filter('get_terms_args', array("vtd_filter", '_get_terms_args'), 99, 2);
        add_filter('get_terms_orderby', array("vtd_filter", 'get_terms_orderby'), 10, 2);
        add_filter('terms_clauses', array("vtd_filter", '_terms_clauses'), 99, 3);
        add_action('admin_enqueue_scripts', array("vtd_logic", 'do_enqueue_script'));
        add_action('admin_init', array($this, '_display_init'));
        add_action('admin_menu', array(__CLASS__, "menuadd"), 99);
        // save our taxonomy image while edit or save term
        add_action('edit_term', array(__CLASS__, "edit_item"));
    }

    public static function edit_item($term_id)
    {
        $logic = new vtd_logic();
        $terms_status = $_POST['term_display_sw'];
        $taxonomy = $_POST['taxonomy'];
        if (isset($terms_status)) {
            $logic->update_switch_status($term_id, $terms_status, $taxonomy);
        }
        // inno_log_db::log_admin_coupon_management(-1, 1011, print_r($terms_status, true));
    }

    public static function userdata_get_level($return_as_numeric = FALSE)
    {
        global $userdata;
        $user_level = '';
        for ($i = 10; $i >= 0; $i--) {
            if (current_user_can('level_' . $i) === TRUE) {
                $user_level = $i;
                if ($return_as_numeric === FALSE)
                    $user_level = 'level_' . $i;
                break;
            }
        }
        return ($user_level);
    }

    public static function menuadd()
    {
        //  include(TOPATH . '/include/interface.php');
        //   include(TOPATH . '/include/terms_walker.php');
        //<img class="menu_tto" src="' . TOURL . '/images/menu-icon.gif" alt="" />
        //  include(TOPATH . '/include/options.php');

        add_options_page('Taxonomy Display', 'Taxonomy Display', 'manage_options', 'termdisplayoptions', array("view_option_panel", "panel_settings"));
        $options = get_option('taxonomy_display_options');
        if (isset($options['capability']) && !empty($options['capability'])) {
            $capability = $options['capability'];
        } else if (isset($options['level'])) {
            if (is_numeric($options['level']))
                //maintain the old user level compatibility
                $capability = self::userdata_get_level();
        } else {
            $capability = 'install_plugins';
        }
        //check for new version once per day
        //  add_action('after_plugin_row', 'atto_check_plugin_version');
        //put a menu within all custom types if apply
        $post_types = get_post_types();
        foreach ($post_types as $post_type) {
            //check if there are any taxonomy for this post type
            $post_type_taxonomies = get_object_taxonomies($post_type);
            if (count($post_type_taxonomies) == 0)
                continue;


            //   if ($post_type == 'post')
            //   add_submenu_page('edit.php', 'Taxonomy Order', 'Taxonomy Order', $capability, 'to-interface-' . $post_type, 'TOPluginInterface');
            //    else
            //   add_submenu_page('edit.php?post_type=' . $post_type, 'Taxonomy Order', 'Taxonomy Order', $capability, 'to-interface-' . $post_type, 'TOPluginInterface');
        }
    }

    /**
     *
     * apply this switch button in the panel
     * for taxonomy
     */
    function _display_init()
    {
        //  $tax = 'category';
        $options = get_option('taxonomy_display_options');
        if (isset($options['taxonomy_list'])) {
            $list = $options['taxonomy_list'];
            foreach ($list as $tax => $val) {
                if (isset($_GET["taxonomy"])) {
                    if (intval($val) == 1 && $tax == $_GET["taxonomy"]) {
                        add_action($tax . '_edit_form_fields', array(__CLASS__, 'edit_field'), 8, 1);
                        add_filter('manage_edit-' . $tax . '_columns', array(__CLASS__, 'columns'), 8, 1);
                        add_filter('manage_' . $tax . '_custom_column', array(__CLASS__, 'column'), 8, 3);
                    }
                }
            }
        }
    }

    public static function columns($columns)
    {
        $new_columns = array();
        // $new_columns['cb'] = $columns['cb'];
        $new_columns['display_enabled'] = __('Display', 'vcoin');
        //  unset($columns['cb']);
        return array_merge($new_columns, $columns);
    }

    public static function column($columns, $column, $id)
    {
        $logic = new vtd_logic();
        $checked = $logic->get_switch_status($id) == 1 ? "checked" : "";

        if ($column == 'display_enabled') {
            $columns = '<input type="checkbox" ' . $checked . ' disabled> ';
        }
        return $columns;
    }

    public static function edit_field($taxonomy)
    {
        echo vtd_util::getview("edit_field");
    }

    function atto_load_textdomain()
    {
        load_plugin_textdomain('vtd_name', FALSE, VTDPATH . 'lang');
    }

    function deactivated()
    {
        global $wpdb;

        //make sure the vars are set as default
        $options = get_option('taxonomy_display_options');
        if (!isset($options['autosort']))
            $options['autosort'] = '1';

        if (!isset($options['adminsort']))
            $options['adminsort'] = '1';

        if (!isset($options['capability']))
            $options['capability'] = 'install_plugins';

        if (!isset($options['taxonomy_list']))
            $options['taxonomy_list'] = '';

        update_option('taxonomy_display_options', $options);

        //try to create the term_order column in case is not created
        $query = "SHOW COLUMNS FROM `" . $wpdb->terms . "`
                        LIKE 'term_order'";
        $result = $wpdb->get_row($query);
        if (!$result) {
            /*$query = "ALTER TABLE `" . $wpdb->terms . "`
                                ADD `term_order` INT NULL DEFAULT '0'";*/
            $query = "ALTER TABLE `" . $wpdb->terms . "`
                                DROP `term_display`";
            $result = $wpdb->get_results($query);
        }
    }

    function _activated_actions()
    {
        global $wpdb;
        //make sure the vars are set as default
        $options = get_option('taxonomy_display_options');
        if (!isset($options['autosort']))
            $options['autosort'] = '1';
        if (!isset($options['adminsort']))
            $options['adminsort'] = '1';
        if (!isset($options['capability']))
            $options['capability'] = 'install_plugins';
        if (!isset($options['taxonomy_list']))
            $options['taxonomy_list'] = '';

        update_option('taxonomy_display_options', $options);

        //try to create the term_order column in case is not created
        $query = "SHOW COLUMNS FROM `" . $wpdb->terms . "` LIKE 'term_display'";
        $result = $wpdb->get_row($query);
        if (!$result) {
            //1 is show and 0 is hide
            $query = "ALTER TABLE `" . $wpdb->terms . "` ADD `term_display` INT NULL DEFAULT '1'";
            $result = $wpdb->get_results($query);
        }
    }

    function activated($network_wide)
    {
        global $wpdb;
        // check if it is a network activation
        if ($network_wide) {
            $current_blog = $wpdb->blogid;
            // Get all blog ids
            $blogids = $wpdb->get_col("SELECT blog_id FROM $wpdb->blogs");
            foreach ($blogids as $blog_id) {
                switch_to_blog($blog_id);
                $this->_activated_actions();
            }
            switch_to_blog($current_blog);
            return;
        } else
            $this->_activated_actions();
    }

    function atto_plugins_loaded()
    {
        $options = get_option('taxonomy_display_options');

        if (is_admin()) {
            //  if ($options['adminsort'] == "1")
            //   remove_vtd_filter('get_terms', 'wpsc_get_terms_category_sort_vtd_filter');
        } else {
            //  if ($options['autosort'] == 1)
            //    remove_vtd_filter('get_terms', 'wpsc_get_terms_category_sort_vtd_filter');
        }
    }
} 