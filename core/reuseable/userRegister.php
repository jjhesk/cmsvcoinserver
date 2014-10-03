<?php

/**
 * Created by PhpStorm.
 * User: Hesk
 * Date: 14年8月6日
 * Time: 上午11:59
 */

defined('ABSPATH') || exit;

if (!class_exists('userRegister')) {
    class userRegister
    {
        public function __construct()
        {

        }

        /**
         * @param $login_name
         * @param $user_email
         * @param $role
         * @param array $extrafields
         * @param $pwd
         * @throws Exception
         */
        public function newUser($login_name, $user_email, $role, $extrafields = array(), $pwd)
        {
            try {
                $this->create_user_account($login_name, $user_email, $role, $extrafields, $pwd);
            } catch (Exception $e) {
                throw $e;
            }
        }

        /**
         * @param $login_name
         * @param $user_email
         * @param $role
         * @param array $extrafields
         * @throws Exception
         */
        public function newUserRandomPass($login_name, $user_email, $role, $extrafields = array())
        {
            try {
                $this->create_user_account($login_name, $user_email, $role, $extrafields, wp_generate_password($length = 12, $include_standard_special_chars = TRUE));
            } catch (Exception $e) {
                throw $e;
            }
        }
        /*
            public static function UpdateUserMeta($user_id, $data)
            {
                if (is_array($data)) {
                    foreach ($data as $key => $value) {
                        update_user_meta($user_id, $key, $value);
                    }
                }
            }

            public static function AddUserMeta($user_id, $data)
            {
                foreach ($data as $key => $value) {
                    add_user_meta($user_id, $key, $value);
                }
            }*/

        /**
         * @param $user_name
         * @return string
         */
        protected static function get_unique_new_username($user_name)
        {
            $returnUsername = '';
            if (is_numeric(username_exists($user_name))) {
                $check_same_id = 0;
                while (!is_null(username_exists($user_name))) {
                    $check_same_id++;
                    $returnUsername = $user_name . $check_same_id;
                }
            } else {
                $returnUsername = $user_name;
            }
            return $returnUsername;
        }

        public static function user_reg_action_cb($ID)
        {
            ///debugoc::upload_bmap_log(print_r("new CP" . $ID, true), 29291);
        }

        /**
         * @param $login_name
         * @param $user_email
         * @param $role
         * @param array $extrafields
         * @param $pwd
         * @throws Exception
         * @return WP_User
         */

        protected static function create_user_account($login_name, $user_email, $role, $extrafields = array(), $pwd)
        {
            try {
                // $pwd = !$generate_password? wp_generate_password($length = 12, $include_standard_special_chars = TRUE);
                add_action("user_register", array(__CLASS__, "user_reg_action_cb"), 10, 1);
                add_action("user_register", array(__CLASS__, "user_reg_action_cb"), 10, 1);
                $user_id = wp_create_user(self::get_unique_new_username($login_name), $pwd, $user_email);
                remove_action("user_register", array(__CLASS__, "user_reg_action_cb"));
                $user = new WP_User($user_id);
               /* $default = array(
                    'ID' => $user_id,
                    'role' => $role,
                    'display_name' => $login_name,
                    'first_name' => "",
                    'last_name' => "",
                    'temppass' => $pwd,
                );
                $args = wp_parse_args($extrafields, $default);*/
                foreach ($extrafields as $key => $val) {
                    update_user_meta($user_id, $key, $val);
                }
                //  debugoc::upload_bmap_log(print_r($args, true), 29291);
                //wp_insert_user($args);
                $user->remove_role('subscriber');
                $user->add_role($role);
                return $user;
            } catch (Exception $e) {
                throw $e;
            }
        }


        /**
         * Handles sending password retrieval email to user.
         *
         * @uses $wpdb WordPress Database object
         * @param string $user_login User Login or Email or User ID
         * @return bool true on success false on error
         */
        public static function retrieve_password($user_login)
        {
            global $wpdb, $current_site;
            if (empty($user_login)) {
                //
                return false;
            } else if (is_numeric($user_login)) {
                $user_data = get_user_by('id', $user_login);
            } else if (strpos($user_login, '@')) {
                $user_data = get_user_by('email', trim($user_login));
                if (empty($user_data))
                    return false;
            } else {
                $login = trim($user_login);
                $user_data = get_user_by('login', $login);
            }

            do_action('lostpassword_post');

            if (!$user_data)
                return false;

            // redefining user_login ensures we return the right case in the email
            $user_login = $user_data->user_login;
            $user_email = $user_data->user_email;

            do_action('retreive_password', $user_login);
            // Misspelled and deprecated
            do_action('retrieve_password', $user_login);

            $allow = apply_filters('allow_password_reset', true, $user_data->ID);

            if (!$allow)
                return false;
            else if (is_wp_error($allow))
                return false;

            $key = $wpdb->get_var($wpdb->prepare("SELECT user_activation_key FROM $wpdb->users WHERE user_login = %s", $user_login));
            if (empty($key)) {
                // Generate something random for a key...
                $key = wp_generate_password(20, false);
                do_action('retrieve_password_key', $user_login, $key);
                // Now insert the new md5 key into the db
                $wpdb->update($wpdb->users, array('user_activation_key' => $key), array('user_login' => $user_login));
            }
            $message = __('Someone requested that the password be reset for the following account:') . "\r\n\r\n";
            $message .= network_home_url('/') . "\r\n\r\n";
            $message .= sprintf(__('Username: %s'), $user_login) . "\r\n\r\n";
            $message .= __('If this was a mistake, just ignore this email and nothing will happen.') . "\r\n\r\n";
            $message .= __('To reset your password, visit the following address:') . "\r\n\r\n";
            $message .= '<' . network_site_url("wp-login.php?action=rp&key=$key&login=" . rawurlencode($user_login), 'login') . ">\r\n";

            if (is_multisite())
                $blogname = $GLOBALS['current_site']->site_name;
            else
                // The blogname option is escaped with esc_html on the way into the database in sanitize_option
                // we want to reverse this for the plain text arena of emails.
                $blogname = wp_specialchars_decode(get_option('blogname'), ENT_QUOTES);

            $title = sprintf(__('[%s] Password Reset'), $blogname);

            $title = apply_filters('retrieve_password_title', $title);
            $message = apply_filters('retrieve_password_message', $message, $key);

            if ($message && !wp_mail($user_email, $title, $message))
                wp_die(__('The e-mail could not be sent.') . "<br />\n" . __('Possible reason: your host may have disabled the mail() function...'));

            return true;
        }

    }
}