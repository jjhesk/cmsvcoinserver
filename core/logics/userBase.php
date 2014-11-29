<?php

/**
 * Created by HKM Corporation.
 * User: Hesk
 * Date: 14年7月31日
 * Time: 下午12:10
 */
class userBase
{


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
    }

    public static function get_unique_new_username($user_name)
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

        //  do_action('retreive_password', $user_login);
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

    public static function gf_add_token($entry_id, $form_id)
    {
        //generate token 64bit
        //$val
        global $wpdb;

    }

    /**
     *
     * find the entry id by token
     * verify token from the entry
     * success -> add user
     * failure -> return failure message
     *
     * 1 - success and user is added
     * 1001 - entry id not exist
     * 1002 - token is not valid
     * 1003 - user cannot be added or created due to email exist
     * 1004 - user cannot be added or created due to user name exist
     *
     * @param $entry_id
     * @param $token
     */
    public static function gf_verify_token_from_mail($entry_id, $token)
    {


        //   return ;
    }


    /**
     * @param $q_results
     * @return string
     */
    protected static function query_result_ids_string(WP_User_Query $q_results)
    {
        $ids = array();
        // User Loop
        if (!empty($q_results->results)) {
            foreach ($q_results->results as $user) {
                $ids[] = $user->ID;
            }
        }
        return implode(",", $ids);
    }

    /**
     * @param WP_User_Query $q_results
     * @param array $default
     * @return array
     */
    protected static function query_result_options_metabox(WP_User_Query $q_results, $default = array("0" => "select a CP"))
    {
        $options = $default;
        // User Loop
        if (!empty($q_results->results)) {
            foreach ($q_results->results as $user) {
                $options[$user->ID] = "[" . $user->ID . "] " . get_user_meta($user->ID, "cp_cert", true);
            }
        }
        return $options;
    }

    protected static function ui_query_select(WP_User_Query $query_result, $field_name, $default_select, $field_id)
    {
        //  if (empty($query_result->results)) return "";
        $ui = new ui_handler();
        $ar = self::query_result_options_metabox($query_result);
        $ui->options_ui_from_series($ar, $field_name, $default_select, $field_id);
        return $ui;
    }


    /**
     * if the value is given from the db user table
     * @param $userID
     * @param $field
     * @return mixed
     */
    public static function getVal($userID, $field)
    {
        // $user_info = get_userdata($UserID);
        return get_user_meta($userID, $field, TRUE);
    }

    public static function getName($userID)
    {
        $user_info = get_userdata($userID);
        //print_r($user_info -> display_name);
        return isset($user_info->display_name) ? $user_info->display_name : "There is no such user from the id" . $userID . " line@44 oc_db_account.php";
    }

    public static function has_role_ByUserID($UserID, $roleKey)
    {
        $user_info = get_userdata($UserID);
        return self::hasRole($roleKey, $user_info->roles);
    }

    /**
     * Check if the role key is in the function
     * @param $roleKey
     * @return bool
     */
    public static function has_role($roleKey)
    {
        $user_info = wp_get_current_user();
        return self::hasRole($roleKey, $user_info->roles);
    }


    /**
     * @param null $required_roles
     * @param $role_of_user
     * @return bool
     */
    protected static function hasRole($required_roles = null, $role_of_user)
    {
        if (isset($required_roles)) {
            if (is_array($required_roles)) {
                $exclusive = array_intersect($required_roles, $role_of_user);
                return count($exclusive) > 0;
            } else return in_array($required_roles, $role_of_user);
        } else return FALSE;
    }

    /**
     * check the double email from the given information for email and the user ID
     * @param $email
     * @param $user_id
     * @return bool
     */
    public static function check_email_for_double($email, $user_id)
    {
        global $wpdb;
        $prepared = $wpdb->prepare('SELECT * FROM ' . $wpdb->users . '  WHERE user_email=%s', $email);
        $row = $wpdb->get_row($prepared);
        if ($row) {
            return intval($row->ID) != intval($user_id);
        } else {
            //there is no existing email in the system
            return false;
        }
    }

    private static function create_new_cp($ID)
    {
        debugoc::upload_bmap_log(print_r("new CP" . $ID, true), 29291);
    }

    /**
     * @param $login_name
     * @param $user_email
     * @param $role
     * @param array $extrafields
     * @return WP_User
     * @throws Exception
     */

    protected static function create_user_account($login_name, $user_email, $role, $extrafields = array())
    {
        try {
            $random_password = wp_generate_password($length = 12, $include_standard_special_chars = TRUE);
            if ($role == 'cp') {
                add_action("user_register", array("oc_db_account", "create_new_cp"), 10, 1);
            } else if ($role == 'cr') {
            }
            add_action("user_register", array("oc_db_account", "create_new_cp"), 10, 1);
            $user_id = wp_create_user(self::get_unique_new_username($login_name), $random_password, $user_email);
            if ($role == 'cp') {
                remove_action("user_register", array("oc_db_account", "create_new_cp"));
            } else if ($role == 'cr') {
            }
            $user = new WP_User($user_id);
            $default = array(
                'ID' => $user_id,
                'role' => $role,
                'display_name' => $login_name,
                'first_name' => "",
                'last_name' => "",
                'temppass' => $random_password,
            );
            $args = wp_parse_args($extrafields, $default);
            foreach ($extrafields as $key => $val) {
                update_user_meta($user_id, $key, $val);
            }
            debugoc::upload_bmap_log(print_r($args, true), 29291);
            //wp_insert_user($args);
            $user->remove_role('subscriber');
            $user->add_role($role);
            return $user;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public static function check_api_login()
    {
        if (isset($_POST['token'])) {
            $Instance = new self($_POST['token']);
        }


    }
} 