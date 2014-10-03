<?php
/**
 * Created by PhpStorm.
 * User: Hesk
 * Date: 14年5月15日
 * Time: 下午12:10
 */
defined('ABSPATH') || exit;
if (!class_exists('adminsupport')):
    class adminsupport
    {
        var $ver = "0.0.5";
        private $post_type;
        private $script_id, $style_script_id;
        private $localized_id_handler, $localized_object_name, $localize_keys, $localize_merge_array;
        private $hidden_metaboxes;

        public function __construct($custom_post_type)
        {
            $this->post_type = $custom_post_type;
        }

        public function register()
        {
            //  wp_register_style('adminsupportcss', HKM_LIBCSS . 'admin/normalcontrol.css', array(), '1');
            //   wp_register_script('ocjp', HKM_LIBJS . 'admin/jobpanel.js', array('jquery', 'jquery-ui-autocomplete'), $this->ver, true);
        }

        /**
         * @param array $hide
         */
        public function add_hide_metaboxes_on_new_post($hide = array())
        {
            $this->hidden_metaboxes = $hide;
            //  add_filter('default_hidden_meta_boxes', array(&$this, 'new_post_add_metaboxes'), 10, 2);
        }

        /**
         * @param $hidden
         * @param $screen
         * @return array
         */
        public function new_post_add_metaboxes($hidden, $screen)
        {
            if (isset($screen->post_type) && !empty($screen->action)) {
                if ($screen->post_type == $this->post_type && $screen->action == "add") {
                    $hidden = array_merge($hidden, $this->hidden_metaboxes);
                }
            }
            if (isset($screen->post_type) && empty($screen->action)) {
                if ($screen->post_type == $this->post_type) {
                    $hidden = array_diff(get_hidden_meta_boxes(), $this->hidden_metaboxes);
                }
            }
            return $hidden;
        }

        /**
         * @param $script_id_handler
         * @param $object_name
         * @param array $args
         * @param array $arg2
         */
        public function load_admin_valuables($script_id_handler, $object_name, $args = array(), $arg2 = array())
        {
            $this->localized_id_handler = $script_id_handler;
            $this->localized_object_name = $object_name;
            $this->localize_keys = $args;
            $this->localize_merge_array = $arg2;
        }

        /**
         * @param $script_id
         */
        public function add_style($script_id)
        {
            $this->style_script_id = $script_id;
        }

        /**
         * @param $filename
         * @param $script_id_handler
         */
        public function add_script_name($filename, $script_id_handler)
        {
            $this->script_id = $script_id_handler;
            if ($filename == 'both') {
                add_action('admin_enqueue_scripts', array(&$this, 'wp_enqueue_script_for_both'));
            }
            if ($filename == 'edit') {
                add_action('admin_enqueue_scripts', array(&$this, 'wp_enqueue_script_for_edit'));
            }
            if ($filename == 'new') {
                add_action('admin_enqueue_scripts', array(&$this, 'wp_enqueue_script_for_new'));
            }
            if ($filename == 'list') {
                add_action('admin_enqueue_scripts', array(&$this, 'wp_enqueue_script_for_listing'));
            }
            // add_action('admin_init', array(&$this, 'register'));
        }

        function wp_enqueue_script_for_both($hook)
        {

            if ('post-new.php' == $hook || $hook == 'post.php') {
                //  print_r($hook);
                $this->wp_enqueue_script_for_id($hook);
            }
        }

        function wp_enqueue_script_for_listing($hook)
        {
            if ('edit.php' == $hook) {
                // print_r($hook);
                $this->wp_enqueue_script_for_id($hook);
            }
        }

        function wp_enqueue_script_for_edit($hook)
        {
            if ('post.php' == $hook) {
                // print_r($hook);
                $this->wp_enqueue_script_for_id($hook);
            }
        }

        function wp_enqueue_script_for_new($hook)
        {
            if ('post-new.php' == $hook) {
                //  print_r($hook);
                $this->wp_enqueue_script_for_id($hook);
            }
        }

        private function wp_enqueue_script_for_id($hook)
        {
            $screen = get_current_screen();
            if ($screen->post_type == $this->post_type) {
                if (isset($this->style_script_id))
                    wp_enqueue_style($this->style_script_id);

                wp_enqueue_script($this->script_id);
                $this->check_localize($hook);
            }
        }

        private function check_localize($hook)
        {
            if ($this->localized_id_handler) {
                global $post;
                $arr = array();
                foreach ($this->localize_keys as $name) {
                    $g = get_post_meta($post->ID, $name, true);
                    $arr[$name] = empty($g) ? "" : $g;
                }
                $arr['page'] = $hook;
                $arr['post_id'] = $post->ID;
                if ('post-new.php' == $hook)
                    $arr['hide_metabox'] = $this->hidden_metaboxes;
                if ('post.php' == $hook)
                    $arr['show_metabox'] = $this->hidden_metaboxes;


                //print_r($this->localized_id_handler);
                wp_localize_script($this->localized_id_handler, $this->localized_object_name, array_merge($arr, $this->localize_merge_array));
            }
        }

        public function single_harden($fieldname)
        {

        }

        public function harden($args = array(), $field_prefix = '')
        {
            if (empty($args)) return;
            foreach ($args as $key => $n) {
                $fullkey = $field_prefix . $key;
            }
        }

        /**
         * @param $title_place_holder
         */
        public function add_title_input_place_holder($title_place_holder)
        {

            $this->title_text_input = $title_place_holder;

            add_filter('enter_title_here', array(&$this, 'title_text_input'));
        }

        private $title_text_input;

        public function title_text_input($title)
        {
            $screen = get_current_screen();
            if (isset($screen->post_type))
                if ($screen->post_type == $this->post_type) {
                    return $this->title_text_input;
                }

            return $title;
        }


        private $publish_button_label;

        public function change_publish_button_label($newlabel)
        {
            $this->publish_button_label = $newlabel;
            add_filter('gettext', array(&$this, 'change_publish_button'), 10, 2);
        }

        function change_publish_button($translation, $text)
        {
            global $typenow;
            if ($text == 'Publish' && $typenow == $this->post_type)
                return $this->publish_button_label;

            return $translation;
        }

        /**
         * Save post metadata when a post is saved.
         *
         * @param int $post_id The ID of the post.
         * @internal param $object_class
         */
        function save_action($post_id)
        {

            if (!isset($_POST['post_type'])) return;
            // If this isn't a 'book' post, don't update it.
            if ($this->post_type != $_POST['post_type']) {
                return;
            }
            /*     if (class_exists($this->save_action_cb)) {
                     call_user_func(array($this->save_action_cb, $post_id));
                 }*/

            /*
             * We need to verify this came from our screen and with proper authorization,
             * because the save_post action can be triggered at other times.
             */

            // Check if our nonce is set.
            if (!isset($_POST[$this->metabox_id . '_nonce'])) {
                return;
            }

            // Verify that the nonce is valid.
            if (!wp_verify_nonce($_POST[$this->metabox_id . '_nonce'], $this->metabox_id)) {
                echo "nonce is invalid";
                return;
            }

            // If this is an autosave, our form has not been submitted, so we don't want to do anything.
            if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
                return;
            }


            // Check the user's permissions.

            if (!current_user_can('edit_page', $post_id)) {
                return;
            }


            /* OK, its safe for us to save the data now. */

            // Make sure that it is set.
            foreach ($this->update_keys as $k) {
                if (!isset($_POST[$k])) {
                    return;
                }
                // Sanitize user input.
                $field_val = $_POST[$k];
                $field_val = sanitize_text_field($field_val);
                // Update the meta field in the database.
                update_post_meta($post_id, $k, $field_val);
            }
        }

        private $metabox_id, $metabox_title, $metabox_html = null, $metabox_cb = null, $update_keys = array();
        private $save_action_cb;

        /**
         * You can place a callback array on the $external_cb or string generated from the html format
         * @param $metabox_id
         * @param $name
         * @param $render_call
         * @param $update_keys
         * @param $save_action_cb
         * @internal param $external_cb
         * @return $this
         */
        function add_metabox($metabox_id, $name, $render_call, $update_keys = null, $save_action_cb = null)
        {
            $meta_box_instance = new self($this->post_type);

            if (isset($update_keys)) $this->update_keys = $update_keys;
            if (isset($save_action_cb)) $this->save_action_cb = $save_action_cb;

            $meta_box_instance->do_meta_boxes($metabox_id, $name, $render_call);
            return $this;
        }


        /**
         * only for add_metabox
         * @param $metabox_id
         * @param $name
         * @param null $render_call
         * @internal param null $external_cb
         */
        function do_meta_boxes($metabox_id, $name, $render_call = null)
        {
            $this->metabox_id = $metabox_id;
            $this->metabox_title = $name;
            if (is_array($render_call)) {
                $this->metabox_cb = $render_call;
            } else {
                $this->metabox_html = $render_call;
            }
            add_action('add_meta_boxes', array(&$this, 'support_metabox_cb'));
            add_action('save_post', array(&$this, 'save_action'));
        }

        /**
         * no direct calling
         */
        function support_metabox_cb()
        {
            add_meta_box($this->metabox_id, $this->metabox_title, array(&$this, 'meta_box_render_cb'), $this->post_type);
        }

        /**
         * no direct calling
         */
        function meta_box_render_cb($post)
        {
            wp_nonce_field($this->metabox_id, $this->metabox_id . '_nonce');
            //    print_r($post);
            //TODO: there is still bugs need to be fixed.
            //the _nonce cannot be validated.
            if (isset($this->metabox_cb)) {
                $cb = $this->metabox_cb;
                call_user_func_array($cb, array($post, $this->metabox_id));
            } else if (isset($this->metabox_html)) {
                echo $this->metabox_html;
            }
        }

    }
endif;

/* sample code
$report_panel_support = new adminsupport(HKM_REPORT);
$report_panel_support->add_title_input_place_holder(__("Enter Job Report ID", HKM_LANGUAGE_PACK));
$report_panel_support->change_publish_button_label(__("Create New Job Report", HKM_LANGUAGE_PACK));
$report_panel_support->add_script_name('both', 'admin_report_js');
$report_panel_support->add_style('cms_report_panel_css');
$report_panel_support->load_admin_valuables('admin_report_js', 'jp_status', array(
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
);
$report_panel_support

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

$report_panel_support->add_hide_metaboxes_on_new_post(
    array(
        'report_template_list',
        'report_book_content'
    )
);*/