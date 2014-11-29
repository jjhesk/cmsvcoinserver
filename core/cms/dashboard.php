<?php
/**
 * Created by HKM Corporation.
 * User: Hesk
 * Date: 14年10月24日
 * Time: 上午11:40
 */
if (!class_exists('dashboard')):
    class dashboard
    {
        protected $meta_list, $user;

        function __construct($settings = array())
        {
            global $current_user;
            $this->user = $current_user;

            /** this is the part to remove the unwanted items **/
            add_action('admin_bar_menu', array($this, 'remove_wp_preset_buttons'), 999);
            add_action('admin_init', array($this, 'remove_dashboard'));
            add_filter('admin_footer_text', array($this, 'remove_footer_admin'));
            add_action('admin_menu', array($this, 'wps_hide_update_notice'));

        }

        function __destruct()
        {

        }

        public function wps_hide_update_notice()
        {
            if (!current_user_can('manage_options')) {
                remove_action('admin_notices', 'update_nag', 3);
            }
        }

        public function remove_footer_admin()
        {
            echo '<span id="footer-thankyou" class="developed by hkm"></span>';
        }

        public function remove_dashboard()
        {
            remove_meta_box('dashboard_primary', 'dashboard', 'core');
            remove_meta_box('dashboard_recent_comments', 'dashboard', 'normal');
            remove_meta_box('dashboard_quick_press', 'dashboard', 'side');
            remove_meta_box('dashboard_right_now', 'dashboard', 'normal');
        }

        public function remove_wp_preset_buttons($wp_admin_bar)
        {
            /**
             * my-account – link to your account (avatars disabled)
             * my-account-with-avatar – link to your account (avatars enabled)
             * my-blogs – the “My Sites” menu if the user has more than one site
             * get-shortlink – provides a Shortlink to that page
             * edit – link to the Edit/Write-Post page
             * new-content – link to the “Add New” dropdown list
             * comments – link to the “Comments” dropdown
             * appearance – link to the “Appearance” dropdown
             * updates – the “Updates” dropdown
             */
            $wp_admin_bar->remove_node('wp-logo');
            $wp_admin_bar->remove_node('comments');
            if ($this->user->roles[0] != "administrator") {
                $wp_admin_bar->remove_node('edit');
                $wp_admin_bar->remove_node('new-content');
            } else {
                $wp_admin_bar->remove_node('edit');
            }
        }
    }
endif;